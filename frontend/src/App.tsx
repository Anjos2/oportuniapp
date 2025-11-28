import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import MainLayout from './components/common/MainLayout';
import AdminLayout from './components/admin/AdminLayout';

// Public Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import OpportunityDetailPage from './pages/OpportunityDetailPage';
import HelpPage from './pages/HelpPage';

// Protected Pages
import ProfilePage from './pages/ProfilePage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import SavedOpportunitiesPage from './pages/SavedOpportunitiesPage';

// Publisher Pages
import MyPublicationsPage from './pages/MyPublicationsPage';
import CreatePublicationPage from './pages/CreatePublicationPage';
import EditPublicationPage from './pages/EditPublicationPage';
import PublicationApplicationsPage from './pages/PublicationApplicationsPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminPublicationsPage from './pages/admin/AdminPublicationsPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminExternalAccountsPage from './pages/admin/AdminExternalAccountsPage';

// Loading component
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando...</p>
      </div>
    </div>
  );
}

// Protected route wrapper
function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

// Public route (redirect if authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="opportunities" element={<OpportunitiesPage />} />
        <Route path="opportunities/:id" element={<OpportunityDetailPage />} />
        <Route path="help" element={<HelpPage />} />

        {/* Auth routes */}
        <Route
          path="login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        {/* Protected user routes */}
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-applications"
          element={
            <ProtectedRoute>
              <MyApplicationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="saved"
          element={
            <ProtectedRoute>
              <SavedOpportunitiesPage />
            </ProtectedRoute>
          }
        />

        {/* Publisher routes */}
        <Route
          path="my-publications"
          element={
            <ProtectedRoute roles={['publisher', 'admin']}>
              <MyPublicationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="publications/new"
          element={
            <ProtectedRoute roles={['publisher', 'admin']}>
              <CreatePublicationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="publications/:id/edit"
          element={
            <ProtectedRoute roles={['publisher', 'admin']}>
              <EditPublicationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="publications/:id/applications"
          element={
            <ProtectedRoute roles={['publisher', 'admin']}>
              <PublicationApplicationsPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="publications" element={<AdminPublicationsPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="external-accounts" element={<AdminExternalAccountsPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
