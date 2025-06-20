
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, TrendingDown, Shield } from 'lucide-react';

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-orange-50 to-orange-100 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in">
            Achetez ensemble,
            <span className="text-primary"> économisez plus</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
            Rejoignez des milliers d'acheteurs pour obtenir les meilleurs prix sur Alibaba. 
            Créez ou rejoignez des campagnes d'achat groupé et économisez jusqu'à 50%.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-scale-in">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg">
              Découvrir les campagnes
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" className="px-8 py-3 text-lg border-primary text-primary hover:bg-primary hover:text-white">
              Créer ma campagne
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover-scale">
              <Users className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Achat collectif</h3>
              <p className="text-muted-foreground text-center">
                Rassemblez les commandes pour atteindre les MOQ et obtenir les meilleurs tarifs
              </p>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover-scale">
              <TrendingDown className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Prix réduits</h3>
              <p className="text-muted-foreground text-center">
                Économisez jusqu'à 50% grâce aux remises sur quantité des fournisseurs
              </p>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover-scale">
              <Shield className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Sécurisé</h3>
              <p className="text-muted-foreground text-center">
                Plateforme sécurisée avec système de paiement et livraison coordonnée
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
