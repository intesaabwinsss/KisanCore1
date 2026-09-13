import sys

with open('src/components/AdminPortal.tsx', 'r') as f:
    content = f.read()

# Make sure to import Recharts stuff
imports = """import { 
  ResponsiveContainer, 
  ComposedChart, 
  Area, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ReferenceLine
} from 'recharts';"""

if "from 'recharts'" not in content:
    idx = content.find("import {")
    content = content[:idx] + imports + "\n" + content[idx:]

# Define initial state
old_initial = """  const [forecastData, setForecastData] = useState<DemandForecast>({
    crop: 'Tomato',
    region: 'Nashik / Maharashtra Corridor',
    currentMandiPrice: 28,
    recommendedPlatformPrice: 35,
    projectedPrice7Days: 38,
    demandTrend: 'Surging',
    weatherImpactFactor: 'Favorable harvest conditions',
    forecastAccuracyPct: 94.6,
    keyAdvice: 'Urban retail pack demand is peaking ahead of festival season. Stagger harvest batches across 5 days for optimal realization.',
  });"""

new_initial = """  const [forecastData, setForecastData] = useState<DemandForecast>({
    crop: 'Tomato',
    region: 'Nashik / Western India',
    currentMandiPrice: 28,
    recommendedPlatformPrice: 35,
    projectedPriceTomorrow: 30,
    projectedPrice3Days: 32,
    projectedPrice7Days: 35,
    demandTrend: 'Rising',
    weatherImpactFactor: 'Favorable harvest conditions',
    forecastAccuracyPct: 'High',
    keyAdvice: 'Urban retail pack demand is peaking ahead of festival season. Stagger harvest batches for optimal realization.',
    sources: ['AGMARKNET Demo'],
    forecastData: [
      { day: 'Day 1', price: 30 },
      { day: 'Day 2', price: 31 },
      { day: 'Day 3', price: 32 },
      { day: 'Day 4', price: 33 },
      { day: 'Day 5', price: 34 },
      { day: 'Day 6', price: 34 },
      { day: 'Day 7', price: 35 },
    ]
  });"""

content = content.replace(old_initial, new_initial)

# Replace the forecast output stats and the rest of the block
old_stats = """        {/* Forecast Output Stats */}
        {forecastData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 gradient-border-organic border-0">
              <div className="text-[10px] text-slate-500 font-semibold uppercase">Current APMC Benchmark</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">₹{forecastData.currentMandiPrice}/kg</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{forecastData.crop} in {forecastData.region}</div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <div className="text-[10px] text-emerald-800 font-semibold uppercase">KisanMandi Fair Price</div>
              <div className="text-2xl font-extrabold text-emerald-800 mt-1">₹{forecastData.recommendedPlatformPrice}/kg</div>
              <div className="text-[11px] text-emerald-600 mt-0.5">Recommended seller floor</div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <div className="text-[10px] text-emerald-800 font-semibold uppercase">7-Day Projected Price</div>
              <div className="text-2xl font-extrabold text-emerald-800 mt-1">₹{forecastData.projectedPrice7Days}/kg</div>
              <div className="text-[11px] text-emerald-600 font-bold mt-0.5">Demand Trend: {forecastData.demandTrend}</div>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200">
              <div className="text-[10px] text-teal-800 font-semibold uppercase">Weather & Confidence</div>
              <div className="text-base font-extrabold text-teal-900 mt-1">{forecastData.weatherImpactFactor}</div>
              <div className="text-[11px] text-teal-600 font-semibold mt-0.5">{forecastData.forecastAccuracyPct}% Neural Confidence</div>
            </div>
          </div>
        )}

        {/* AI Market Advice Quote Box */}
        {forecastData && (
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-950 space-y-1">
            <span className="font-bold uppercase tracking-wider text-[10px] text-emerald-700">Strategic Mandi Advisory:</span>
            <p className="leading-relaxed">{forecastData.keyAdvice}</p>
          </div>
        )}"""

