import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, User, LogOut, ChevronDown, Bookmark, FileText, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-app">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">O</span>
            </div>
            <span className="font-bold text-xl text-gray-900">OportUNI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/opportunities" className="text-gray-600 hover:text-primary-800 font-medium">
              Oportunidades
            </Link>
            <Link to="/help" className="text-gray-600 hover:text-primary-800 font-medium">
              Ayuda
            </Link>
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                {/* Notifications */}
                <button className="relative p-2 text-gray-600 hover:text-primary-800">
                  <Bell className="w-5 h-5" />
                  {user.unread_notifications && user.unread_notifications > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {user.unread_notifications > 9 ? '9+' : user.unread_notifications}
                    </span>
                  )}
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
                  >
                    {user.profile_photo ? (
                      <img
                        src={user.profile_photo}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-800 font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="text-gray-700 font-medium max-w-32 truncate">{user.name}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-fade-in">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        <User className="w-4 h-4 mr-3" />
                        Mi Perfil
                      </Link>

                      <Link
                        to="/my-applications"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        <FileText className="w-4 h-4 mr-3" />
                        Mis Postulaciones
                      </Link>

                      <Link
                        to="/saved"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        <Bookmark className="w-4 h-4 mr-3" />
                        Guardadas
                      </Link>

                      {(user.role === 'publisher' || user.role === 'admin') && (
                        <Link
                          to="/my-publications"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                        >
                          <FileText className="w-4 h-4 mr-3" />
                          Mis Publicaciones
                        </Link>
                      )}

                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                        >
                          <LayoutDashboard className="w-4 h-4 mr-3" />
                          Administración
                        </Link>
                      )}

                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-outline">
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="btn-primary">
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-fade-in">
            <nav className="flex flex-col space-y-2">
              <Link
                to="/opportunities"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Oportunidades
              </Link>
              <Link
                to="/help"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Ayuda
              </Link>

              {isAuthenticated && user ? (
                <>
                  <div className="border-t border-gray-100 my-2 pt-2">
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg flex items-center"
                    >
                      <User className="w-4 h-4 mr-3" />
                      Mi Perfil
                    </Link>
                    <Link
                      to="/my-applications"
                      onClick={() => setIsMenuOpen(false)}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg flex items-center"
                    >
                      <FileText className="w-4 h-4 mr-3" />
                      Mis Postulaciones
                    </Link>
                    <Link
                      to="/saved"
                      onClick={() => setIsMenuOpen(false)}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg flex items-center"
                    >
                      <Bookmark className="w-4 h-4 mr-3" />
                      Guardadas
                    </Link>
                    {(user.role === 'publisher' || user.role === 'admin') && (
                      <Link
                        to="/my-publications"
                        onClick={() => setIsMenuOpen(false)}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg flex items-center"
                      >
                        <FileText className="w-4 h-4 mr-3" />
                        Mis Publicaciones
                      </Link>
                    )}
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsMenuOpen(false)}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg flex items-center"
                      >
                        <LayoutDashboard className="w-4 h-4 mr-3" />
                        Administración
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Cerrar Sesión
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t border-gray-100 my-2 pt-2 flex flex-col space-y-2 px-4">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="btn-outline text-center"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="btn-primary text-center"
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
