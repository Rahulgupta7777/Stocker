from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from stock_analyzer.core.fetcher import StockFetcher
from stock_analyzer.core.indicators import TechnicalIndicators
from stock_analyzer.strategies.trend_analysis import TrendAnalyzer
import pandas as pd

app = FastAPI(title="Stocker API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/analyze/{ticker}")
async def analyze_stock(ticker: str):
    try:
        # 1. Fetch Data
        fetcher = StockFetcher()
        df = fetcher.fetch_data(ticker)
        
        if df.empty:
            raise HTTPException(status_code=404, detail=f"No data found for {ticker}")

        # 2. Add Indicators
        ti = TechnicalIndicators()
        df = ti.add_indicators(df)

        # 3. Analyze
        analyzer = TrendAnalyzer()
        report = analyzer.analyze(df)
        
        # Convert NumPy types to native Python types for JSON serialization
        # (This is a simplified approach, might need more robust handling)
        json_report = {}
        for k, v in report.items():
            if isinstance(v, (pd.Series, pd.DataFrame)):
                 json_report[k] = v.to_dict() # Should not happen based on current logic but good safety
            elif hasattr(v, 'item'): 
                 json_report[k] = v.item() # Handle numpy floats/ints
            else:
                 json_report[k] = v

        return json_report

    except Exception as e:
        print(f"Error analyzing {ticker}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/history/{ticker}")
async def get_history(ticker: str, period: str = "1y"):
    try:
        fetcher = StockFetcher()
        # Fetch a bit more to ensure we have valid indicators if we wanted to calculate them on the fly
        # But here we just return price data for the chart
        df = fetcher.fetch_data(ticker, period=period)
        
        if df.empty:
             raise HTTPException(status_code=404, detail=f"No data found for {ticker}")
        
        # We might want to add indicators to the history too for the chart
        ti = TechnicalIndicators()
        df = ti.add_indicators(df)
        
        # Format for Recharts: array of objects
        # Reset index to get Date as a column
        df.reset_index(inplace=True)
        
        # Convert Date to string
        df['Date'] = df['Date'].dt.strftime('%Y-%m-%d')
        
        # Handle NaN values (which often happen with indicators at the start)
        df.fillna(0, inplace=True)

        return df.to_dict(orient="records")

    except Exception as e:
         raise HTTPException(status_code=500, detail=str(e))
