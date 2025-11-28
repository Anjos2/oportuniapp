import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Flag,
  Building2,
  Users,
  Menu,
  X,
  LogOut,
  Home,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

const menuItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { path: '/admin/publications', icon: FileText, label: 'Publicaciones' },
  { path: '/admin/reports', icon: Flag, label: 'Reportes' },
  { path: '/admin/external-accounts', icon: Building2, label: 'Cuentas Externas' },
];

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile header */}
      <div className="lg:hidden bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <span className="font-bold text-xl text-primary-800">Admin</span>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 left-0 h-full bg-white shadow-lg z-50 transition-all duration-300',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          isSidebarOpen ? 'w-64' : 'w-20'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b">
          {isSidebarOpen ? (
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">O</span>
              </div>
              <span className="font-bold text-xl text-gray-900">OportUNI</span>
            </Link>
          ) : (
            <div className="w-10 h-10 bg-primary-800 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-xl">O</span>
            </div>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden lg:block p-1 hover:bg-gray-100 rounded"
          >
            <ChevronLeft className={clsx('w-5 h-5 text-gray-500 transition-transform', !isSidebarOpen && 'rotate-180')} />
          </button>
        </div>

        {/* User info */}
        {isSidebarOpen && user && (
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              {user.profile_photo ? (
                <img
                  src={user.profile_photo}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-800 font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="overflow-hidden">
                <p className="font-medium text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={clsx(
                'flex items-center px-3 py-2 rounded-lg transition-colors',
                isActive(item.path, item.exact)
                  ? 'bg-primary-50 text-primary-800'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span className="ml-3">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <Link
            to="/"
            className={clsx(
              'flex items-center px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100',
              !isSidebarOpen && 'justify-center'
            )}
          >
            <Home className="w-5 h-5" />
            {isSidebarOpen && <span className="ml-3">Ir al Sitio</span>}
          </Link>
          <button
            onClick={handleLogout}
            className={clsx(
              'flex items-center w-full px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 mt-2',
              !isSidebarOpen && 'justify-center'
            )}
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="ml-3">Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main
        className={clsx(
          'transition-all duration-300 min-h-screen',
          isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        )}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
