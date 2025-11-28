import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, GraduationCap, Briefcase, Globe, Heart, Users, Trophy, Building, BookOpen, ArrowRight, TrendingUp } from 'lucide-react';
import { opportunityApi, catalogApi } from '../services/api';
import OpportunityCard from '../components/opportunities/OpportunityCard';
import { Opportunity, OpportunityType } from '../types';

const categoryIcons: Record<string, React.ReactNode> = {
  'Beca': <GraduationCap className="w-8 h-8" />,
  'Pasantía': <Briefcase className="w-8 h-8" />,
  'Intercambio': <Globe className="w-8 h-8" />,
  'Voluntariado': <Heart className="w-8 h-8" />,
  'Mentoría': <Users className="w-8 h-8" />,
  'Concurso': <Trophy className="w-8 h-8" />,
  'Empleo': <Building className="w-8 h-8" />,
  'Investigación': <BookOpen className="w-8 h-8" />,
};

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredOpportunities, setFeaturedOpportunities] = useState<Opportunity[]>([]);
  const [opportunityTypes, setOpportunityTypes] = useState<OpportunityType[]>([]);
  const [stats, setStats] = useState({
    opportunities_count: 0,
    users_count: 0,
    applications_count: 0,
    publishers_count: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, typesRes, statsRes] = await Promise.all([
          opportunityApi.getFeatured(6),
          catalogApi.getOpportunityTypes(),
          catalogApi.getStatistics(),
        ]);

        setFeaturedOpportunities(featuredRes.data);
        setOpportunityTypes(typesRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/opportunities?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 text-white">
        <div className="container-app py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              Descubre tu próxima oportunidad en la UNI
            </h1>
            <p className="text-lg md:text-xl text-primary-100 mb-8">
              Becas, pasantías, intercambios y más oportunidades para impulsar tu carrera profesional
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar oportunidades..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pl-14 rounded-xl text-gray-900 placeholder-gray-400 shadow-lg focus:outline-none focus:ring-4 focus:ring-primary-500/50"
                />
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 btn-primary"
                >
                  Buscar
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container-app">
          <div className="text-center mb-10">
            <h2 className="section-title">Explora por categoría</h2>
            <p className="text-gray-600 mt-2">Encuentra oportunidades según tus intereses</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {opportunityTypes.map((type) => (
              <Link
                key={type.id}
                to={`/opportunities?type=${type.id}`}
                className="group p-6 bg-gray-50 rounded-xl hover:bg-primary-50 hover:shadow-md transition-all text-center"
              >
                <div className="w-16 h-16 mx-auto mb-3 bg-white rounded-full flex items-center justify-center text-primary-700 group-hover:bg-primary-100 transition-colors shadow-sm">
                  {categoryIcons[type.name] || <BookOpen className="w-8 h-8" />}
                </div>
                <h3 className="font-medium text-gray-900">{type.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Opportunities */}
      <section className="py-16 bg-gray-50">
        <div className="container-app">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="section-title">Oportunidades destacadas</h2>
              <p className="text-gray-600 mt-2">Las mejores oportunidades seleccionadas para ti</p>
            </div>
            <Link to="/opportunities" className="hidden md:flex items-center text-primary-700 hover:text-primary-800 font-medium">
              Ver todas <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-40 bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredOpportunities.map((opp) => (
                <OpportunityCard key={opp.id} opportunity={opp} showActions={false} />
              ))}
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link to="/opportunities" className="btn-primary">
              Ver todas las oportunidades
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary-800 text-white">
        <div className="container-app">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {stats.opportunities_count}+
              </div>
              <div className="text-primary-200">Oportunidades activas</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {stats.users_count}+
              </div>
              <div className="text-primary-200">Estudiantes registrados</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {stats.applications_count}+
              </div>
              <div className="text-primary-200">Postulaciones realizadas</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {stats.publishers_count}+
              </div>
              <div className="text-primary-200">Organizaciones aliadas</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container-app">
          <div className="bg-gradient-to-r from-secondary-100 to-secondary-50 rounded-2xl p-8 md:p-12">
            <div className="max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                ¿Eres una organización?
              </h2>
              <p className="text-gray-600 mb-6">
                Publica tus oportunidades y conecta con los mejores talentos de la Universidad Nacional de Ingeniería.
              </p>
              <Link to="/register" className="btn-primary">
                Registra tu organización
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
