
import React from 'react';
import { ShoppingCart, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-foreground text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <ShoppingCart className="h-8 w-8 text-primary" />
              <h3 className="text-2xl font-bold">GroupBuy</h3>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              La plateforme de référence pour organiser vos achats groupés sur Alibaba. 
              Économisez plus, achetez mieux, ensemble.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="h-4 w-4" />
                <span>contact@groupbuy.fr</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="h-4 w-4" />
                <span>+33 1 23 45 67 89</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin className="h-4 w-4" />
                <span>Paris, France</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Plateforme</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-primary transition-colors">Comment ça marche</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Créer une campagne</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Rejoindre une campagne</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Tarifs</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-primary transition-colors">Centre d'aide</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Signaler un problème</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © 2024 GroupBuy. Tous droits réservés.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-300 hover:text-primary transition-colors text-sm">
                Conditions d'utilisation
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors text-sm">
                Politique de confidentialité
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors text-sm">
                Mentions légales
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
