import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useJoinCampaignMutation } from "@/store/participationsApi";
import { useAuth } from "@/contexts/AuthContext";
import { Users, Loader2 } from 'lucide-react';

interface JoinCampaignModalProps {
  campaignId: string;
  campaignTitle: string;
  unitPrice: number;
  currentQuantity: number;
  moq: number;
}

const JoinCampaignModal = ({ 
  campaignId, 
  campaignTitle, 
  unitPrice, 
  currentQuantity, 
  moq 
}: JoinCampaignModalProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [joinCampaign, { isLoading }] = useJoinCampaignMutation();
  const [quantity, setQuantity] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour rejoindre une campagne.",
        variant: "destructive"
      });
      return;
    }

    try {
      const quantityNum = parseInt(quantity);
      if (quantityNum <= 0) {
        throw new Error('La quantité doit être supérieure à 0');
      }

      await joinCampaign({
        user_id: user.id,
        campaign_id: campaignId,
        quantity: quantityNum
      }).unwrap();

      toast({
        title: "Participation enregistrée !",
        description: `Vous avez rejoint la campagne avec ${quantityNum} unité(s).`,
      });

      setQuantity('');
      setOpen(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue.",
        variant: "destructive",
      });
    }
  };

  const totalPrice = quantity ? (parseFloat(quantity) * unitPrice).toFixed(2) : '0.00';
  const remainingQuantity = moq - currentQuantity;

  if (!user) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-full">
            <Users className="h-4 w-4 mr-2" />
            Rejoindre cette campagne
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connexion requise</DialogTitle>
          </DialogHeader>
          <Alert>
            <AlertDescription>
              Vous devez être connecté pour rejoindre une campagne.
            </AlertDescription>
          </Alert>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Users className="h-4 w-4 mr-2" />
          Rejoindre cette campagne
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rejoindre "{campaignTitle}"</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span>Prix unitaire:</span>
              <span className="font-semibold">{unitPrice}€</span>
            </div>
            <div className="flex justify-between">
              <span>Quantité actuelle:</span>
              <span>{currentQuantity} / {moq}</span>
            </div>
            <div className="flex justify-between">
              <span>Quantité restante:</span>
              <span className="text-orange-600 font-medium">{remainingQuantity} unités</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantité souhaitée</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max={remainingQuantity}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Ex: 2"
                required
              />
            </div>

            {quantity && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex justify-between">
                  <span>Total estimé:</span>
                  <span className="font-bold text-blue-600">{totalPrice}€</span>
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => setOpen(false)}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading || !quantity}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Inscription..." : "Rejoindre"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinCampaignModal;
