-- Enable RLS (Row Level Security)
alter table if exists public.profiles enable row level security;
alter table if exists public.campaigns enable row level security;
alter table if exists public.participations enable row level security;

-- Create profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text not null unique,
  full_name text,
  avatar_url text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint profiles_username_length check (char_length(username) >= 3 and char_length(username) <= 30),
  constraint profiles_username_format check (username ~ '^[a-zA-Z0-9_-]+$')
);

-- Create campaigns table
create table if not exists public.campaigns (
  id uuid default gen_random_uuid() primary key,
  created_by uuid references auth.users on delete cascade not null,
  product_name text not null,
  product_image text,
  product_link text,
  description text,
  unit_price numeric(10,2) not null check (unit_price > 0),
  moq integer not null check (moq > 0),
  status text default 'open' not null check (status in ('open', 'completed', 'cancelled')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint campaigns_product_name_length check (char_length(product_name) >= 3)
);

-- Create participations table
create table if not exists public.participations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  campaign_id uuid references public.campaigns on delete cascade not null,
  quantity integer not null check (quantity > 0),
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Ensure a user can only participate once per campaign
  constraint participations_user_campaign_unique unique (user_id, campaign_id)
);

-- RLS Policies for profiles
create policy "Users can view all profiles" 
  on public.profiles for select 
  using (true);

create policy "Users can update their own profile" 
  on public.profiles for update 
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- RLS Policies for campaigns
create policy "Anyone can view open campaigns" 
  on public.campaigns for select 
  using (status = 'open' or auth.uid() = created_by);

create policy "Authenticated users can create campaigns" 
  on public.campaigns for insert 
  with check (auth.uid() = created_by and auth.uid() is not null);

create policy "Users can update their own campaigns" 
  on public.campaigns for update 
  using (auth.uid() = created_by);

create policy "Users can delete their own campaigns"
  on public.campaigns for delete
  using (auth.uid() = created_by);

-- RLS Policies for participations
create policy "Anyone can view participations" 
  on public.participations for select 
  using (true);

create policy "Authenticated users can add participations" 
  on public.participations for insert 
  with check (auth.uid() = user_id and auth.uid() is not null);

create policy "Users can update their own participations" 
  on public.participations for update 
  using (auth.uid() = user_id);

create policy "Users can delete their own participations" 
  on public.participations for delete 
  using (auth.uid() = user_id);

-- Function to automatically create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
declare
  username_base text;
  username_final text;
  counter integer := 1;
begin
  -- Générer un username de base à partir de l'email
  username_base := split_part(new.email, '@', 1);
  username_base := regexp_replace(username_base, '[^a-zA-Z0-9]', '', 'g');
  username_base := lower(username_base);
  
  -- Si le username de base est trop court, utiliser "user"
  if char_length(username_base) < 3 then
    username_base := 'user';
  end if;
  
  -- Vérifier la disponibilité du username et ajouter un numéro si nécessaire
  username_final := username_base;
  while exists (select 1 from public.profiles where username = username_final) loop
    username_final := username_base || counter::text;
    counter := counter + 1;
  end loop;
  
  -- Créer le profil avec le username généré ou celui fourni dans les métadonnées
  insert into public.profiles (
    id, 
    username, 
    full_name,
    phone
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', username_final),
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone'
  );
  
  return new;
exception
  when others then
    -- En cas d'erreur, on essaie avec un username généré aléatoirement
    insert into public.profiles (id, username)
    values (new.id, 'user_' || substr(new.id::text, 1, 8))
    on conflict (username) do nothing;
    return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function when a new user signs up
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to automatically update campaign status when MOQ is reached
create or replace function public.check_campaign_completion()
returns trigger as $$
declare
  total_quantity integer;
  campaign_moq integer;
begin
  -- Calculer la quantité totale pour cette campagne
  select coalesce(sum(quantity), 0) into total_quantity
  from public.participations
  where campaign_id = coalesce(new.campaign_id, old.campaign_id);
  
  -- Récupérer la MOQ de la campagne
  select moq into campaign_moq
  from public.campaigns
  where id = coalesce(new.campaign_id, old.campaign_id);
  
  -- Mettre à jour le statut si nécessaire
  if total_quantity >= campaign_moq then
    update public.campaigns
    set status = 'completed'
    where id = coalesce(new.campaign_id, old.campaign_id) 
      and status = 'open';
  end if;
  
  return coalesce(new, old);
end;
$$ language plpgsql security definer;

-- Triggers to check campaign completion when participations change
drop trigger if exists on_participation_change on public.participations;
create trigger on_participation_change
  after insert or update or delete on public.participations
  for each row execute procedure public.check_campaign_completion();

-- Create indexes for better performance
create index if not exists profiles_username_idx on public.profiles(username);
create index if not exists profiles_created_at_idx on public.profiles(created_at desc);

create index if not exists campaigns_created_by_idx on public.campaigns(created_by);
create index if not exists campaigns_status_idx on public.campaigns(status);
create index if not exists campaigns_created_at_idx on public.campaigns(created_at desc);
create index if not exists campaigns_product_name_idx on public.campaigns using gin(product_name gin_trgm_ops);

create index if not exists participations_user_id_idx on public.participations(user_id);
create index if not exists participations_campaign_id_idx on public.participations(campaign_id);
create index if not exists participations_joined_at_idx on public.participations(joined_at desc);

-- Enable trigram extension for full-text search (if not already enabled)
create extension if not exists pg_trgm;

-- Create view for campaign statistics
create or replace view public.campaign_stats as
select 
  c.id,
  c.product_name,
  c.unit_price,
  c.moq,
  c.status,
  c.created_at,
  coalesce(sum(p.quantity), 0) as total_quantity,
  count(p.id) as participant_count,
  round((coalesce(sum(p.quantity), 0)::numeric / c.moq * 100), 2) as completion_percentage
from public.campaigns c
left join public.participations p on c.id = p.campaign_id
group by c.id, c.product_name, c.unit_price, c.moq, c.status, c.created_at;

-- Grant permissions on the view
grant select on public.campaign_stats to authenticated;

-- Create function to get user participation summary
create or replace function public.get_user_participation_summary(user_uuid uuid)
returns table (
  total_participations bigint,
  total_quantity bigint,
  active_campaigns bigint,
  completed_campaigns bigint
) as $$
begin
  return query
  select 
    count(p.id) as total_participations,
    coalesce(sum(p.quantity), 0) as total_quantity,
    count(case when c.status = 'open' then 1 end) as active_campaigns,
    count(case when c.status = 'completed' then 1 end) as completed_campaigns
  from public.participations p
  join public.campaigns c on p.campaign_id = c.id
  where p.user_id = user_uuid;
end;
$$ language plpgsql security definer;

-- Grant execute permission on the function
grant execute on function public.get_user_participation_summary(uuid) to authenticated;
