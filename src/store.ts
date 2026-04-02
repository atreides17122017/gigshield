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

interface AppState {
<<<<<<< HEAD
  token: string | null;
=======
>>>>>>> bb158ccbe1fcbac67154d46ef2eab2a10b2a0f6d
  user: User;
  activePlanId: string | null;
  monitor: {
    rainfall: number;
    temperature: number;
    aqi: number;
    curfew: boolean;
    platformOutage: boolean;
    hasAlert: boolean;
  };
  claims: Claim[];
  notifications: Array<{ id: string; message: string; type: string }>;
  
  login: (email: string, name?: string) => void;
  register: (data: Partial<User>) => void;
<<<<<<< HEAD
  setAuth: (user: Partial<User>, token: string) => void;
=======
>>>>>>> bb158ccbe1fcbac67154d46ef2eab2a10b2a0f6d
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  subscribe: (planId: string) => void;
  addClaim: (claim: Omit<Claim, 'id' | 'date' | 'status'>) => void;
}

export const useStore = create<AppState>((set) => ({
<<<<<<< HEAD
  token: localStorage.getItem('token') || null,
=======
>>>>>>> bb158ccbe1fcbac67154d46ef2eab2a10b2a0f6d
  user: {
    name: '',
    email: '',
    phone: '',
    platform: '',
    zone: '',
    dailyIncome: 0,
    workingHours: 0,
<<<<<<< HEAD
    trustScore: 0,
    isLoggedIn: !!localStorage.getItem('token'),
  },
  activePlanId: localStorage.getItem('activePlanId') || null,
=======
    upiId: '',
    trustScore: 0,
    isLoggedIn: false,
  },
  activePlanId: null,
>>>>>>> bb158ccbe1fcbac67154d46ef2eab2a10b2a0f6d
  monitor: {
    rainfall: 65, // mm
    temperature: 32, // C
    aqi: 320,
    curfew: false,
    platformOutage: true,
    hasAlert: true, // Example alert
  },
  claims: [
    { id: 'CLM-001', date: '2026-03-15', type: 'Rain', lostHours: 4, amount: 1600, status: 'Approved' },
    { id: 'CLM-002', date: '2026-02-28', type: 'Traffic', lostHours: 2, amount: 800, status: 'Approved' },
  ],
  notifications: [
    { id: '1', message: 'Heavy Rain Detected — coverage active', type: 'alert' },
    { id: '2', message: 'Claim CLM-001 Approved', type: 'success' },
  ],

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
<<<<<<< HEAD
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
=======
  logout: () => set({ user: { name: '', email: '', phone: '', platform: '', zone: '', dailyIncome: 0, workingHours: 0, upiId: '', trustScore: 0, isLoggedIn: false } }),
  updateProfile: (data) => set((state) => ({ user: { ...state.user, ...data } })),
  subscribe: (planId) => set({ activePlanId: planId }),
>>>>>>> bb158ccbe1fcbac67154d46ef2eab2a10b2a0f6d
  addClaim: (claim) => set((state) => ({
    claims: [
      {
        ...claim,
        id: `CLM-00${state.claims.length + 1}`,
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
      },
      ...state.claims
    ]
  }))
}))
