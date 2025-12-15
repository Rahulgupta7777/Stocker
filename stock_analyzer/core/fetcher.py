import yfinance as yf
import pandas as pd

class StockFetcher:
    def __init__(self):
        pass

    def fetch_data(self, ticker: str, period: str = "1y", interval: str = "1d") -> pd.DataFrame:
        """
        Fetches historical data for a given ticker.
        """
        print(f"Fetching data for {ticker}...")
        stock = yf.Ticker(ticker)
        df = stock.history(period=period, interval=interval)
        
        if df.empty:
            print(f"No data found for {ticker}")
            return pd.DataFrame()
            
        return df
