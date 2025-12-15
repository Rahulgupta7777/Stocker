import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';

const data = [
    { name: 'Jan', price: 4000 },
    { name: 'Feb', price: 3000 },
    { name: 'Mar', price: 2000 },
    { name: 'Apr', price: 2780 },
    { name: 'May', price: 1890 },
    { name: 'Jun', price: 2390 },
    { name: 'Jul', price: 3490 },
];

const StatCard = ({ title, value, change, isPositive }: { title: string, value: string, change: string, isPositive: boolean }) => (
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
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Portfolio Value" value="$124,500.00" change="12.5%" isPositive={true} />
                <StatCard title="Today's Gain/Loss" value="$1,230.50" change="3.2%" isPositive={true} />
                <StatCard title="Total Invested" value="$98,000.00" change="-0.4%" isPositive={false} />
                <StatCard title="Active Positions" value="12" change="2" isPositive={true} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold">Portfolio Performance</h3>
                        <div className="flex gap-2">
                            {['1D', '1W', '1M', '1Y', 'ALL'].map((period) => (
                                <button key={period} className="px-3 py-1 text-xs font-medium rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                                    {period}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4">Market Overview</h3>
                    <div className="space-y-4">
                        {[
                            { name: 'S&P 500', value: '4,120.45', change: '+1.2%', up: true },
                            { name: 'NASDAQ', value: '12,340.10', change: '+0.8%', up: true },
                            { name: 'DOW JONES', value: '33,200.50', change: '-0.2%', up: false },
                            { name: 'Bitcoin', value: '$28,450.00', change: '+2.4%', up: true },
                        ].map((item, i) => (
                            <div key={i} className="flex justify-between items-center p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${item.up ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                    <span className="font-medium">{item.name}</span>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-sm">{item.value}</p>
                                    <p className={`text-xs ${item.up ? 'text-emerald-500' : 'text-rose-500'}`}>{item.change}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
