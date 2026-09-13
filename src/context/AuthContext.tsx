import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'farmer' | 'consumer';

export interface Transaction {
  id: string;
  date: string;
  type: string;
  description: string;
  amount: number;
  isCredit: boolean;
  balanceAfter: number;
}

export interface User {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  role: UserRole;
  password: string; // Simple demo auth
  location: string;
  state?: string;
  district?: string;
  walletBalance?: number;
  transactions?: Transaction[];
  isVerified?: boolean;
  documents?: {
    aadhaar?: { name: string; size: number; type: string };
    pan?: { name: string; size: number; type: string };
  };
}

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  login: (identifier: string, pass: string) => User | null;
  registerKisan: (data: Omit<User, 'id' | 'role' | 'walletBalance' | 'transactions'>) => User;
  registerConsumer: (data: Omit<User, 'id' | 'role' | 'state' | 'district' | 'walletBalance' | 'transactions'>) => User;
  logout: () => void;
  updateWallet: (amount: number, isCredit: boolean, description: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Load from local storage on init
    const storedUsers = localStorage.getItem('kisan_demo_users');
    const storedCurrentUserId = localStorage.getItem('kisan_demo_current_user_id');

    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
    
    if (storedUsers && storedCurrentUserId) {
      const parsedUsers: User[] = JSON.parse(storedUsers);
      const foundUser = parsedUsers.find(u => u.id === storedCurrentUserId);
      if (foundUser) {
        setCurrentUser(foundUser);
      }
    }
  }, []);

  const saveState = (newUsers: User[], newUser: User | null) => {
    setUsers(newUsers);
    setCurrentUser(newUser);
    localStorage.setItem('kisan_demo_users', JSON.stringify(newUsers));
    if (newUser) {
      localStorage.setItem('kisan_demo_current_user_id', newUser.id);
    } else {
      localStorage.removeItem('kisan_demo_current_user_id');
    }
  };

  const login = (identifier: string, pass: string) => {
    const user = users.find(u => (u.mobile === identifier || u.email === identifier) && u.password === pass);
    if (user) {
      saveState(users, user);
      return user;
    }
    return null;
  };

  const registerKisan = (data: Omit<User, 'id' | 'role' | 'walletBalance' | 'transactions'>) => {
    const existing = users.find(u => u.mobile === data.mobile);
    if (existing) throw new Error('User with this mobile number already exists');

    const newUser: User = {
      ...data,
      id: `kisan_${Date.now()}`,
      role: 'farmer',
      walletBalance: 10000,
      transactions: [{
        id: `txn_${Date.now()}`,
        date: new Date().toISOString(),
        type: 'CREDIT',
        description: 'Initial Platform Bonus',
        amount: 10000,
        isCredit: true,
        balanceAfter: 10000
      }]
    };

    const newUsers = [...users, newUser];
    saveState(newUsers, newUser);
    return newUser;
  };

  const registerConsumer = (data: Omit<User, 'id' | 'role' | 'state' | 'district' | 'walletBalance' | 'transactions'>) => {
    const existing = users.find(u => u.mobile === data.mobile);
    if (existing) throw new Error('User with this mobile number already exists');

    const newUser: User = {
      ...data,
      id: `consumer_${Date.now()}`,
      role: 'consumer'
    };

    const newUsers = [...users, newUser];
    saveState(newUsers, newUser);
    return newUser;
  };

  const logout = () => {
    saveState(users, null);
  };

  const updateWallet = (amount: number, isCredit: boolean, description: string) => {
    if (!currentUser || currentUser.role !== 'farmer' || currentUser.walletBalance === undefined) return;

    const newBalance = isCredit ? currentUser.walletBalance + amount : currentUser.walletBalance - amount;
    
    const newTxn: Transaction = {
      id: `txn_${Date.now()}`,
      date: new Date().toISOString(),
      type: isCredit ? 'CREDIT' : 'DEBIT',
      description,
      amount,
      isCredit,
      balanceAfter: newBalance
    };

    const updatedUser: User = {
      ...currentUser,
      walletBalance: newBalance,
      transactions: [newTxn, ...(currentUser.transactions || [])]
    };

    const updatedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);
    saveState(updatedUsers, updatedUser);
  };

  return (
    <AuthContext.Provider value={{ currentUser, users, login, registerKisan, registerConsumer, logout, updateWallet }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
