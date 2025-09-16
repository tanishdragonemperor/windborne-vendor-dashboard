const axios = require('axios');

async function fetchFromAlphaVantage(func, symbol) {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) {
    throw new Error('Alpha Vantage API key not configured');
  }

  const url = `https://www.alphavantage.co/query?function=${func}&symbol=${symbol}&apikey=${apiKey}`;
  
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${func} for ${symbol}:`, error.message);
    throw error;
  }
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    const { symbol } = req.query;

    try {
      const data = await fetchFromAlphaVantage('INCOME_STATEMENT', symbol);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}