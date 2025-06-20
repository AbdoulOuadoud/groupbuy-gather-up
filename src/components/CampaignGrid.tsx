
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import CampaignCard from './CampaignCard';

const CampaignGrid = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  // Mock data pour les campagnes
  const campaigns = [
    {
      id: '1',
      title: 'Écouteurs Bluetooth Sans Fil Premium',
      description: 'Écouteurs haute qualité avec réduction de bruit active, parfaits pour le sport et les déplacements.',
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop',
      unitPrice: 25.99,
      moq: 100,
      currentQuantity: 78,
      participants: 45,
      daysLeft: 12,
      productLink: 'https://alibaba.com/product/123'
    },
    {
      id: '2',
      title: 'Support Téléphone Ajustable Bureau',
      description: 'Support ergonomique universel pour smartphone et tablette, rotation 360° et hauteur réglable.',
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
      unitPrice: 12.50,
      moq: 200,
      currentQuantity: 156,
      participants: 89,
      daysLeft: 8,
      productLink: 'https://alibaba.com/product/456'
    },
    {
      id: '3',
      title: 'Chargeur Rapide USB-C 65W',
      description: 'Chargeur universel compact avec technologie de charge rapide pour ordinateurs portables et smartphones.',
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop',
      unitPrice: 18.75,
      moq: 150,
      currentQuantity: 203,
      participants: 127,
      daysLeft: 5,
      productLink: 'https://alibaba.com/product/789'
    },
    {
      id: '4',
      title: 'Lampe LED Bureau Rechargeable',
      description: 'Lampe de bureau moderne avec 3 modes d\'éclairage, batterie intégrée et port USB pour charger.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      unitPrice: 32.99,
      moq: 80,
      currentQuantity: 45,
      participants: 28,
      daysLeft: 15,
      productLink: 'https://alibaba.com/product/101'
    },
    {
      id: '5',
      title: 'Sac à Dos Ordinateur Portable',
      description: 'Sac à dos professionnel imperméable avec compartiment laptop 15.6", port USB et design anti-vol.',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
      unitPrice: 28.50,
      moq: 120,
      currentQuantity: 67,
      participants: 41,
      daysLeft: 20,
      productLink: 'https://alibaba.com/product/112'
    },
    {
      id: '6',
      title: 'Tapis de Souris Gaming XXL',
      description: 'Tapis de souris grande taille pour gaming, surface lisse, base antidérapante et bordures cousues.',
      image: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=400&h=300&fit=crop',
      unitPrice: 15.99,
      moq: 300,
      currentQuantity: 189,
      participants: 156,
      daysLeft: 7,
      productLink: 'https://alibaba.com/product/131'
    }
  ];

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <SelectItem value="price-low">Prix croissant</SelectItem>
                <SelectItem value="price-high">Prix décroissant</SelectItem>
                <SelectItem value="ending-soon">Fin bientôt</SelectItem>
                <SelectItem value="progress">Progression</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                {...campaign}
              />
            ))}
          </div>

          {filteredCampaigns.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Aucune campagne trouvée pour "{searchTerm}"
              </p>
            </div>
          )}

          <div className="text-center mt-12">
            <Button variant="outline" className="px-8 py-3">
              Voir plus de campagnes
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CampaignGrid;
