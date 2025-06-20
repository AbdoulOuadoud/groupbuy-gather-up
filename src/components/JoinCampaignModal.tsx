
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Users } from 'lucide-react';

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
  const [quantity, setQuantity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const quantityNum = parseInt(quantity);
      if (quantityNum <= 0) {
        throw new Error('La quantité doit être supérieure à 0');
      }

      // TODO: Intégrer avec Supabase
      console.log('Participation à la campagne:', {
        campaignId,
        quantity: quantityNum
      });

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
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice = quantity ? (parseFloat(quantity) * unitPrice).toFixed(2) : '0.00';
  const remainingQuantity = moq - currentQuantity;

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
              <span>Reste à atteindre:</span>
              <span className={remainingQuantity > 0 ? "text-orange-600" : "text-green-600"}>
                {Math.max(0, remainingQuantity)} unités
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantité souhaitée *</Label>
              <Input
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Ex: 5"
                type="number"
                min="1"
                required
              />
            </div>

            {quantity && (
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="text-sm text-orange-800">
                  <strong>Total à payer: {totalPrice}€</strong>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => setOpen(false)}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={isSubmitting || !quantity}
              >
                {isSubmitting ? "Inscription..." : "Rejoindre"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinCampaignModal;
