-- Enable RLS (Row Level Security)
alter table if exists public.profiles enable row level security;
alter table if exists public.group_orders enable row level security;
alter table if exists public.group_order_participants enable row level security;

-- Create profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  email text not null,
  full_name text,
  
  constraint profiles_email_key unique (email)
);

-- Create group_orders table
create table if not exists public.group_orders (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  product_name text not null,
  description text not null,
  alibaba_link text not null,
  moq integer not null check (moq > 0),
  estimated_unit_price numeric(10,2) not null check (estimated_unit_price > 0),
  image_url text,
  initial_quantity integer not null check (initial_quantity > 0),
  current_quantity integer default 0 not null check (current_quantity >= 0),
  status text default 'active' not null check (status in ('active', 'completed', 'cancelled'))
);

-- Create group_order_participants table
create table if not exists public.group_order_participants (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  order_id uuid references public.group_orders(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  quantity integer not null check (quantity > 0),
  
  -- Ensure a user can only participate once per order
  constraint group_order_participants_order_user_key unique (order_id, user_id)
);

-- RLS Policies for profiles
create policy "Users can view all profiles" 
  on public.profiles for select 
  using (true);

create policy "Users can update their own profile" 
  on public.profiles for update 
  using (auth.uid() = id);

-- RLS Policies for group_orders
create policy "Anyone can view active group orders" 
  on public.group_orders for select 
  using (status = 'active');

create policy "Users can create group orders" 
  on public.group_orders for insert 
  with check (auth.uid() = user_id);

create policy "Users can update their own group orders" 
  on public.group_orders for update 
  using (auth.uid() = user_id);

-- RLS Policies for group_order_participants
create policy "Anyone can view participants" 
  on public.group_order_participants for select 
  using (true);

create policy "Users can add themselves as participants" 
  on public.group_order_participants for insert 
  with check (auth.uid() = user_id);

create policy "Users can update their own participation" 
  on public.group_order_participants for update 
  using (auth.uid() = user_id);

create policy "Users can delete their own participation" 
  on public.group_order_participants for delete 
  using (auth.uid() = user_id);

-- Function to automatically create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function when a new user signs up
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update current_quantity when participants change
create or replace function public.update_group_order_quantity()
returns trigger as $$
begin
  -- Update the current_quantity in group_orders
  update public.group_orders
  set current_quantity = (
    select coalesce(sum(quantity), 0)
    from public.group_order_participants
    where order_id = coalesce(new.order_id, old.order_id)
  ),
  updated_at = now()
  where id = coalesce(new.order_id, old.order_id);
  
  return coalesce(new, old);
end;
$$ language plpgsql security definer;

-- Triggers to update quantity when participants are added/updated/deleted
drop trigger if exists on_participant_insert on public.group_order_participants;
create trigger on_participant_insert
  after insert on public.group_order_participants
  for each row execute procedure public.update_group_order_quantity();

drop trigger if exists on_participant_update on public.group_order_participants;
create trigger on_participant_update
  after update on public.group_order_participants
  for each row execute procedure public.update_group_order_quantity();

drop trigger if exists on_participant_delete on public.group_order_participants;
create trigger on_participant_delete
  after delete on public.group_order_participants
  for each row execute procedure public.update_group_order_quantity();

-- Create indexes for better performance
create index if not exists group_orders_user_id_idx on public.group_orders(user_id);
create index if not exists group_orders_status_idx on public.group_orders(status);
create index if not exists group_orders_created_at_idx on public.group_orders(created_at desc);
create index if not exists group_order_participants_order_id_idx on public.group_order_participants(order_id);
create index if not exists group_order_participants_user_id_idx on public.group_order_participants(user_id);
