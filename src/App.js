import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { Box, Stack, CircularProgress } from '@mui/material';
import { supabase } from './supabaseClient';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TaskForm from './components/TaskForm';
import Calendar from './components/Calendar';
import Statistics from './components/Statistics';
import Settings from './components/Settings';
import Sidebar from './components/Sidebar';

const RequireAuth = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (event === 'SIGNED_OUT') {
        navigate('/login');
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </Box>
  );
  
  if (!session) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <RequireAuth>
            <Stack direction="row">
              <Sidebar />
              <Box sx={{ flexGrow: 1, p: 4, ml: { xs: 0, md: '240px' } }}>
                <Dashboard />
              </Box>
            </Stack>
          </RequireAuth>
        } />
        <Route path="/tarea/nueva" element={
          <RequireAuth>
            <Stack direction="row">
              <Sidebar />
              <Box sx={{ flexGrow: 1, p: 4, ml: { xs: 0, md: '240px' } }}>
                <TaskForm />
              </Box>
            </Stack>
          </RequireAuth>
        } />
        <Route path="/tarea/:id" element={
          <RequireAuth>
            <Stack direction="row">
              <Sidebar />
              <Box sx={{ flexGrow: 1, p: 4, ml: { xs: 0, md: '240px' } }}>
                <TaskForm />
              </Box>
            </Stack>
          </RequireAuth>
        } />
        <Route path="/calendario" element={
          <RequireAuth>
            <Stack direction="row">
              <Sidebar />
              <Box sx={{ flexGrow: 1, p: 4, ml: { xs: 0, md: '240px' } }}>
                <Calendar />
              </Box>
            </Stack>
          </RequireAuth>
        } />
        <Route path="/estadisticas" element={
          <RequireAuth>
            <Stack direction="row">
              <Sidebar />
              <Box sx={{ flexGrow: 1, p: 4, ml: { xs: 0, md: '240px' } }}>
                <Statistics />
              </Box>
            </Stack>
          </RequireAuth>
        } />
        <Route path="/configuracion" element={
          <RequireAuth>
            <Stack direction="row">
              <Sidebar />
              <Box sx={{ flexGrow: 1, p: 4, ml: { xs: 0, md: '240px' } }}>
                <Settings />
              </Box>
            </Stack>
          </RequireAuth>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
