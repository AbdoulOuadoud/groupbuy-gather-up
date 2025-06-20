
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface CreateCampaignFormProps {
  onSuccess?: () => void;
}

const CreateCampaignForm = ({ onSuccess }: CreateCampaignFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    productLink: '',
    imageUrl: '',
    unitPrice: '',
    moq: '',
    initialQuantity: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Intégrer avec Supabase
      console.log('Données de la campagne:', formData);
      
      toast({
        title: "Campagne créée !",
        description: "Votre campagne d'achat groupé a été créée avec succès.",
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        productLink: '',
        imageUrl: '',
        unitPrice: '',
        moq: '',
        initialQuantity: ''
      });

      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la campagne.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Créer une campagne d'achat groupé
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Nom du produit *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Ex: Écouteurs Bluetooth Premium"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Décrivez le produit et pourquoi vous souhaitez l'acheter en groupe..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="productLink">Lien Alibaba *</Label>
            <Input
              id="productLink"
              name="productLink"
              value={formData.productLink}
              onChange={handleInputChange}
              placeholder="https://www.alibaba.com/product-detail/..."
              type="url"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL de l'image (optionnel)</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              placeholder="https://..."
              type="url"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unitPrice">Prix unitaire (€) *</Label>
              <Input
                id="unitPrice"
                name="unitPrice"
                value={formData.unitPrice}
                onChange={handleInputChange}
                placeholder="25.50"
                type="number"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="moq">MOQ (Quantité min.) *</Label>
              <Input
                id="moq"
                name="moq"
                value={formData.moq}
                onChange={handleInputChange}
                placeholder="100"
                type="number"
                min="1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="initialQuantity">Ma quantité *</Label>
              <Input
                id="initialQuantity"
                name="initialQuantity"
                value={formData.initialQuantity}
                onChange={handleInputChange}
                placeholder="10"
                type="number"
                min="1"
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Création en cours..." : "Créer la campagne"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateCampaignForm;
