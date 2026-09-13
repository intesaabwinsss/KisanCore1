import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

new_content = re.sub(
    r"const \[activeRole, setActiveRole\] = useState<RoleType>\('landing'\);",
    "const [activeRole, setActiveRole] = useState<RoleType>((localStorage.getItem('app_activeRole') as RoleType) || 'landing');\n  useEffect(() => { localStorage.setItem('app_activeRole', activeRole); }, [activeRole]);",
    content
)

new_content = re.sub(
    r"const \[cartItems, setCartItems\] = useState<CartItem\[\]>\(\[\]\);",
    "const [cartItems, setCartItems] = useState<CartItem[]>(() => { try { const saved = localStorage.getItem('app_cartItems'); return saved ? JSON.parse(saved) : []; } catch { return []; } });\n  useEffect(() => { localStorage.setItem('app_cartItems', JSON.stringify(cartItems)); }, [cartItems]);",
    new_content
)

with open('src/App.tsx', 'w') as f:
    f.write(new_content)
