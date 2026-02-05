import React, { useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, 
  AreaChart, Area, ComposedChart, Cell 
} from 'recharts';
import { 
  LayoutDashboard, Globe, TrendingDown, TrendingUp, Anchor, 
  FileText, Euro, Truck, ShoppingCart, CloudRain, PoundSterling, Factory
} from 'lucide-react';
// import './App.css'; // Make sure you have a blank App.css file

/**
 * Data Constants derived from WPM Report & UK Review (Jan 29, 2026)
 */

// UK Market Prices (Jan 29, 2026)
const ukPriceData = [
  { category: 'Best Agria (Frying)', price: 200, type: 'High', note: 'Holding value' },
  { category: 'Best Markies (Frying)', price: 190, type: 'High', note: 'Reasonable demand' },
  { category: 'Washed Whites (Pack)', price: 300, type: 'Avg', note: 'Very poor movement' },
  { category: 'Peeling (Bintje)', price: 45, type: 'Low', note: 'Tortuous market' },
  { category: 'Nominal Ex-Factory', price: 12, type: 'Low', note: 'Excess stock unwanted' },
];

// EEX Futures Data
const futuresData = [
  { contract: 'Apr 2026 (Current)', price: 49.00, note: 'Market Glut' },
  { contract: 'Apr 2027 (Next Season)', price: 213.00, note: 'Correction Expected' },
];

// Japan Fry Import Market
const japanFryCompetition = [
  { origin: 'USA', price: 273250, volume: 257508, growth: 4.7, fill: '#3b82f6' },
  { origin: 'Belgium', price: 252027, volume: 34708, growth: -17.4, fill: '#ef4444' },
  { origin: 'China', price: 196770, volume: 50455, growth: 66.9, fill: '#f59e0b' }, 
  { origin: 'India', price: 198221, volume: 13681, growth: 74.9, fill: '#8b5cf6' }
];

// Belgium Price Gap Analysis
const belgiumPriceGap = [
  { month: 'Oct 25', freebuy: 15, contract: 200 },
  { month: 'Dec 25', freebuy: 15, contract: 210 },
  { month: 'Feb 26', freebuy: 15, contract: 238 }, 
];

// Contract Trends 2026
const contractTrends = [
  { type: 'Fontane (Start)', price25: 17.50, price26: 12.50, change: -28 },
  { type: 'Fontane (End)', price25: 30.00, price26: 23.50, change: -22 },
  { type: 'Innovator (End)', price25: 32.00, price26: 28.60, change: -10 },
];

const Card = ({ title, children, className = '' }) => (
  <div className={`bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-lg ${className}`}>
    <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-4">{title}</h3>
    {children}
  </div>
);

const KPICard = ({ title, value, subtext, trend, icon: Icon, alert = false }) => (
  <div className={`bg-slate-800 rounded-xl border ${alert ? 'border-red-500/50 bg-red-900/10' : 'border-slate-700'} p-5 flex items-start justify-between shadow-lg`}>
    <div>
      <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{title}</p>
      <h4 className="text-2xl font-bold text-white mt-1">{value}</h4>
      <p className={`text-sm mt-1 flex items-center gap-1 ${trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400'}`}>
        {trend === 'up' ? <TrendingUp size={14} /> : trend === 'down' ? <TrendingDown size={14} /> : null}
        {subtext}
      </p>
    </div>
    <div className={`p-3 rounded-lg ${alert ? 'text-red-400 bg-red-900/20' : 'text-blue-400 bg-slate-700/50'}`}>
      <Icon size={24} />
    </div>
  </div>
);

