import sys

with open('src/components/FarmerPortal.tsx', 'r') as f:
    content = f.read()

new_content_block = """
      {activeTab === 'price_predictor' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <AIPricePredictor />
        </div>
      )}
"""

comparison_end = content.find("</FarmerTraditionalComparison>", content.find("activeTab === 'comparison'")) + 30
# Add another find for ending div of comparison
comparison_end = content.find("</div>", comparison_end) + 6
comparison_end = content.find(")}", comparison_end) + 2

new_content = content[:comparison_end] + "\n" + new_content_block + content[comparison_end:]

with open('src/components/FarmerPortal.tsx', 'w') as f:
    f.write(new_content)

