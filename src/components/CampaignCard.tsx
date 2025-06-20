
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import JoinCampaignModal from './JoinCampaignModal';

interface CampaignCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  moq: number;
  currentParticipants: number;
  progress: number;
  category: string;
}

const CampaignCard = ({ 
  id,
  title, 
  description, 
  image, 
  price, 
  moq, 
  currentParticipants, 
  progress, 
  category 
}: CampaignCardProps) => {
  const isGoalReached = progress >= 100;

  return (
    <Card className="overflow-hidden hover-scale">
      <div className="relative">
        <img 
          src={image} 
          alt={title}
          className="w-full h-48 object-cover"
        />
        <Badge className="absolute top-3 left-3 bg-white/90 text-gray-800">
          {category}
        </Badge>
        {isGoalReached && (
          <Badge className="absolute top-3 right-3 bg-green-500">
            Objectif atteint !
          </Badge>
        )}
      </div>
      
      <CardContent className="p-6">
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {description}
        </p>
        
        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span>Prix unitaire:</span>
            <span className="font-semibold text-primary">{price}€</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>MOQ:</span>
            <span>{moq} unités</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Participants:</span>
            <span>{currentParticipants}</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Progression</span>
            <span>{progress}%</span>
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
          <Button variant="outline" size="sm" className="flex-1">
            <ExternalLink className="h-4 w-4 mr-1" />
            Voir
          </Button>
          <div className="flex-1">
            <JoinCampaignModal
              campaignId={id}
              campaignTitle={title}
              unitPrice={price}
              currentQuantity={Math.floor((moq * progress) / 100)}
              moq={moq}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignCard;
