with open('src/components/FarmerPortal.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
predictor_import = None
for line in lines:
    if "import { AIPricePredictor }" in line:
        predictor_import = line
    else:
        new_lines.append(line)

# find where to insert it safely (after import { FarmerAddCropModal })
for i, line in enumerate(new_lines):
    if "import { FarmerAddCropModal }" in line:
        new_lines.insert(i + 1, predictor_import)
        break

with open('src/components/FarmerPortal.tsx', 'w') as f:
    f.writelines(new_lines)
