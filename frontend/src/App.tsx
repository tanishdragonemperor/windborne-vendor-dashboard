import React, { useState, useEffect } from 'react';
import { VendorData } from './types/vendor';
import { vendorApi } from './api/vendorApi';
import VendorTable from './components/VendorTable';
import VendorCharts from './components/VendorCharts';
import { exportToCSV } from './utils/csvExport';
import './App.css';

const VENDORS: Record<string, string> = {
  'TEL': 'TE Connectivity',
  'ST': 'Sensata Technologies',
  'DD': 'DuPont de Nemours',
  'CE': 'Celanese',
  'LYB': 'LyondellBasell'
};

function App() {
  const [vendors, setVendors] = useState<VendorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'table' | 'charts'>('table');

  useEffect(() => {
    const initializeVendors = () => {
      const initialVendors = Object.entries(VENDORS).map(([symbol, name]) => ({
        symbol,
        name,
        overview: null,
        income: null,
        loading: true,
        error: null
      }));
      setVendors(initialVendors);
    };

    const fetchVendorData = async () => {
      initializeVendors();
      setLoading(true);
      setError(null);

      try {
        const vendorPromises = Object.keys(VENDORS).map(async (symbol) => {
          try {
            const [overview, income] = await Promise.all([
              vendorApi.getVendorOverview(symbol),
              vendorApi.getVendorIncome(symbol)
            ]);

            return {
              symbol,
              name: VENDORS[symbol],
              overview,
              income,
              loading: false,
              error: null
            };
          } catch (error) {
            console.error(`Error fetching data for ${symbol}:`, error);
            return {
              symbol,
              name: VENDORS[symbol],
              overview: null,
              income: null,
              loading: false,
              error: error instanceof Error ? error.message : 'Unknown error'
            };
          }
        });

        const vendorResults = await Promise.all(vendorPromises);
        setVendors(vendorResults);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch vendor data');
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, []);

  const handleExportCSV = () => {
    exportToCSV(vendors);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  if (loading && vendors.every(v => v.loading)) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading vendor data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>WindBorne Vendor Dashboard</h1>
          <p>Fundamental analysis of potential sensor and materials suppliers</p>
          <button onClick={handleRefresh} className="refresh-btn">
            Refresh Data
          </button>
        </div>
      </header>

      <nav className="tab-nav">
        <button
          className={`tab-btn ${selectedTab === 'table' ? 'active' : ''}`}
          onClick={() => setSelectedTab('table')}
        >
          Comparison Table
        </button>
        <button
          className={`tab-btn ${selectedTab === 'charts' ? 'active' : ''}`}
          onClick={() => setSelectedTab('charts')}
        >
          Charts & Analytics
        </button>
      </nav>

      <main className="main-content">
        {error && (
          <div className="error-banner">
            <p>⚠️ {error}</p>
          </div>
        )}

        {selectedTab === 'table' && (
          <VendorTable vendors={vendors} onExportCSV={handleExportCSV} />
        )}

        {selectedTab === 'charts' && (
          <VendorCharts vendors={vendors} />
        )}
      </main>

      <footer className="app-footer">
        <p>Data provided by Alpha Vantage API | Last updated: {new Date().toLocaleString()}</p>
        <div className="vendor-categories">
          <span className="category">📡 Sensors: TEL, ST</span>
          <span className="category">🧪 Materials: DD, CE, LYB</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
