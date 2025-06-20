
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Clock, ExternalLink } from 'lucide-react';

interface CampaignCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  unitPrice: number;
  moq: number;
  currentQuantity: number;
  participants: number;
  daysLeft: number;
  productLink: string;
}

const CampaignCard: React.FC<CampaignCardProps> = ({
  title,
  description,
  image,
  unitPrice,
  moq,
  currentQuantity,
  participants,
  daysLeft,
  productLink
}) => {
  const progress = (currentQuantity / moq) * 100;
  const isCompleted = currentQuantity >= moq;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white border border-accent">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img 
            src={image} 
            alt={title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3">
            <Badge 
              variant={isCompleted ? "default" : "secondary"}
              className={isCompleted ? "bg-green-500 text-white" : "bg-orange-100 text-primary"}
            >
              {isCompleted ? "Objectif atteint" : "En cours"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 text-foreground line-clamp-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{description}</p>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-primary">{unitPrice}€</span>
            <a 
              href={productLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progression</span>
              <span className="font-medium">{currentQuantity}/{moq} unités</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{participants} participants</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{daysLeft} jours</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full bg-primary hover:bg-primary/90"
          disabled={isCompleted}
        >
          {isCompleted ? "Campagne terminée" : "Rejoindre la campagne"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CampaignCard;
