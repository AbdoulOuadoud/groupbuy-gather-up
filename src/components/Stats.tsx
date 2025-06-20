
import React from 'react';
import { TrendingUp, Users, ShoppingCart, DollarSign } from 'lucide-react';

const Stats = () => {
  const stats = [
    {
      icon: Users,
      number: '12,547',
      label: 'Utilisateurs actifs',
      suffix: '+'
    },
    {
      icon: ShoppingCart,
      number: '3,891',
      label: 'Campagnes créées',
      suffix: ''
    },
    {
      icon: DollarSign,
      number: '2.8M',
      label: 'Économies réalisées',
      suffix: '€'
    },
    {
      icon: TrendingUp,
      number: '94',
      label: 'Taux de réussite',
      suffix: '%'
    }
  ];

  return (
    <section className="py-16 gradient-orange">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              GroupBuy en chiffres
            </h2>
            <p className="text-lg text-orange-100 max-w-2xl mx-auto">
              Une communauté grandissante qui fait confiance à notre plateforme
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index}
                  className="text-center group"
                >
                  <div className="bg-white/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {stat.number}{stat.suffix}
                  </div>
                  <div className="text-orange-100 font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
