/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ActiveView, VectorSubTab, OhmSubTab } from './types';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { HomeView } from './components/home/HomeView';
import { VectorSimulator } from './components/vectors/VectorSimulator';
import { CircuitSimulator } from './components/circuits/CircuitSimulator';
import { DesignersView } from './components/designers/DesignersView';
import { HelpModal } from './components/modals/HelpModal';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [vectorSubTab, setVectorSubTab] = useState<VectorSubTab>('cartesian');
  const [ohmSubTab, setOhmSubTab] = useState<OhmSubTab>('builder');

  // Modales
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  const handleNavigate = (view: ActiveView) => {
    setActiveView(view);
    const mainContainer = document.getElementById('main-content-scroll');
    if (mainContainer) {
      mainContainer.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="h-screen bg-[#f8fafc] text-slate-800 flex flex-col md:flex-row antialiased font-sans overflow-hidden">
      {/* Barra Lateral Navegación Estática */}
      <Sidebar
        activeView={activeView}
        setActiveView={handleNavigate}
        vectorSubTab={vectorSubTab}
        setVectorSubTab={setVectorSubTab}
        ohmSubTab={ohmSubTab}
        setOhmSubTab={setOhmSubTab}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Área de Contenido Principal con desplazamiento independiente */}
      <div 
        id="main-content-scroll" 
        className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto"
      >
        {/* Cabecera Superior */}
        <Header
          activeView={activeView}
          onOpenHelp={() => setIsHelpOpen(true)}
        />

        {/* Vista Actual */}
        <main className="flex-1 p-2 sm:p-6 pb-16">
          {activeView === 'home' && (
            <HomeView onNavigate={handleNavigate} />
          )}

          {activeView === 'vectors' && (
            <VectorSimulator
              subTab={vectorSubTab}
              setSubTab={setVectorSubTab}
            />
          )}

          {activeView === 'ohm' && (
            <CircuitSimulator
              subTab={ohmSubTab}
              setSubTab={setOhmSubTab}
            />
          )}

          {activeView === 'designers' && (
            <DesignersView />
          )}
        </main>
      </div>

      {/* Modales Interactivos */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
