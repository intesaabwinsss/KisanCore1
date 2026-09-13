import sys

with open('server.ts', 'r') as f:
    content = f.read()

# Replace the existing /api/gemini/price-forecast endpoint
start_idx = content.find("app.post('/api/gemini/price-forecast'")
if start_idx == -1:
    print("Could not find /api/gemini/price-forecast")
    sys.exit(1)

# Find the end of the app.post block
# Since we know there are other endpoints below or it ends the file, let's search for the next app.post or app.get
end_idx = content.find("app.post('/", start_idx + 10)
if end_idx == -1:
    end_idx = content.find("app.get('/", start_idx + 10)
if end_idx == -1:
    end_idx = len(content)

old_endpoint = content[start_idx:end_idx]

new_endpoint = """app.post('/api/gemini/price-forecast', async (req, res) => {
  try {
    const { crop, region } = req.body;
    const ai = getGemini();
    if (!ai) {
      return res.status(500).json({ error: 'Gemini AI not initialized' });
    }

    const query = `Provide a detailed 7-day price forecast and supply-demand analysis for "${crop}" in the region "${region}".
Use Google Search to find recent market data (from sources like AGMARKNET, APMC, news) for this specific crop in this specific region.
Estimate a current base price in INR/kg.
Provide predictions for Tomorrow (Day 1), Day 3, and Day 7 in INR/kg based on the current market trends, weather, and supply/demand.
Also generate an array of 7 consecutive forecast data points starting from Day 1 to Day 7.
Include the market trend, weather impact, data sources used, and an advisory on whether to sell or wait.
Return strictly JSON matching this schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            data: {
              type: Type.OBJECT,
              properties: {
                crop: { type: Type.STRING },
                region: { type: Type.STRING },
                currentMandiPrice: { type: Type.NUMBER },
                recommendedPlatformPrice: { type: Type.NUMBER },
                projectedPriceTomorrow: { type: Type.NUMBER },
                projectedPrice3Days: { type: Type.NUMBER },
                projectedPrice7Days: { type: Type.NUMBER },
                demandTrend: { type: Type.STRING, enum: ["Rising", "Falling", "Stable", "Volatile"] },
                weatherImpactFactor: { type: Type.STRING },
                forecastAccuracyPct: { type: Type.STRING },
                keyAdvice: { type: Type.STRING },
                sources: { type: Type.ARRAY, items: { type: Type.STRING } },
                forecastData: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      day: { type: Type.STRING },
                      price: { type: Type.NUMBER }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!response.text) {
      throw new Error("Empty response from model");
    }

    const json = JSON.parse(response.text);
    return res.json(json);
  } catch (error: any) {
    console.error('Price Forecast Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to predict prices' });
  }
});

"""

new_content = content[:start_idx] + new_endpoint + content[end_idx:]

with open('server.ts', 'w') as f:
    f.write(new_content)
