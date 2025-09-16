import React from 'react';
import { VendorData, VendorFlag } from '../types/vendor';

interface VendorTableProps {
  vendors: VendorData[];
  onExportCSV: () => void;
}

const VendorTable: React.FC<VendorTableProps> = ({ vendors, onExportCSV }) => {
  const formatCurrency = (value: string | undefined) => {
    if (!value || value === 'None' || value === '-') return 'N/A';
    const num = parseFloat(value);
    if (isNaN(num)) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(num);
  };

  const formatNumber = (value: string | undefined) => {
    if (!value || value === 'None' || value === '-') return 'N/A';
    const num = parseFloat(value);
    if (isNaN(num)) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(num);
  };

  const getVendorFlags = (vendor: VendorData): VendorFlag[] => {
    const flags: VendorFlag[] = [];
    
    if (vendor.overview) {
      const revenue = parseFloat(vendor.overview.RevenueTTM || '0');
      const marketCap = parseFloat(vendor.overview.MarketCapitalization || '0');
      const peRatio = parseFloat(vendor.overview.PERatio || '0');
      
      if (revenue < 1000000000) {
        flags.push({
          type: 'warning',
          message: 'Low Revenue (<$1B)'
        });
      }
      
      if (marketCap < 5000000000) {
        flags.push({
          type: 'warning',
          message: 'Small Market Cap (<$5B)'
        });
      }
      
      if (peRatio > 30) {
        flags.push({
          type: 'danger',
          message: 'High P/E Ratio (>30)'
        });
      }
      
      if (revenue > 10000000000 && peRatio < 20) {
        flags.push({
          type: 'success',
          message: 'Strong Fundamentals'
        });
      }
    }
    
    return flags;
  };

  return (
    <div className="vendor-table-container">
      <div className="table-header">
        <h2>Vendor Comparison</h2>
        <button onClick={onExportCSV} className="export-btn">
          Export CSV
        </button>
      </div>
      
      <div className="table-wrapper">
        <table className="vendor-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Symbol</th>
              <th>Sector</th>
              <th>Market Cap</th>
              <th>Revenue (TTM)</th>
              <th>P/E Ratio</th>
              <th>Profit Margin</th>
              <th>ROE</th>
              <th>Flags</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => {
              const flags = getVendorFlags(vendor);
              return (
                <tr key={vendor.symbol} className={vendor.loading ? 'loading' : ''}>
                  <td>{vendor.overview?.Name || vendor.name}</td>
                  <td className="symbol">{vendor.symbol}</td>
                  <td>{vendor.overview?.Sector || 'N/A'}</td>
                  <td>{formatCurrency(vendor.overview?.MarketCapitalization)}</td>
                  <td>{formatCurrency(vendor.overview?.RevenueTTM)}</td>
                  <td>{vendor.overview?.PERatio || 'N/A'}</td>
                  <td>{vendor.overview?.ProfitMargin || 'N/A'}</td>
                  <td>{vendor.overview?.ReturnOnEquityTTM || 'N/A'}</td>
                  <td className="flags">
                    {flags.map((flag, index) => (
                      <span
                        key={index}
                        className={`flag flag-${flag.type}`}
                        title={flag.message}
                      >
                        {flag.type === 'warning' && '⚠️'}
                        {flag.type === 'danger' && '🔴'}
                        {flag.type === 'success' && '✅'}
                      </span>
                    ))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorTable;