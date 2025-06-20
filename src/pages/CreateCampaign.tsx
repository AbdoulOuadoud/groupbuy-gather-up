
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CreateCampaignForm from '@/components/CreateCampaignForm';

const CreateCampaign = () => {
  const handleSuccess = () => {
    // Redirection vers le dashboard ou liste des campagnes
    console.log('Campagne créée avec succès');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <CreateCampaignForm onSuccess={handleSuccess} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateCampaign;
