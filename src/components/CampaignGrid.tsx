import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, SlidersHorizontal, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import CampaignCard from './CampaignCard';
import { useGetCampaignsQuery } from '@/store/campaignsApi';

const CampaignGrid = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  
  const { data: campaigns, isLoading, error } = useGetCampaignsQuery();

  // Filtrage et tri des campagnes
  const filteredAndSortedCampaigns = React.useMemo(() => {
    if (!campaigns) return [];
    
    let filtered = campaigns.filter(campaign =>
      campaign.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (campaign.description && campaign.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'price_low':
        filtered.sort((a, b) => a.unit_price - b.unit_price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.unit_price - a.unit_price);
        break;
      case 'progress':
        filtered.sort((a, b) => {
          const progressA = (a.total_quantity || 0) / a.moq;
          const progressB = (b.total_quantity || 0) / b.moq;
          return progressB - progressA;
        });
        break;
      default: // popular
        filtered.sort((a, b) => (b.total_quantity || 0) - (a.total_quantity || 0));
    }

    return filtered;
  }, [campaigns, searchTerm, sortBy]);

  if (error) {
    return (
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertDescription>
              Erreur lors du chargement des campagnes. Veuillez réessayer plus tard.
            </AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Campagnes d'achat groupé actives
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez les meilleures opportunités d'achat groupé et économisez sur vos produits préférés
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher des produits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 bg-white">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="popular">Plus populaire</SelectItem>
                <SelectItem value="newest">Plus récent</SelectItem>
                <SelectItem value="price_low">Prix croissant</SelectItem>
                <SelectItem value="price_high">Prix décroissant</SelectItem>
                <SelectItem value="progress">Progression</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Chargement des campagnes...</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedCampaigns.map((campaign) => (
                  <CampaignCard
                    key={campaign.id}
                    campaign={campaign}
                  />
                ))}
              </div>

              {filteredAndSortedCampaigns.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    {searchTerm 
                      ? `Aucune campagne trouvée pour "${searchTerm}"`
                      : "Aucune campagne active pour le moment."
                    }
                  </p>
                  {!searchTerm && (
                    <p className="text-muted-foreground mt-2">
                      Soyez le premier à créer une campagne !
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default CampaignGrid;
