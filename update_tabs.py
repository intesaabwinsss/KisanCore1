import sys

with open('src/components/FarmerPortal.tsx', 'r') as f:
    content = f.read()

new_tab_btn = """          <button
            id="tab-farmer-price-predictor"
            onClick={() => setActiveTab('price_predictor')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'price_predictor'
                ? 'bg-amber-500 text-amber-950 shadow-sm'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            <span>AI Price Predictor</span>
            <span className="bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider">New</span>
          </button>
"""

# Find the end of market_prices button
market_price_end = content.find("</button>", content.find("setActiveTab('market_prices')")) + 9

new_content = content[:market_price_end] + "\n\n" + new_tab_btn + content[market_price_end:]

with open('src/components/FarmerPortal.tsx', 'w') as f:
    f.write(new_content)

