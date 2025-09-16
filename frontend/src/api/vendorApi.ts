const API_BASE_URL = '/api';

export const vendorApi = {
  getVendors: async () => {
    const response = await fetch(`${API_BASE_URL}/vendors`);
    if (!response.ok) throw new Error('Failed to fetch vendors');
    return response.json();
  },

  getVendorOverview: async (symbol: string) => {
    const response = await fetch(`${API_BASE_URL}/vendor/${symbol}/overview`);
    if (!response.ok) throw new Error(`Failed to fetch overview for ${symbol}`);
    return response.json();
  },

  getVendorIncome: async (symbol: string) => {
    const response = await fetch(`${API_BASE_URL}/vendor/${symbol}/income`);
    if (!response.ok) throw new Error(`Failed to fetch income for ${symbol}`);
    return response.json();
  },

  getVendorBalance: async (symbol: string) => {
    const response = await fetch(`${API_BASE_URL}/vendor/${symbol}/balance`);
    if (!response.ok) throw new Error(`Failed to fetch balance for ${symbol}`);
    return response.json();
  }
};