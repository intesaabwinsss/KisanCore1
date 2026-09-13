import sys

with open('server.ts', 'r') as f:
    content = f.read()

endpoint = """
// AI Produce Price Predictor Endpoint (Google Grounded)
app.post('/api/gemini/price-predict', async (req, res) => {
  try {
    const { crop, state, district } = req.body;
    const ai = getGemini();
    if (!ai) {
      return res.status(500).json({ error: 'Gemini AI not initialized' });
    }

    const query = `Provide the latest wholesale market/mandi prices and market trends for ${crop} in ${district || ''}, ${state}, India. 
Use Google Search to find recent data (from sources like AGMARKNET, government data, or news). 
Estimate a base current price in ₹/kg. 
Estimate the future price at 7 days, 15 days, and 30 days based on recent trends, seasonal demand, supply, and weather.
Provide a list of positive and negative factors influencing the price.
List the exact source names and URLs you found this information from.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            basePrice: { type: Type.NUMBER, description: "Current estimated price in ₹/kg" },
            trend: { type: Type.STRING, enum: ["UP", "DOWN", "STABLE"], description: "Overall short-term price trend" },
            prediction7: { type: Type.NUMBER, description: "Estimated price in ₹/kg after 7 days" },
            prediction15: { type: Type.NUMBER, description: "Estimated price in ₹/kg after 15 days" },
            prediction30: { type: Type.NUMBER, description: "Estimated price in ₹/kg after 30 days" },
            confidence: { type: Type.STRING, enum: ["High", "Medium", "Low", "Limited"], description: "Confidence level of prediction based on data quality" },
            factors: {
              type: Type.OBJECT,
              properties: {
                positive: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Factors driving the price up" },
                negative: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Factors driving the price down" }
              }
            },
            sources: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of sources used (e.g., 'AGMARKNET', 'Economic Times')"
            },
            retrievedAt: { type: Type.STRING, description: "Approximate timestamp/date of the retrieved data" }
          }
        }
      }
    });

    if (!response.text) {
      throw new Error("Empty response from model");
    }

    const data = JSON.parse(response.text);
    return res.json(data);
  } catch (error: any) {
    console.error('Price Prediction Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to predict prices' });
  }
});
"""

# Find a good place to insert (e.g., after the existing quality-grade endpoint)
insert_pos = content.find("app.post('/api/gemini/quality-grade'")
# Move past this entire endpoint block
next_endpoint = content.find("app.post('/api/notifications/whatsapp'", insert_pos)

new_content = content[:next_endpoint] + endpoint + "\n" + content[next_endpoint:]

with open('server.ts', 'w') as f:
    f.write(new_content)
