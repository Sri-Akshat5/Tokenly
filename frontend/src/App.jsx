import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ApiKeys from './pages/ApiKeys';
import IntegrationGuide from './pages/IntegrationGuide';
import AuthConfig from './pages/AuthConfig';
import CustomFields from './pages/CustomFields';
import Users from './pages/Users';
import Settings from './pages/Settings';
import UserAuth from './pages/UserAuth';
import MagicLinkVerify from './pages/MagicLinkVerify';
import EmailVerified from './pages/EmailVerified';
import ResetPassword from './pages/ResetPassword';
import Documentation from './pages/Documentation';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import authService from './services/authService';

// Protected Route Component
function ProtectedRoute({ children }) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Public Route Component (redirect if authenticated)
function PublicRoute({ children }) {
  if (authService.isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/docs" element={<Documentation />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />

        {/* End-User Application Auth (Public) */}
        <Route path="/auth/:appId/login" element={<UserAuth />} />
        <Route path="/auth/verify" element={<MagicLinkVerify />} />
        <Route path="/auth/verified" element={<EmailVerified />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

        {/* Application Routes */}
        <Route path="/app/:appId" element={<ProtectedRoute><ApiKeys /></ProtectedRoute>} />
        <Route path="/app/:appId/auth-config" element={<ProtectedRoute><AuthConfig /></ProtectedRoute>} />
        <Route path="/app/:appId/custom-fields" element={<ProtectedRoute><CustomFields /></ProtectedRoute>} />
        <Route path="/app/:appId/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
        <Route path="/app/:appId/docs" element={<ProtectedRoute><IntegrationGuide /></ProtectedRoute>} />

        {/* Catch all - redirect to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
