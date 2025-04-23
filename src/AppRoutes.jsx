import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import WelcomePage from './components/WelcomePage';
import QuizFlow from './components/QuizFlow';
import AdminLogin from './components/AdminLogin';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

import '../i18n';

export default function App() {
  const [userName, setUserName] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  if (loading) {
    return <div className="text-center mt-20 text-xl">Loading...</div>;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          !hasStarted ? (
            <WelcomePage
              name={userName}
              setName={setUserName}
              onStart={() => setHasStarted(true)}
            />
          ) : (
            <QuizFlow userName={userName} />
          )
        }
      />
      <Route path="/admin-login" element={<AdminLogin onLogin={() => navigate('/dashboard')} />} />
      <Route
        path="/dashboard"
        element={user ? <AnalyticsDashboard /> : <Navigate to="/admin-login" />}
      />
    </Routes>
  );
}