# Finance Tracker

A simple web app for tracking stock prices in real time. Enter a stock symbol and get its current quote plus a 30-day price history, powered by the Twelve Data API.

## Features

- Real-time stock quotes by symbol (e.g. AAPL, TSLA)
- 30-day historical daily price data
- Backend proxy server that keeps the API key secret and handles errors for invalid symbols

## Tech Stack

- **Backend:** Node.js, Express
- **Frontend:** HTML, CSS, vanilla JavaScript
- **API:** [Twelve Data](https://twelvedata.com/)
- **Other:** dotenv (environment variables), cors (cross-origin requests)

## How It Works

The app uses a small Express server as a proxy between the frontend and the Twelve Data API. This keeps the API key hidden from the browser instead of exposing it in frontend JavaScript.

- `GET /api/quote?symbol=AAPL` — returns a real-time quote for the given symbol
- `GET /api/history?symbol=AAPL` — returns the last 30 days of daily price data for the given symbol

If a symbol is missing or invalid, the server returns a clear JSON error message instead of crashing.

## Setup

1. Clone this repository:
   ```
   git clone https://github.com/thewava/finance-tracker.git
   cd finance-tracker
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Get a free API key from [Twelve Data](https://twelvedata.com/).

4. Create a `.env` file in the project root with your key:
   ```
   TWELVE_DATA_KEY=your_api_key_here
   ```

5. Start the server:
   ```
   node server.js
   ```

6. Open your browser to:
   ```
   http://localhost:3000
   ```

## Notes

- The `.env` file is excluded from version control via `.gitignore` and must be created locally to run the app.
- Twelve Data's free tier has API rate limits; if requests fail unexpectedly, check your usage limits.

## Future Improvements

- Add support for comparing multiple symbols at once
- Add a price chart visualization for historical data
- Add caching to reduce redundant API calls
