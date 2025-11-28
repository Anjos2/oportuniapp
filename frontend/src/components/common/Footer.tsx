import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-app py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">O</span>
              </div>
              <span className="font-bold text-xl text-white">OportUNI</span>
            </div>
            <p className="text-sm text-gray-400">
              Plataforma de oportunidades académicas y profesionales para la comunidad de la Universidad Nacional de Ingeniería.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/opportunities" className="text-gray-400 hover:text-white transition-colors">
                  Oportunidades
                </Link>
              </li>
              <li>
                <Link to="/opportunities?type=1" className="text-gray-400 hover:text-white transition-colors">
                  Becas
                </Link>
              </li>
              <li>
                <Link to="/opportunities?type=2" className="text-gray-400 hover:text-white transition-colors">
                  Pasantías
                </Link>
              </li>
              <li>
                <Link to="/opportunities?type=3" className="text-gray-400 hover:text-white transition-colors">
                  Intercambios
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-400 hover:text-white transition-colors">
                  Ayuda / FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-white mb-4">Categorías</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/opportunities?type=4" className="text-gray-400 hover:text-white transition-colors">
                  Voluntariado
                </Link>
              </li>
              <li>
                <Link to="/opportunities?type=5" className="text-gray-400 hover:text-white transition-colors">
                  Mentoría
                </Link>
              </li>
              <li>
                <Link to="/opportunities?type=6" className="text-gray-400 hover:text-white transition-colors">
                  Concursos
                </Link>
              </li>
              <li>
                <Link to="/opportunities?type=7" className="text-gray-400 hover:text-white transition-colors">
                  Empleo
                </Link>
              </li>
              <li>
                <Link to="/opportunities?type=8" className="text-gray-400 hover:text-white transition-colors">
                  Investigación
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  Av. Túpac Amaru 210, Rímac, Lima, Perú
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-500" />
                <span className="text-gray-400 text-sm">(01) 482-0777</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-500" />
                <span className="text-gray-400 text-sm">ocbu@uni.edu.pe</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            © {currentYear} OportUNI - Universidad Nacional de Ingeniería. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-gray-400">
              Privacidad
            </Link>
            <Link to="/terms" className="text-sm text-gray-500 hover:text-gray-400">
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
