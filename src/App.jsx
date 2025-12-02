// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { ThemeProvider, createTheme } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';
// import { AuthProvider, useAuth } from './contexts/AuthContext';
// import Layout from './components/Layout';
// import Login from './pages/Login';
// import Dashboard from './pages/Dashboard';
// import LeadManagement from './pages/LeadManagement';
// import UserManagement from './pages/UserManagement';
// import ProtectedRoute from './components/ProtectedRoute';

// const theme = createTheme({
//   palette: {
//     mode: 'light',
//     primary: {
//       main: '#1976d2',
//     },
//     secondary: {
//       main: '#dc004e',
//     },
//   },
// });

// const AppRoutes = () => {
//   const { isAuthenticated } = useAuth();

//   return (
//     <Routes>
//       <Route path="/login" element={
//         !isAuthenticated ? <Login /> : <Navigate to="/dashboard" />
//       } />
//       <Route path="/" element={
//         <ProtectedRoute allowedRoles={['super_admin', 'sub_admin', 'support_agent']}>
//           <Layout />
//         </ProtectedRoute>
//       }>
//         <Route index element={<Navigate to="/dashboard" />} />
//         <Route path="dashboard" element={<Dashboard />} />
//         <Route path="leads" element={
//           <ProtectedRoute allowedRoles={['super_admin', 'sub_admin', 'support_agent']}>
//             <LeadManagement />
//           </ProtectedRoute>
//         } />
//         <Route path="users" element={
//           <ProtectedRoute allowedRoles={['super_admin']}>
//             <UserManagement />
//           </ProtectedRoute>
//         } />
//       </Route>
//     </Routes>
//   );
// };

// function App() {
//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <Router>
//         <AuthProvider>
//           <AppRoutes />
//         </AuthProvider>
//       </Router>
//     </ThemeProvider>
//   );
// }

// export default App;











import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LeadManagement from './pages/LeadManagement';
import LeadDetail from './pages/LeadDetail';
import UserManagement from './pages/UserManagement';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={
        !isAuthenticated ? <Login /> : <Navigate to="/dashboard" />
      } />
      <Route path="/" element={
        <ProtectedRoute allowedRoles={['super_admin', 'sub_admin', 'support_agent']}>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="leads" element={<LeadManagement />} />
        <Route path="leads/:id" element={<LeadDetail />} />
        <Route path="users" element={
          <ProtectedRoute allowedRoles={['super_admin']}>
            <UserManagement />
          </ProtectedRoute>
        } />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;