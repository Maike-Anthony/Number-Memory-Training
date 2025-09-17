'use client';

import { useState } from 'react';
import ConstantsList from '@/app/components/ConstantsList';
import Training from '@/app/components/Training';
import { Constant } from '@/types';

export default function Home() {
  const [currentView, setCurrentView] = useState<'list' | 'training'>('list');
  const [selectedConstant, setSelectedConstant] = useState<Constant | null>(null);

  const handleStartTraining = (constant: Constant) => {
    setSelectedConstant(constant);
    setCurrentView('training');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedConstant(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Number Memory Trainer</h1>
          <p className="text-gray-600">Practice memorizing mathematical constants</p>
        </header>

        {currentView === 'list' && (
          <ConstantsList onStartTraining={handleStartTraining} />
        )}

        {currentView === 'training' && selectedConstant && (
          <Training 
            constant={selectedConstant} 
            onBack={handleBackToList} 
          />
        )}
      </div>
    </div>
  );
}