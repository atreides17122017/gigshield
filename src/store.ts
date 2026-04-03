import { create } from 'zustand'

export interface User {
  name: string;
  email: string;
  phone?: string;
  platform: 'Zomato' | 'Swiggy' | '';
  zone: string;
  dailyIncome: number;
  workingHours: number;
  upiId?: string;
  trustScore?: number;
  isLoggedIn: boolean;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  dailyCoverage: number;
  weeklyCap: number;
}

export interface Claim {
  id: string;
  date: string;
  type: string;
  lostHours: number;
  amount: number;
  status: 'Approved' | 'Pending' | 'Rejected';
}

export interface ActiveTrigger {
  type: string;
  value: number;
  threshold: number;
  severity: number;
}

interface AppState {
  token: string | null;
  user: User;
  activePlanId: string | null;
  activeTrigger: ActiveTrigger | null;
  monitor: {
    rainfall: number;
    temperature: number;
    aqi: number;
    curfew: number;
    platformOutage: number;
    hasAlert: boolean;
  };
  claims: Claim[];
  notifications: Array<{ id: string; message: string; type: string }>;
  
  login: (email: string, name?: string) => void;
  register: (data: Partial<User>) => void;
  setAuth: (user: Partial<User>, token: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  subscribe: (planId: string) => void;
  addClaim: (claim: Claim) => void;
  setActiveTrigger: (trigger: ActiveTrigger | null) => void;
  addNotification: (message: string) => void;
}

export const useStore = create<AppState>((set) => ({
  token: localStorage.getItem('token') || null,
  user: {
    name: '',
    email: '',
    phone: '',
    platform: '',
    zone: '',
    dailyIncome: 0,
    workingHours: 0,
    trustScore: 0,
    isLoggedIn: !!localStorage.getItem('token'),
  },
  activePlanId: localStorage.getItem('activePlanId') || null,
  activeTrigger: null,
  monitor: {
    rainfall: 0,
    temperature: 32,
    aqi: 150,
    curfew: 0,
    platformOutage: 0,
    hasAlert: false,
  },
  claims: JSON.parse(localStorage.getItem('claims') || '[]'),
  notifications: [],

  login: (email, name) => set((state) => ({
    user: { 
      ...state.user, 
      email, 
      name: name || email.split('@')[0],
      platform: 'Zomato', 
      zone: 'Velachery', 
      dailyIncome: 500, 
      workingHours: 8,
      trustScore: 72,
      isLoggedIn: true 
    }
  })),
  register: (data) => set((state) => ({
    user: {
      ...state.user,
      ...data,
      name: data.name || '',
      email: data.email || '',
      platform: data.platform as any || 'Zomato',
      zone: data.zone || 'Velachery',
      trustScore: data.trustScore || Math.floor(Math.random() * 41) + 50,
      dailyIncome: data.dailyIncome || 500,
      isLoggedIn: true
    }
  })),
  setAuth: (user, token) => {
    localStorage.setItem('token', token);
    set((state) => ({
      user: { ...state.user, ...user, isLoggedIn: true },
      token
    }));
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('activePlanId');
    set({ token: null, user: { name: '', email: '', phone: '', platform: '', zone: '', dailyIncome: 0, workingHours: 0, upiId: '', trustScore: 0, isLoggedIn: false } });
  },
  updateProfile: (data) => set((state) => ({ user: { ...state.user, ...data } })),
  subscribe: (planId) => {
    if (planId) localStorage.setItem('activePlanId', planId);
    set({ activePlanId: planId })
  },
  addClaim: (claim) => set((state) => {
    const newClaims = [claim, ...state.claims];
    localStorage.setItem('claims', JSON.stringify(newClaims));
    return { claims: newClaims };
  }),
  setActiveTrigger: (trigger) => set({ activeTrigger: trigger }),
  addNotification: (message) => set((state) => ({
    notifications: [{ id: Date.now().toString(), message, type: 'alert' }, ...state.notifications]
  }))
}))
