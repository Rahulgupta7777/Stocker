from stock_analyzer.core.fetcher import StockFetcher
from stock_analyzer.core.indicators import TechnicalIndicators
from stock_analyzer.strategies.trend_analysis import TrendAnalyzer
import argparse

def main():
    parser = argparse.ArgumentParser(description="Stock Analysis Tool")
    parser.add_argument("--ticker", type=str, default="SUNPHARMA.NS", help="Stock ticker symbol (default: SUNPHARMA.NS)")
    args = parser.parse_args()

    # 1. Fetch Data
    fetcher = StockFetcher()
    df = fetcher.fetch_data(args.ticker)
    
    if df.empty:
        print("Exiting...")
        return

    # 2. Add Indicators
    ti = TechnicalIndicators()
    df = ti.add_indicators(df)

    # 3. Analyze
    analyzer = TrendAnalyzer()
    report = analyzer.analyze(df)

    # 4. Print Report
    print("\n" + "="*40)
    print(f" Analysis Report for {args.ticker}")
    print("="*40)
    print(f"Current Price: {report['Current Price']:.2f}")
    print(f"Trend: {report['Trend']}")
    print(f"RSI: {report['RSI']:.2f}")
    print(f"Immediate Support: {report['Immediate Support (20d Low)']:.2f}")
    print(f"Immediate Resistance: {report['Immediate Resistance (20d High)']:.2f}")
    print("-" * 40)
    
    print("\n[UP APPROACH - BULLISH SIGNALS]")
    if report['Up Approach (Bullish Signs)']:
        for signal in report['Up Approach (Bullish Signs)']:
            print(f"  [+] {signal}")
    else:
        print("  No intermediate bullish signals.")

    print("\n[DOWN APPROACH - BEARISH SIGNALS]")
    if report['Down Approach (Bearish Signs)']:
        for signal in report['Down Approach (Bearish Signs)']:
            print(f"  [-] {signal}")
    else:
        print("  No intermediate bearish signals.")
    print("="*40 + "\n")

if __name__ == "__main__":
    main()
