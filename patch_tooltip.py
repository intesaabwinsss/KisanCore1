import sys

with open('src/components/AdminPortal.tsx', 'r') as f:
    content = f.read()

old_tooltip = "₹{payload[0].value?.toFixed(2)}/kg"
new_tooltip = "₹{Number(payload[0].value).toFixed(2)}/kg"

content = content.replace(old_tooltip, new_tooltip)

with open('src/components/AdminPortal.tsx', 'w') as f:
    f.write(content)
