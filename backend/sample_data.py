"""
Curated high-fidelity sample templates and demo presets for SnapToStack.
Ensures zero-downtime demonstrations during live hackathon judging.
"""

SAMPLE_DASHBOARD_CODE = """import React, { useState } from 'react';

export default function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Total Revenue', value: '$45,231.89', change: '+20.1%', isPositive: true },
    { label: 'Active Subscriptions', value: '+2,350', change: '+180.1%', isPositive: true },
    { label: 'Sales Velocity', value: '+12,234', change: '+19%', isPositive: true },
    { label: 'Bounce Rate', value: '2.4%', change: '-4.3%', isPositive: false },
  ];

  const recentTransactions = [
    { id: 1, name: 'Olivia Martin', email: 'olivia.martin@email.com', amount: '+$1,999.00', status: 'Completed' },
    { id: 2, name: 'Jackson Lee', email: 'jackson.lee@email.com', amount: '+$39.00', status: 'Pending' },
    { id: 3, name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', amount: '+$299.00', status: 'Completed' },
    { id: 4, name: 'William Kim', email: 'will@email.com', amount: '+$99.00', status: 'Completed' },
    { id: 5, name: 'Sofia Davis', email: 'sofia.davis@email.com', amount: '+$39.00', status: 'Failed' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-8 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">Gemma 4 Compiled</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mt-1">SaaS Executive Dashboard</h1>
          <p className="text-slate-400 text-sm">Real-time performance metrics synthesized from uploaded mockup.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition border border-slate-700 shadow-sm">
            Export Report
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-medium rounded-lg shadow-lg shadow-blue-500/25 transition">
            + New Metric
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-slate-900/80 backdrop-blur border border-slate-800/80 rounded-xl p-5 hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400 text-sm font-medium">
              <span>{stat.label}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${stat.isPositive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-white mt-3 tracking-tight">{stat.value}</div>
            <p className="text-xs text-slate-500 mt-1">vs. previous 30 days</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Chart Card */}
        <div className="lg:col-span-2 bg-slate-900/80 backdrop-blur border border-slate-800/80 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white">Revenue Trajectory</h2>
              <p className="text-xs text-slate-400">Monthly recurring breakdown</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg text-xs">
              <button onClick={() => setActiveTab('overview')} className={`px-3 py-1 rounded-md transition ${activeTab === 'overview' ? 'bg-blue-600 text-white font-medium shadow' : 'text-slate-400 hover:text-white'}`}>Overview</button>
              <button onClick={() => setActiveTab('analytics')} className={`px-3 py-1 rounded-md transition ${activeTab === 'analytics' ? 'bg-blue-600 text-white font-medium shadow' : 'text-slate-400 hover:text-white'}`}>Analytics</button>
            </div>
          </div>
          {/* Simulated Visual Chart */}
          <div className="h-64 flex items-end gap-3 pt-4 px-2">
            {[45, 62, 55, 78, 90, 84, 110, 95, 120, 140, 135, 160].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div 
                  style={{ height: `${(h / 160) * 100}%` }} 
                  className="w-full bg-gradient-to-t from-blue-600/80 to-indigo-400 rounded-t-md group-hover:brightness-125 transition-all shadow-lg shadow-blue-500/10"
                />
                <span className="text-[10px] text-slate-500">{['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-slate-900/80 backdrop-blur border border-slate-800/80 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Sales</h2>
            <span className="text-xs text-blue-400 hover:underline cursor-pointer">View all</span>
          </div>
          <div className="divide-y divide-slate-800/60">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-200">{tx.name}</p>
                  <p className="text-xs text-slate-500">{tx.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">{tx.amount}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${tx.status === 'Completed' ? 'text-emerald-400 bg-emerald-500/10' : tx.status === 'Pending' ? 'text-amber-400 bg-amber-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
"""

SAMPLE_LANDING_CODE = """import React from 'react';

export default function HeroLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white font-sans selection:bg-purple-500 selection:text-white">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center font-bold text-xl shadow-lg shadow-purple-500/30">
            S
          </div>
          <span className="text-xl font-bold tracking-tight">SnapToStack</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#" className="hover:text-white transition">Features</a>
          <a href="#" className="hover:text-white transition">Showcase</a>
          <a href="#" className="hover:text-white transition">Documentation</a>
          <a href="#" className="hover:text-white transition">Pricing</a>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-sm text-slate-300 hover:text-white px-3 py-2 transition">Sign In</button>
          <button className="text-sm bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 px-4 py-2 rounded-lg font-medium shadow-md shadow-purple-500/25 transition">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-6">
          <span className="h-2 w-2 rounded-full bg-purple-400 animate-ping"></span>
          Powered by Google DeepMind Gemma 4
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
          Snap a mockup. <br/>
          <span className="bg-gradient-to-r from-purple-400 via-pink-300 to-blue-400 bg-clip-text text-transparent">
            Ship the full stack.
          </span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          The open-weight multimodal visual compiler that transforms screenshots, Figma mockups, and whiteboard wireframes into production React components in seconds.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:brightness-110 font-semibold rounded-xl shadow-xl shadow-purple-600/30 transition transform hover:-translate-y-0.5">
            Start Converting Free →
          </button>
          <button className="w-full sm:w-auto px-8 py-4 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 transition">
            Explore Open Source Repo
          </button>
        </div>
      </div>
    </div>
  );
}
"""
