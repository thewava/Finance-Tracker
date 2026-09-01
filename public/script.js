const tickerInput = document.getElementById('tickerInput');
const searchBtn = document.getElementById('searchBtn');
const statusMessage = document.getElementById('statusMessage');
const quoteCard = document.getElementById('quoteCard');
const quoteSymbol = document.getElementById('quoteSymbol');
const quotePrice = document.getElementById('quotePrice');
const quoteChange = document.getElementById('quoteChange');
const quoteVolume = document.getElementById('quoteVolume');
const chartSection = document.getElementById('chartSection');

let priceChart = null; // will hold the Chart.js instance

searchBtn.addEventListener('click', handleSearch);
tickerInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleSearch();
});

async function handleSearch() {
  const symbol = tickerInput.value.trim().toUpperCase();

  if (!symbol) {
    showStatus('Please enter a ticker symbol.', 'error');
    return;
  }

  hideResults();
  showStatus(`Loading data for ${symbol}...`, 'loading');

  try {
    const [quoteRes, historyRes] = await Promise.all([
      fetch(`/api/quote?symbol=${symbol}`),
      fetch(`/api/history?symbol=${symbol}`)
    ]);

    const quoteData = await quoteRes.json();
    const historyData = await historyRes.json();

    if (!quoteRes.ok || quoteData.error) {
      showStatus(quoteData.error || 'Could not find that ticker.', 'error');
      return;
    }

    displayQuote(quoteData);

    if (historyRes.ok && !historyData.error && historyData.values) {
      displayChart(historyData.values, symbol);
    }

    hideStatus();
  } catch (err) {
    console.error(err);
    showStatus('Something went wrong. Is your server running?', 'error');
  }
}

function displayQuote(data) {
  quoteSymbol.textContent = `${data.name} (${data.symbol})`;
  quotePrice.textContent = `$${parseFloat(data.close).toFixed(2)}`;

  const change = parseFloat(data.change);
  const percent = parseFloat(data.percent_change);
  const isPositive = change >= 0;

  quoteChange.textContent = `${isPositive ? '+' : ''}${change.toFixed(2)} (${isPositive ? '+' : ''}${percent.toFixed(2)}%)`;
  quoteChange.style.color = isPositive ? '#4ade80' : '#f87171';

  quoteVolume.textContent = `Volume: ${Number(data.volume).toLocaleString()}`;

  quoteCard.classList.remove('hidden');
}

function displayChart(values, symbol) {
  // Twelve Data returns newest first, so reverse for chronological order
  const sorted = [...values].reverse();
  const labels = sorted.map(v => v.datetime);
  const prices = sorted.map(v => parseFloat(v.close));

  chartSection.classList.remove('hidden');

  const ctx = document.getElementById('priceChart').getContext('2d');

  if (priceChart) {
    priceChart.destroy(); // clear old chart before drawing a new one
  }

  priceChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: `${symbol} Closing Price`,
        data: prices,
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 0
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: '#f1f5f9' } }
      },
      scales: {
        x: { ticks: { color: '#94a3b8' } },
        y: { ticks: { color: '#94a3b8' } }
      }
    }
  });
}

function showStatus(message, type) {
  statusMessage.textContent = message;
  statusMessage.className = `status ${type}`;
  statusMessage.classList.remove('hidden');
}

function hideStatus() {
  statusMessage.classList.add('hidden');
}

function hideResults() {
  quoteCard.classList.add('hidden');
  chartSection.classList.add('hidden');
}
