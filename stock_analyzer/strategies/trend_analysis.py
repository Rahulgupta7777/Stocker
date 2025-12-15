import pandas as pd

class TrendAnalyzer:
    def __init__(self):
        pass

    def analyze(self, df: pd.DataFrame):
        """
        Analyzes the dataframe for 'Up' (Bullish) and 'Down' (Bearish) approaches.
        """
        if df.empty:
            return "No data to analyze"

        current_price = df['Close'].iloc[-1]
        rsi = df['RSI'].iloc[-1]
        sma_50 = df['SMA_50'].iloc[-1]
        sma_200 = df['SMA_200'].iloc[-1]
        
        # Calculate recent support and resistance (last 20 days)
        last_20 = df.tail(20)
        resistance = last_20['High'].max()
        support = last_20['Low'].min()

        analysis_report = {
            "Current Price": current_price,
            "RSI": rsi,
            "SMA_50": sma_50,
            "SMA_200": sma_200,
            "Immediate Support (20d Low)": support,
            "Immediate Resistance (20d High)": resistance,
            "Trend": "Neutral",
            "Up Approach (Bullish Signs)": [],
            "Down Approach (Bearish Signs)": []
        }

        # Trend Determination
        if sma_50 > sma_200:
            analysis_report["Trend"] = "Long-term Bullish"
        elif sma_50 < sma_200:
             analysis_report["Trend"] = "Long-term Bearish"

        # Up Approach Analysis
        if current_price > sma_50:
            analysis_report["Up Approach (Bullish Signs)"].append("Price above 50 SMA")
        if rsi < 30:
            analysis_report["Up Approach (Bullish Signs)"].append("RSI Oversold (Potential Bounce)")
        if rsi > 50 and rsi < 70:
             analysis_report["Up Approach (Bullish Signs)"].append("RSI in Bullish Zone")
        if current_price > resistance * 0.98: # Near breakout
             analysis_report["Up Approach (Bullish Signs)"].append(f"Near Resistance {resistance:.2f}")

        # Down Approach Analysis
        if current_price < sma_50:
            analysis_report["Down Approach (Bearish Signs)"].append("Price below 50 SMA")
        if rsi > 70:
            analysis_report["Down Approach (Bearish Signs)"].append("RSI Overbought (Potential Pullback)")
        if rsi < 50:
             analysis_report["Down Approach (Bearish Signs)"].append("RSI in Bearish Zone")
        if current_price < support * 1.02: # Near breakdown
             analysis_report["Down Approach (Bearish Signs)"].append(f"Near Support {support:.2f}")

        return analysis_report
