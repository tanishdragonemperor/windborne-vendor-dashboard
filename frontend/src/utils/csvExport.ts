import { VendorData } from '../types/vendor';

export const exportToCSV = (vendors: VendorData[]) => {
  const headers = [
    'Symbol',
    'Company Name',
    'Sector',
    'Industry',
    'Market Cap',
    'Revenue (TTM)',
    'P/E Ratio',
    'Profit Margin',
    'ROE',
    'ROA',
    'EPS',
    'Book Value',
    'Dividend Yield',
    '52 Week High',
    '52 Week Low',
    'Beta'
  ];

  const csvData = vendors.map(vendor => [
    vendor.symbol,
    vendor.overview?.Name || vendor.name,
    vendor.overview?.Sector || 'N/A',
    vendor.overview?.Industry || 'N/A',
    vendor.overview?.MarketCapitalization || 'N/A',
    vendor.overview?.RevenueTTM || 'N/A',
    vendor.overview?.PERatio || 'N/A',
    vendor.overview?.ProfitMargin || 'N/A',
    vendor.overview?.ReturnOnEquityTTM || 'N/A',
    vendor.overview?.ReturnOnAssetsTTM || 'N/A',
    vendor.overview?.EPS || 'N/A',
    vendor.overview?.BookValue || 'N/A',
    vendor.overview?.DividendYield || 'N/A',
    vendor.overview?.['52WeekHigh'] || 'N/A',
    vendor.overview?.['52WeekLow'] || 'N/A',
    vendor.overview?.Beta || 'N/A'
  ]);

  const csvContent = [
    headers.join(','),
    ...csvData.map(row => 
      row.map(cell => 
        typeof cell === 'string' && cell.includes(',') 
          ? `"${cell}"` 
          : cell
      ).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `vendor-comparison-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};