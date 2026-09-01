// server.js
// This is a small proxy server. It keeps your Twelve Data API key secret
// on the server side, and forwards requests from your webpage to Twelve Data.

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;
const API_KEY = process.env.TWELVE_DATA_KEY;

app.use(cors());
app.use(express.static('public')); // serves index.html, style.css, script.js

// Route: get a real-time quote for a symbol
// Example call from frontend: /api/quote?symbol=AAPL
app.get('/api/quote', async (req, res) => {
  const symbol = req.query.symbol;

  if (!symbol) {
    return res.status(400).json({ error: 'Missing symbol parameter' });
  }

  try {
    const url = `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    // Twelve Data returns { status: "error", message: "..." } on bad symbols
    if (data.status === 'error' || data.code) {
      return res.status(400).json({ error: data.message || 'Invalid symbol or API error' });
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong fetching data' });
  }
});

// Route: get historical daily price data for a symbol
// Example call from frontend: /api/history?symbol=AAPL
app.get('/api/history', async (req, res) => {
  const symbol = req.query.symbol;

  if (!symbol) {
    return res.status(400).json({ error: 'Missing symbol parameter' });
  }

  try {
    const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&outputsize=30&apikey=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'error' || data.code) {
      return res.status(400).json({ error: data.message || 'Invalid symbol or API error' });
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong fetching data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
