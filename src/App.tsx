import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Plans from './pages/Plans';
import Monitor from './pages/Monitor';
import Calculator from './pages/Calculator';
import History from './pages/History';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Compare from './pages/Compare';
import Coverage from './pages/Coverage';
import Faq from './pages/Faq';
import Terms from './pages/Terms';
import Landing from './pages/Landing';
import { useStore } from './store';

import React from 'react';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useStore(state => state.user.isLoggedIn);
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={<Landing />} />
        
        <Route element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="monitor" element={<Monitor />} />
          <Route path="calculator" element={<Calculator />} />
          <Route path="history" element={<History />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="compare" element={<Compare />} />
          <Route path="coverage" element={<Coverage />} />
          <Route path="faq" element={<Faq />} />
          <Route path="terms" element={<Terms />} />
          <Route path="privacy" element={<Terms />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