new_stats = """        {/* Updated Forecast Output Stats */}
        {forecastData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 gradient-border-organic border-0 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] text-slate-500 font-semibold uppercase">Current Market Price</div>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1">₹{forecastData.currentMandiPrice}/kg</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-tight">{forecastData.crop} in {forecastData.region}</div>
                </div>
                <div className="mt-3 text-[11px] font-bold text-slate-700">
                  Trend: {forecastData.demandTrend === 'Rising' ? '📈 Rising' : forecastData.demandTrend === 'Falling' ? '📉 Falling' : forecastData.demandTrend === 'Stable' ? '➡️ Stable' : '⚠️ Volatile'}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col justify-between col-span-1 md:col-span-2">
                <div>
                   <div className="text-[10px] text-emerald-800 font-semibold uppercase mb-2">Price Forecast (INR/kg)</div>
                   <div className="grid grid-cols-3 gap-2 text-center">
                     <div className="bg-white/60 rounded-xl p-2 border border-emerald-100">
                       <div className="text-[10px] font-bold text-slate-500">TOMORROW</div>
                       <div className="text-lg font-extrabold text-emerald-900">₹{forecastData.projectedPriceTomorrow || forecastData.currentMandiPrice}</div>
                     </div>
                     <div className="bg-white/60 rounded-xl p-2 border border-emerald-100">
                       <div className="text-[10px] font-bold text-slate-500">3-DAY</div>
                       <div className="text-lg font-extrabold text-emerald-900">₹{forecastData.projectedPrice3Days || forecastData.currentMandiPrice}</div>
                     </div>
                     <div className="bg-white/60 rounded-xl p-2 border border-emerald-100">
                       <div className="text-[10px] font-bold text-slate-500">7-DAY</div>
                       <div className="text-lg font-extrabold text-emerald-900">₹{forecastData.projectedPrice7Days}</div>
                     </div>
                   </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] text-teal-800 font-semibold uppercase">Weather & Confidence</div>
                  <div className="text-sm font-extrabold text-teal-900 mt-1 line-clamp-2">{forecastData.weatherImpactFactor}</div>
                </div>
                <div className="text-[11px] text-teal-700 font-semibold mt-2 bg-teal-100/50 px-2 py-1 rounded-lg inline-block self-start">
                  Confidence: {forecastData.forecastAccuracyPct}
                </div>
              </div>
            </div>

            {/* 7-Day Interactive Graph */}
            {forecastData.forecastData && forecastData.forecastData.length > 0 && (
              <div className="bg-slate-900 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <TrendingUp className="w-48 h-48" />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-slate-100 font-bold flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-400" />
                        1-7 Day Price Forecast
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">Predicted prices for {forecastData.crop} in {forecastData.region}</p>
                    </div>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={forecastData.forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                        <XAxis 
                          dataKey="day" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#94a3b8', fontSize: 12 }} 
                          dy={10} 
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#94a3b8', fontSize: 12 }} 
                          tickFormatter={(val) => `₹${val}`} 
                          domain={['auto', 'auto']}
                        />
                        <Tooltip 
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-slate-800 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs">
                                  <div className="font-bold text-slate-300 mb-1 border-b border-slate-700 pb-1 flex justify-between">
                                    <span>{label}</span>
                                    <span className="text-emerald-400 ml-3">AI Forecast</span>
                                  </div>
                                  <div className="text-slate-400 mb-1">{forecastData.crop} • {forecastData.region}</div>
                                  <div className="font-extrabold text-emerald-400 text-lg">₹{payload[0].value?.toFixed(2)}/kg</div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="price" 
                          stroke="#34d399" 
                          fillOpacity={1} 
                          fill="url(#colorForecast)" 
                          strokeWidth={3}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="price" 
                          stroke="#34d399" 
                          strokeWidth={3} 
                          dot={{ fill: '#0f172a', stroke: '#34d399', strokeWidth: 2, r: 4 }}
                          activeDot={{ fill: '#34d399', stroke: '#fff', strokeWidth: 2, r: 6 }}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Advisory Box */}
              <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
                forecastData.keyAdvice.toLowerCase().includes('sell') 
                  ? 'bg-rose-50/80 border-rose-200 text-rose-950' 
                  : forecastData.keyAdvice.toLowerCase().includes('wait') || forecastData.demandTrend === 'Rising'
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50/80 border-amber-200 text-amber-950'
              }`}>
                <div className={`p-2 rounded-xl shrink-0 ${
                   forecastData.keyAdvice.toLowerCase().includes('sell') ? 'bg-rose-100 text-rose-600' : 
                   forecastData.keyAdvice.toLowerCase().includes('wait') || forecastData.demandTrend === 'Rising' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                }`}>
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold uppercase tracking-wider text-[10px] opacity-70">Strategic Market Advisory:</span>
                  <p className="text-sm font-semibold mt-0.5 leading-relaxed">{forecastData.keyAdvice}</p>
                </div>
              </div>

              {/* Sources */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500 flex items-center gap-1.5">
                  <Search className="w-3 h-3" />
                  Forecast Data Sources
                </span>
                <ul className="mt-2 space-y-1">
                  {forecastData.sources && forecastData.sources.length > 0 ? (
                    forecastData.sources.map((src, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-slate-400 shrink-0" />
                        <span className="line-clamp-1">{src}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-slate-500 italic">No specific sources identified.</li>
                  )}
                </ul>
                <div className="text-[10px] text-slate-400 mt-2 font-medium">
                  Last updated: {new Date().toLocaleString()}
                </div>
              </div>
            </div>
          </>
        )}"""

content = content.replace(old_stats, new_stats)

with open('src/components/AdminPortal.tsx', 'w') as f:
    f.write(content)
