import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import SimulatorPage from './pages/SimulatorPage';
import QuotesPage from './pages/QuotesPage';

const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [simulatorProductId, setSimulatorProductId] = useState(null);

  const handleNavigate = (page, productId = null) => {
    setCurrentPage(page);
    if (productId) {
      setSimulatorProductId(productId);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} />;
      case 'products':
        return <ProductsPage onNavigate={handleNavigate} />;
      case 'simulator':
        return <SimulatorPage initialProductId={simulatorProductId} />;
      case 'quotes':
        return <QuotesPage onNavigate={handleNavigate} />;
      default:
        return <DashboardPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="flex-1 overflow-hidden">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;
