
import React from 'react';
import { ShoppingBag, TrendingDown, Users, Shield, Clock, Globe } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: ShoppingBag,
      title: 'Création facile',
      description: 'Créez une campagne en quelques clics avec les infos du produit Alibaba'
    },
    {
      icon: TrendingDown,
      title: 'Économies garanties',
      description: 'Profitez des prix de gros et économisez jusqu\'à 50% sur vos achats'
    },
    {
      icon: Users,
      title: 'Communauté active',
      description: 'Rejoignez des milliers d\'acheteurs partageant les mêmes besoins'
    },
    {
      icon: Shield,
      title: 'Paiements sécurisés',
      description: 'Transactions protégées avec remboursement en cas de problème'
    },
    {
      icon: Clock,
      title: 'Livraison coordonnée',
      description: 'Organisation automatique de la livraison groupée pour tous'
    },
    {
      icon: Globe,
      title: 'Accès mondial',
      description: 'Accédez aux meilleurs fournisseurs Alibaba du monde entier'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Pourquoi choisir GroupBuy ?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              La plateforme la plus simple et sécurisée pour organiser vos achats groupés sur Alibaba
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="flex flex-col items-center text-center p-6 rounded-lg hover:shadow-md transition-all duration-300 hover-scale"
                >
                  <div className="bg-orange-100 p-4 rounded-full mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
