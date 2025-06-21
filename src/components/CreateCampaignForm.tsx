import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useCreateCampaignMutation } from "@/store/campaignsApi";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CreateCampaignFormProps {
  onSuccess?: () => void;
}

const CreateCampaignForm = ({ onSuccess }: CreateCampaignFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [createCampaign, { isLoading }] = useCreateCampaignMutation();
  
  const [formData, setFormData] = useState({
    product_name: '',
    description: '',
    product_link: '',
    product_image: '',
    unit_price: '',
    moq: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.product_name.trim()) {
      newErrors.product_name = 'Le nom du produit est requis';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }
    if (!formData.product_link.trim()) {
      newErrors.product_link = 'Le lien du produit est requis';
    }
    if (!formData.unit_price || isNaN(Number(formData.unit_price)) || Number(formData.unit_price) <= 0) {
      newErrors.unit_price = 'Le prix unitaire doit être un nombre positif';
    }
    if (!formData.moq || isNaN(Number(formData.moq)) || Number(formData.moq) <= 0) {
      newErrors.moq = 'La MOQ doit être un nombre positif';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔄 Début de handleSubmit');

    if (!user) {
      console.log('❌ Utilisateur non connecté');
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour créer une campagne.",
        variant: "destructive"
      });
      return;
    }

    console.log('✅ Utilisateur connecté:', user.id);

    if (!validateForm()) {
      console.log('❌ Validation du formulaire échouée');
      return;
    }

    console.log('✅ Validation du formulaire réussie');

    try {
      console.log('📤 Envoi des données de campagne...');
      const result = await createCampaign({
        product_name: formData.product_name,
        description: formData.description,
        product_link: formData.product_link,
        product_image: formData.product_image || null,
        unit_price: Number(formData.unit_price),
        moq: Number(formData.moq),
        status: 'open',
        created_by: user.id
      }).unwrap();
      
      console.log('✅ Campagne créée avec Redux:', result);
      
      toast({
        title: "Campagne créée !",
        description: "Votre campagne d'achat groupé a été créée avec succès.",
      });

      // Reset form
      setFormData({
        product_name: '',
        description: '',
        product_link: '',
        product_image: '',
        unit_price: '',
        moq: ''
      });

      onSuccess?.();
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de la création de la campagne.",
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <Alert>
            <AlertDescription>
              Vous devez être connecté pour créer une campagne.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Créer une nouvelle campagne d'achat groupé</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="product_name">Nom du produit *</Label>
            <Input
              id="product_name"
              name="product_name"
              value={formData.product_name}
              onChange={handleInputChange}
              placeholder="Ex: iPhone 15 Pro Max"
              className={errors.product_name ? "border-red-500" : ""}
            />
            {errors.product_name && (
              <p className="text-sm text-red-500">{errors.product_name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Décrivez le produit, ses caractéristiques..."
              rows={4}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="product_link">Lien du produit *</Label>
            <Input
              id="product_link"
              name="product_link"
              type="url"
              value={formData.product_link}
              onChange={handleInputChange}
              placeholder="https://www.alibaba.com/product-detail/..."
              className={errors.product_link ? "border-red-500" : ""}
            />
            {errors.product_link && (
              <p className="text-sm text-red-500">{errors.product_link}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="product_image">URL de l'image (optionnel)</Label>
            <Input
              id="product_image"
              name="product_image"
              type="url"
              value={formData.product_image}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unit_price">Prix unitaire (€) *</Label>
              <Input
                id="unit_price"
                name="unit_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.unit_price}
                onChange={handleInputChange}
                placeholder="1200.00"
                className={errors.unit_price ? "border-red-500" : ""}
              />
              {errors.unit_price && (
                <p className="text-sm text-red-500">{errors.unit_price}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="moq">MOQ (Quantité minimale) *</Label>
              <Input
                id="moq"
                name="moq"
                type="number"
                min="1"
                value={formData.moq}
                onChange={handleInputChange}
                placeholder="10"
                className={errors.moq ? "border-red-500" : ""}
              />
              {errors.moq && (
                <p className="text-sm text-red-500">{errors.moq}</p>
              )}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Création en cours..." : "Créer la campagne"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateCampaignForm;
