
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, ExternalLink, Users, Target } from 'lucide-react';

// Types temporaires (à remplacer par ceux de Supabase)
interface Campaign {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  unitPrice: number;
  moq: number;
  currentQuantity: number;
  myQuantity?: number;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
}

const UserDashboard = () => {
  // Données mockées - à remplacer par les vraies données Supabase
  const myCampaigns: Campaign[] = [
    {
      id: '1',
      title: 'Écouteurs Bluetooth Premium',
      description: 'Écouteurs sans fil haute qualité',
      unitPrice: 25.50,
      moq: 100,
      currentQuantity: 75,
      status: 'active',
      createdAt: '2024-01-15'
    }
  ];

  const joinedCampaigns: Campaign[] = [
    {
      id: '2',
      title: 'Powerbank 20000mAh',
      description: 'Batterie externe rapide',
      unitPrice: 15.00,
      moq: 200,
      currentQuantity: 180,
      myQuantity: 3,
      status: 'active',
      createdAt: '2024-01-10'
    }
  ];

  const getStatusBadge = (status: string, currentQuantity: number, moq: number) => {
    if (status === 'completed') {
      return <Badge className="bg-green-100 text-green-800">Terminée</Badge>;
    }
    if (status === 'cancelled') {
      return <Badge variant="destructive">Annulée</Badge>;
    }
    if (currentQuantity >= moq) {
      return <Badge className="bg-blue-100 text-blue-800">Objectif atteint</Badge>;
    }
    return <Badge className="bg-orange-100 text-orange-800">En cours</Badge>;
  };

  const CampaignCard = ({ campaign, showMyQuantity = false }: { campaign: Campaign; showMyQuantity?: boolean }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg">{campaign.title}</h3>
          {getStatusBadge(campaign.status, campaign.currentQuantity, campaign.moq)}
        </div>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {campaign.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span>Prix unitaire:</span>
            <span className="font-medium">{campaign.unitPrice}€</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Progression:</span>
            <span className="font-medium">{campaign.currentQuantity} / {campaign.moq}</span>
          </div>
          {showMyQuantity && campaign.myQuantity && (
            <div className="flex justify-between text-sm">
              <span>Ma quantité:</span>
              <span className="font-medium text-primary">{campaign.myQuantity} unités</span>
            </div>
          )}
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-primary rounded-full h-2 transition-all duration-300"
            style={{ width: `${Math.min((campaign.currentQuantity / campaign.moq) * 100, 100)}%` }}
          />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <ExternalLink className="h-4 w-4 mr-1" />
            Voir détails
          </Button>
          {showMyQuantity && campaign.myQuantity && (
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mon Dashboard</h1>
            <p className="text-muted-foreground">
              Gérez vos campagnes d'achat groupé
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle campagne
          </Button>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Target className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{myCampaigns.length}</p>
                  <p className="text-sm text-muted-foreground">Campagnes créées</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{joinedCampaigns.length}</p>
                  <p className="text-sm text-muted-foreground">Campagnes rejointes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">€</span>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {joinedCampaigns.reduce((sum, campaign) => 
                      sum + (campaign.myQuantity || 0) * campaign.unitPrice, 0
                    ).toFixed(2)}€
                  </p>
                  <p className="text-sm text-muted-foreground">Total engagé</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Onglets pour les campagnes */}
        <Tabs defaultValue="created" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="created">Mes campagnes ({myCampaigns.length})</TabsTrigger>
            <TabsTrigger value="joined">Campagnes rejointes ({joinedCampaigns.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="created" className="mt-6">
            {myCampaigns.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myCampaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucune campagne créée</h3>
                  <p className="text-muted-foreground mb-4">
                    Créez votre première campagne d'achat groupé
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Créer une campagne
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="joined" className="mt-6">
            {joinedCampaigns.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {joinedCampaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} showMyQuantity />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucune participation</h3>
                  <p className="text-muted-foreground mb-4">
                    Rejoignez des campagnes d'achat groupé
                  </p>
                  <Button variant="outline">
                    Parcourir les campagnes
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;
