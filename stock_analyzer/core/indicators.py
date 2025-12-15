import pandas as pd
import pandas_ta as ta

class TechnicalIndicators:
    def __init__(self):
        pass

    def add_indicators(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Adds technical indicators to the dataframe.
        """
        if df.empty:
            return df

        # Simple Moving Averages
        df['SMA_50'] = ta.sma(df['Close'], length=50)
        df['SMA_200'] = ta.sma(df['Close'], length=200)

        # Exponential Moving Average
        df['EMA_20'] = ta.ema(df['Close'], length=20)

        # RSI
        df['RSI'] = ta.rsi(df['Close'], length=14)

        # MACD
        macd = ta.macd(df['Close'])
        df = pd.concat([df, macd], axis=1)

        return df
