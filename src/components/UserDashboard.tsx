import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, ExternalLink, Users, Target, Package, TrendingUp, Loader2 } from 'lucide-react';
import { useGetUserCampaignsQuery } from '@/store/campaignsApi';
import { useGetUserParticipationsQuery } from '@/store/participationsApi';
import { useAuth } from '@/contexts/AuthContext';
import { Campaign } from '@/types/database';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const { user } = useAuth();
  const { data: userCampaigns, isLoading: campaignsLoading, error: campaignsError } = useGetUserCampaignsQuery(user?.id || '', {
    skip: !user?.id
  });
  const { data: userParticipations, isLoading: participationsLoading, error: participationsError } = useGetUserParticipationsQuery(user?.id || '', {
    skip: !user?.id
  });

  const isLoading = campaignsLoading || participationsLoading;
  const error = campaignsError || participationsError;

  // Données adaptées pour la compatibilité avec l'ancien format
  const adaptedUserCampaigns = userCampaigns && userParticipations ? {
    created: userCampaigns,
    participated: userParticipations.map(p => ({
      ...p.campaigns,
      user_quantity: p.quantity,
    }))
  } : null;

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertDescription>
            Vous devez être connecté pour accéder à votre dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>
            Erreur lors du chargement de vos données. Veuillez réessayer plus tard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const myCampaigns = adaptedUserCampaigns?.created || [];
  const joinedCampaigns = adaptedUserCampaigns?.participated || [];

  // Statistiques
  const totalCampaignsCreated = myCampaigns.length;
  const totalCampaignsJoined = joinedCampaigns.length;
  const completedCampaigns = myCampaigns.filter(c => c.status === 'completed').length;

  const CampaignCard = ({ campaign, isOwner = false, userQuantity }: { 
    campaign: Campaign & { user_quantity?: number }, 
    isOwner?: boolean,
    userQuantity?: number 
  }) => {
    // Pour les nouvelles campagnes, on a besoin de calculer la progression à partir des participations
    // Dans ce contexte simplifié, on utilisera le statut pour déterminer si c'est complété
    const isCompleted = campaign.status === 'completed';

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg mb-2">{campaign.product_name}</CardTitle>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {campaign.description}
              </p>
            </div>
            <Badge variant={isCompleted ? "default" : "secondary"}>
              {isCompleted ? "Complétée" : campaign.status === 'open' ? "Active" : "Annulée"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Prix unitaire:</span>
                <p className="font-semibold">{campaign.unit_price}€</p>
              </div>
              <div>
                <span className="text-muted-foreground">MOQ:</span>
                <p className="font-semibold">{campaign.moq} unités</p>
              </div>
              <div>
                <span className="text-muted-foreground">Statut:</span>
                <p className="font-semibold">{campaign.status === 'open' ? 'Ouverte' : campaign.status === 'completed' ? 'Complétée' : 'Annulée'}</p>
              </div>
              {!isOwner && userQuantity && (
                <div>
                  <span className="text-muted-foreground">Ma quantité:</span>
                  <p className="font-semibold">{userQuantity} unités</p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(campaign.product_link, '_blank')}
                disabled={!campaign.product_link}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Voir produit
              </Button>
              {isOwner && (
                <Button variant="outline" size="sm">
                  <Users className="h-4 w-4 mr-1" />
                  Participants
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Mon Dashboard</h1>
            <p className="text-muted-foreground">
              Gérez vos campagnes et suivez vos participations
            </p>
          </div>
          <Link to="/create-campaign">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle campagne
            </Button>
          </Link>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Package className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{totalCampaignsCreated}</p>
                  <p className="text-sm text-muted-foreground">Campagnes créées</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{totalCampaignsJoined}</p>
                  <p className="text-sm text-muted-foreground">Campagnes rejointes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Target className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{completedCampaigns}</p>
                  <p className="text-sm text-muted-foreground">Objectifs atteints</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="created" className="space-y-6">
          <TabsList>
            <TabsTrigger value="created">
              Mes campagnes ({totalCampaignsCreated})
            </TabsTrigger>
            <TabsTrigger value="joined">
              Participations ({totalCampaignsJoined})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="created" className="space-y-4">
            {myCampaigns.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myCampaigns.map((campaign) => (
                  <CampaignCard 
                    key={campaign.id} 
                    campaign={campaign} 
                    isOwner={true}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Aucune campagne créée
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Créez votre première campagne d'achat groupé pour commencer
                  </p>
                  <Link to="/create-campaign">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Créer une campagne
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="joined" className="space-y-4">
            {joinedCampaigns.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {joinedCampaigns.map((campaign) => (
                  <CampaignCard 
                    key={campaign.id} 
                    campaign={campaign}
                    userQuantity={campaign.user_quantity}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Aucune participation
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Rejoignez des campagnes d'achat groupé pour économiser
                  </p>
                  <Link to="/">
                    <Button>
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Découvrir les campagnes
                    </Button>
                  </Link>
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
