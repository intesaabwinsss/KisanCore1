import sys

with open('src/components/government/GovernmentDashboard.tsx', 'r') as f:
    content = f.read()

new_import = "import { GovernmentPriceIntelligence } from './GovernmentPriceIntelligence';\n"
content = content.replace("import { GovernmentInsightsPanel } from './GovernmentInsightsPanel';", new_import + "import { GovernmentInsightsPanel } from './GovernmentInsightsPanel';")

content = content.replace("<GovernmentInsightsPanel />", "<GovernmentInsightsPanel />\n            <GovernmentPriceIntelligence />", 1)

with open('src/components/government/GovernmentDashboard.tsx', 'w') as f:
    f.write(content)
