
import React from 'react';
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, Plus } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white border-b border-accent sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">GroupBuy</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Campagnes
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Comment ça marche
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              À propos
            </a>
          </nav>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="hidden md:flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Créer une campagne</span>
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
