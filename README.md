# WindBorne Vendor Dashboard

A comprehensive vendor analysis dashboard for WindBorne Systems to evaluate potential sensor and materials suppliers using Alpha Vantage financial data.

## Features

- **Multi-Vendor Analysis**: Compare 5 key vendors (TEL, ST, DD, CE, LYB)
- **Fundamental Data Integration**: Uses Alpha Vantage's Company Overview and Income Statement APIs
- **Interactive Visualizations**: Revenue charts, profitability metrics, sector distribution
- **Vendor Flagging System**: Automated risk assessment based on financial thresholds
- **CSV Export**: Export comparison data for offline analysis
- **Caching Layer**: SQLite + in-memory caching for improved performance
- **Responsive Design**: Works on desktop and mobile devices

## Vendor Categories

### Sensors
- **TEL** - TE Connectivity: Connectivity and sensor solutions
- **ST** - Sensata Technologies: Sensing, electrical protection, control solutions

### Materials/Plastics
- **DD** - DuPont de Nemours: Specialty materials and chemicals
- **CE** - Celanese: Engineered materials and chemical solutions
- **LYB** - LyondellBasell: Advanced polymers and chemicals

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Recharts for data visualization
- CSS Grid and Flexbox for responsive layout

### Backend
- Node.js with Express
- SQLite for data persistence
- Node-Cache for in-memory caching
- Alpha Vantage API integration

## Prerequisites

- Node.js 18+ 
- Alpha Vantage API key (free tier available)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 2. Configure Alpha Vantage API

1. Get a free API key from [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
2. Create `.env` file in the backend directory:

```bash
cd backend
cp .env.example .env
```

3. Edit `.env` and add your API key:
```
ALPHA_VANTAGE_API_KEY=G238AX3460UXHVRZ
```

### 3. Start the Application

```bash
# Terminal 1 - Start Backend (runs on http://localhost:3001)
cd backend
npm start

# Terminal 2 - Start Frontend (runs on http://localhost:5173)
cd frontend
npm run dev
```

### 4. Access the Dashboard

Open your browser to `http://localhost:5173`

## API Endpoints

The backend provides the following endpoints:

- `GET /api/vendors` - List all tracked vendors
- `GET /api/vendor/:symbol/overview` - Company overview data
- `GET /api/vendor/:symbol/income` - Income statement data
- `GET /api/vendor/:symbol/balance` - Balance sheet data

## Features Breakdown

### Vendor Flagging System

The dashboard automatically flags vendors based on:
- **Low Revenue**: Companies with < $1B annual revenue
- **Small Market Cap**: Companies with < $5B market capitalization  
- **High P/E Ratio**: Companies with P/E > 30
- **Strong Fundamentals**: Companies with > $10B revenue and P/E < 20

### Data Visualization

- **Revenue vs Market Cap**: Bar chart comparing financial scale
- **Profitability Metrics**: Profit margins and ROE comparison
- **Sector Distribution**: Pie chart of vendor industries
- **Revenue History**: Multi-year revenue trends

### Caching Strategy

- **In-Memory**: 5-minute cache for frequently accessed data
- **Persistent**: SQLite database with 24-hour TTL
- **API Rate Limiting**: Respects Alpha Vantage's 5 requests/minute limit

## Development

### Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── types/         # TypeScript interfaces
│   │   ├── api/           # API client functions
│   │   └── utils/         # Helper functions
├── backend/
│   ├── server.js          # Express server
│   ├── vendors.db         # SQLite cache database
│   └── .env              # Environment variables
└── README.md
```

### Alpha Vantage API Usage

This project uses two key Alpha Vantage endpoints:

1. **OVERVIEW**: Company fundamental data, ratios, and metrics
2. **INCOME_STATEMENT**: Annual and quarterly revenue/profit data

Data is cached locally to minimize API calls and improve performance.

## Limitations

- Alpha Vantage free tier: 5 API requests per minute, 500 per day
- Some financial data may have reporting delays
- Market data is delayed by 15+ minutes

## Future Enhancements

- Real-time stock price integration
- Historical trend analysis (3-5 years)
- Risk scoring algorithms
- Email alerts for vendor downgrades
- Integration with supplier management systems

## License

This project is for evaluation purposes as part of the WindBorne Systems interview process.