const TabButton = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
      ${active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
        : 'text-gray-400 hover:bg-slate-700 hover:text-white'
      }`}
  >
    <Icon size={16} />
    {label}
  </button>
);

export default function PotatoDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Alert Banner */}
      <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 flex flex-col md:flex-row items-start gap-4">
        <div className="flex items-center gap-3 min-w-[200px]">
          <CloudRain className="text-red-400" size={28} />
          <h4 className="text-red-400 font-bold text-sm">Planting Emergency</h4>
        </div>
        <div className="text-xs text-gray-300 space-y-2 border-l border-red-500/30 pl-4">
          <p><strong className="text-white">UK (Cornwall & Jersey):</strong> 70mm rain in Jan. Planting severely delayed. Sizeable reduction in early crisping/French fry area expected.</p>
          <p><strong className="text-white">Spain (Andalucia) & Portugal:</strong> "State of Calamity" declared. Fields flooded. Only 15-20% planted. Root asphyxiation risk.</p>
        </div>
      </div>
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="UK Best Agria" value="£200 /t" subtext="Premium Holding" trend="up" icon={PoundSterling} />
        <KPICard title="UK Nominal Factory" value="£8-12 /t" subtext="Market 'Tortuous'" trend="down" icon={Factory} alert={true} />
        <KPICard title="EEX April '26" value="€49.00" subtext="Unchanged Low" trend="flat" icon={Euro} />
        <KPICard title="German Production" value="13.87M t" subtext="Highest in 25 yrs" trend="up" icon={Anchor} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Market Sentiment: The Great Reset" className="lg:col-span-2">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={futuresData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" stroke="#9ca3af" unit="€" />
                <YAxis dataKey="contract" type="category" stroke="#f3f4f6" width={100} />
                <RechartsTooltip cursor={{fill: '#334155', opacity: 0.2}} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                <Bar dataKey="price" name="Settlement Price (€)" radius={[0, 4, 4, 0]} barSize={40}>
                  {futuresData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#ef4444' : '#22c55e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-400 mt-4 text-center">
            Current glut (Apr '26) vs. Expected correction (Apr '27). The market prices in a 10-15% area reduction next season.
          </p>
        </Card>
        <Card title="UK & EU Market Monitor (Jan 29)">
          <div className="space-y-4">
            {ukPriceData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-700/50">
                <div>
                  <div className="text-sm font-medium text-gray-200">{item.category}</div>
                  <div className="text-xs text-gray-400">{item.note}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-white">£{item.price}</div>
                  <div className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${item.type === 'High' ? 'bg-green-900 text-green-300' : item.type === 'Low' ? 'bg-red-900 text-red-300' : 'bg-slate-600 text-slate-300'}`}>
                    {item.type} Value
                  </div>
                </div>
              </div>
            ))}
            <div className="mt-4 p-2 bg-red-900/20 border border-red-500/30 rounded text-center">
              <span className="text-red-400 text-xs font-bold block mb-1">Industry Alert</span>
              <span className="text-gray-300 text-xs">Another French fry factory has "temporarily" closed a production line this week.</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderMarketDetails = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Battle for Japan: Import Price vs Growth (2025)">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={japanFryCompetition} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" stroke="#9ca3af" />
                <YAxis dataKey="origin" type="category" stroke="#f3f4f6" width={80} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                <Legend />
                <Bar dataKey="price" name="Price (¥/tonne)" barSize={20}>
                   {japanFryCompetition.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
                <Line dataKey="growth" name="YoY Growth %" stroke="#ffffff" strokeWidth={2} type="monotone" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="2026 Contract Outlook (Belgium)">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-400">
              <thead className="text-xs text-gray-200 uppercase bg-slate-700/50">
                <tr>
                  <th className="px-4 py-3">Variety / Period</th>
                  <th className="px-4 py-3">2025 Price</th>
                  <th className="px-4 py-3">2026 Price</th>
                  <th className="px-4 py-3">Change</th>
                </tr>
              </thead>
              <tbody>
                {contractTrends.map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-700 hover:bg-slate-700/20">
                    <td className="px-4 py-3 font-medium text-white">{row.type}</td>
                    <td className="px-4 py-3">€{row.price25}</td>
                    <td className="px-4 py-3 text-yellow-400 font-bold">€{row.price26}</td>
                    <td className="px-4 py-3 text-red-400">{row.change}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <Globe className="text-blue-500" size={32} />
              Global Potato Market
            </h1>
            <p className="text-gray-400 mt-1">Intelligence Dashboard • Week 6, 2026 • <span className="text-blue-400">Data: UK & European Review</span></p>
          </div>
          <div className="flex gap-2 bg-slate-800 p-1 rounded-lg border border-slate-700">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={LayoutDashboard} label="Overview" />
            <TabButton active={activeTab === 'details'} onClick={() => setActiveTab('details')} icon={TrendingUp} label="Analysis" />
            {/* The "My Tracker" tab has been removed as it requires a database connection */}
          </div>
        </div>

        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'details' && renderMarketDetails()}

        <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-4 flex items-start gap-3">
          <div className="p-2 bg-blue-900/50 rounded-full text-blue-400 shrink-0">
            <FileText size={20} />
          </div>
          <div>
            <h4 className="text-blue-400 font-bold text-sm">Strategic Summary: Feb 2026</h4>
            <p className="text-sm text-gray-300 mt-1 leading-relaxed">
              Europe faces a "tortuous" physical market. While premium UK frying varieties hold value (£180-200/t), general stocks are unwanted with factory nominals at just £8-12/t. 
              <strong>Planting delays</strong> in Cornwall, Jersey, and South Spain (flooding) are creating future supply risks for early varieties. 
              Meanwhile, French processing capacity tightens with another line closure reported.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}