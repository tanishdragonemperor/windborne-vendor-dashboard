const express = require('express');
const cors = require('cors');
const axios = require('axios');
const NodeCache = require('node-cache');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const cache = new NodeCache({ stdTTL: 300 });

const db = new sqlite3.Database('./vendors.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS vendor_data (
    symbol TEXT PRIMARY KEY,
    data TEXT,
    timestamp INTEGER
  )`);
});

const VENDORS = {
  'TEL': 'TE Connectivity',
  'ST': 'Sensata Technologies', 
  'DD': 'DuPont de Nemours',
  'CE': 'Celanese',
  'LYB': 'LyondellBasell'
};

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

function getCachedData(key) {
  const cached = cache.get(key);
  if (cached) return cached;

  return new Promise((resolve, reject) => {
    db.get(
      'SELECT data FROM vendor_data WHERE symbol = ? AND timestamp > ?',
      [key, Date.now() - 24 * 60 * 60 * 1000],
      (err, row) => {
        if (err) reject(err);
        else if (row) {
          const data = JSON.parse(row.data);
          cache.set(key, data);
          resolve(data);
        } else {
          resolve(null);
        }
      }
    );
  });
}

function setCachedData(key, data) {
  cache.set(key, data);
  db.run(
    'INSERT OR REPLACE INTO vendor_data (symbol, data, timestamp) VALUES (?, ?, ?)',
    [key, JSON.stringify(data), Date.now()]
  );
}

app.get('/api/vendors', (req, res) => {
  res.json(VENDORS);
});

app.get('/api/vendor/:symbol/overview', async (req, res) => {
  const { symbol } = req.params;
  const cacheKey = `overview_${symbol}`;

  try {
    let data = await getCachedData(cacheKey);
    
    if (!data) {
      data = await fetchFromAlphaVantage('OVERVIEW', symbol);
      setCachedData(cacheKey, data);
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/vendor/:symbol/income', async (req, res) => {
  const { symbol } = req.params;
  const cacheKey = `income_${symbol}`;

  try {
    let data = await getCachedData(cacheKey);
    
    if (!data) {
      data = await fetchFromAlphaVantage('INCOME_STATEMENT', symbol);
      setCachedData(cacheKey, data);
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/vendor/:symbol/balance', async (req, res) => {
  const { symbol } = req.params;
  const cacheKey = `balance_${symbol}`;

  try {
    let data = await getCachedData(cacheKey);
    
    if (!data) {
      data = await fetchFromAlphaVantage('BALANCE_SHEET', symbol);
      setCachedData(cacheKey, data);
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});