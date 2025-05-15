// src/App.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DocumentProvider } from './context/DocumentContext';
import HomePage from './pages/HomePage';
import MainDashboard from './pages/MainDashboard';
import ZoomDashboard from './pages/ZoomDashboard';
import MeetingRoomPage from './pages/MeetingRoomPage';
import AuthCallback from './components/auth/AuthCallback';
import DocumentsList from './components/documents/DocumentsList';
import DocumentUpload from './components/documents/DocumentUpload';
import DocumentDetail from './components/documents/DocumentDetail';
import SigningRequestForm from './components/documents/SigningRequestForm';
import EmbeddedSigning from './components/documents/EmbeddedSigning';
import SignDocument from './components/documents/SignDocument';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Main Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainDashboard />
          </ProtectedRoute>
        }
      />

      {/* Zoom Routes */}
      <Route
        path="/zoom-dashboard"
        element={
          <ProtectedRoute>
            <ZoomDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/meeting"
        element={
          <ProtectedRoute>
            <MeetingRoomPage />
          </ProtectedRoute>
        }
      />

      {/* Document Routes */}
      <Route
        path="/documents"
        element={
          <ProtectedRoute>
            <DocumentsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/documents/upload"
        element={
          <ProtectedRoute>
            <DocumentUpload />
          </ProtectedRoute>
        }
      />
      <Route
        path="/documents/:id"
        element={
          <ProtectedRoute>
            <DocumentDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/documents/:id/sign"
        element={
          <ProtectedRoute>
            <SigningRequestForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/documents/:id/signing"
        element={
          <ProtectedRoute>
            <EmbeddedSigning />
          </ProtectedRoute>
        }
      />
      <Route
        path="/documents/:id/sign-document"
        element={
          <ProtectedRoute>
            <SignDocument />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <DocumentProvider>
        <div className="App">
          <AppRoutes />
        </div>
      </DocumentProvider>
    </AuthProvider>
  );
}

export default App;