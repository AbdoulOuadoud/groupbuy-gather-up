
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import JoinCampaignModal from './JoinCampaignModal';
import { CampaignWithParticipations } from '@/types/database';

interface CampaignCardProps {
  campaign: CampaignWithParticipations;
}

const CampaignCard = ({ campaign }: CampaignCardProps) => {
  const currentQuantity = campaign.total_quantity || 0;
  const progress = Math.min((currentQuantity / campaign.moq) * 100, 100);
  const isGoalReached = progress >= 100;

  return (
    <Card className="overflow-hidden hover-scale">
      <div className="relative">
        <img 
          src={campaign.product_image || "/placeholder.svg"} 
          alt={campaign.product_name}
          className="w-full h-48 object-cover"
        />
        <Badge className="absolute top-3 left-3 bg-white/90 text-gray-800">
          Achat groupé
        </Badge>
        {isGoalReached && (
          <Badge className="absolute top-3 right-3 bg-green-500">
            Objectif atteint !
          </Badge>
        )}
      </div>
      
      <CardContent className="p-6">
        <h3 className="font-bold text-lg mb-2">{campaign.product_name}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {campaign.description}
        </p>
        
        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span>Prix unitaire:</span>
            <span className="font-semibold text-primary">{campaign.unit_price}€</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>MOQ:</span>
            <span>{campaign.moq} unités</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Quantité actuelle:</span>
            <span>{currentQuantity} / {campaign.moq}</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Progression</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                isGoalReached ? 'bg-green-500' : 'bg-primary'
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => window.open(campaign.product_link, '_blank')}
            disabled={!campaign.product_link}
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Voir le produit
          </Button>
          <div className="flex-1">
            <JoinCampaignModal
              campaignId={campaign.id}
              campaignTitle={campaign.product_name}
              unitPrice={campaign.unit_price}
              currentQuantity={currentQuantity}
              moq={campaign.moq}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignCard;
