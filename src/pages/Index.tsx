
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import CampaignGrid from '@/components/CampaignGrid';
import Stats from '@/components/Stats';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <CampaignGrid />
        <Features />
        <Stats />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
