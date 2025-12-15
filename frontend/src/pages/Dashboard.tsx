import { useEffect, useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';
import { getAnalysis, getHistory } from '@/services/api';

const StatCard = ({ title, value, change, isPositive }: { title: string, value: string, change: string | number, isPositive: boolean }) => (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="text-muted-foreground text-sm font-medium mb-1">{title}</h3>
                <p className="text-2xl font-bold">{value}</p>
            </div>
            <div className={`p-2 rounded-lg ${isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
            </div>
        </div>
        <div className="flex items-center gap-1">
            <span className={`text-sm font-medium ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                {isPositive ? '+' : ''}{change}
            </span>
            <span className="text-muted-foreground text-sm">vs last month</span>
        </div>
    </div>
);

export const Dashboard = () => {
    const [chartData, setChartData] = useState<any[]>([]);
    const [analysis, setAnalysis] = useState<any>(null);
    const [ticker, setTicker] = useState("SUNPHARMA.NS");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const history = await getHistory(ticker);
                const report = await getAnalysis(ticker);

                // Transform history for chart
                const formattedHistory = history.map((item: any) => ({
                    name: item.Date,
                    price: item.Close
                }));

                setChartData(formattedHistory);
                setAnalysis(report);
            } catch (error) {
                console.error("Failed to fetch data", error);
            }
        };

        fetchData();
    }, [ticker]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Current Price" value={analysis ? `₹${analysis['Current Price']?.toFixed(2)}` : 'Loading...'} change="0.0%" isPositive={true} />
                <StatCard title="RSI" value={analysis ? analysis['RSI']?.toFixed(2) : '-'} change={analysis && analysis['RSI'] < 30 ? "Oversold" : "Neutral"} isPositive={true} />
                <StatCard title="Support" value={analysis ? `₹${analysis['Immediate Support (20d Low)']?.toFixed(2)}` : '-'} change="20d Low" isPositive={false} />
                <StatCard title="Resistance" value={analysis ? `₹${analysis['Immediate Resistance (20d High)']?.toFixed(2)}` : '-'} change="20d High" isPositive={true} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold">Price Performance ({ticker})</h3>
                        <input
                            type="text"
                            value={ticker}
                            onChange={(e) => setTicker(e.target.value)}
                            className="bg-muted px-3 py-1 rounded border border-border text-sm"
                        />
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => val ? val.slice(5) : ''} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', color: '#0f172a' }}
                                    itemStyle={{ color: '#0f172a' }}
                                />
                                <Area type="monotone" dataKey="price" stroke="#16a34a" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4">Analysis Signals</h3>
                    <div className="space-y-4">
                        {analysis && (
                            <>
                                <div className="p-3 rounded-lg bg-muted/50">
                                    <span className="text-sm font-medium">Trend:</span>
                                    <span className={`ml-2 font-bold ${analysis['Trend'].includes('Bullish') ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {analysis['Trend']}
                                    </span>
                                </div>
                                {analysis['Up Approach (Bullish Signs)']?.map((signal: string, i: number) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <span className="font-medium text-sm">{signal}</span>
                                    </div>
                                ))}
                                {analysis['Down Approach (Bearish Signs)']?.map((signal: string, i: number) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className="w-2 h-2 rounded-full bg-rose-500" />
                                        <span className="font-medium text-sm">{signal}</span>
                                    </div>
                                ))}
                            </>
                        )}
                        {!analysis && <p>Loading analysis...</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};
