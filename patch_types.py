import sys

with open('src/types.ts', 'r') as f:
    content = f.read()

old_interface = """export interface DemandForecast {
  crop: string;
  region: string;
  currentMandiPrice: number;
  recommendedPlatformPrice: number;
  projectedPrice7Days: number;
  demandTrend: 'Surging' | 'Stable' | 'Softening';
  weatherImpactFactor: string;
  forecastAccuracyPct: number;
  keyAdvice: string;
}"""

new_interface = """export interface DemandForecast {
  crop: string;
  region: string;
  currentMandiPrice: number;
  recommendedPlatformPrice: number;
  projectedPriceTomorrow?: number;
  projectedPrice3Days?: number;
  projectedPrice7Days: number;
  demandTrend: 'Rising' | 'Falling' | 'Stable' | 'Volatile' | 'Surging' | 'Softening' | string;
  weatherImpactFactor: string;
  forecastAccuracyPct: number | string;
  keyAdvice: string;
  sources?: string[];
  forecastData?: { day: string; price: number }[];
}"""

if old_interface in content:
    content = content.replace(old_interface, new_interface)
else:
    print("Could not find exactly matching interface in types.ts. Attempting a looser replacement.")
    start_idx = content.find("export interface DemandForecast {")
    end_idx = content.find("}", start_idx) + 1
    if start_idx != -1:
        content = content[:start_idx] + new_interface + content[end_idx:]

with open('src/types.ts', 'w') as f:
    f.write(content)
