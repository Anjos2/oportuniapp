import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { opportunityApi, catalogApi } from '../services/api';
import OpportunityCard from '../components/opportunities/OpportunityCard';
import Pagination from '../components/common/Pagination';
import { Opportunity, OpportunityType } from '../types';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import clsx from 'clsx';

export default function OpportunitiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [opportunityTypes, setOpportunityTypes] = useState<OpportunityType[]>([]);
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');
  const [selectedModality, setSelectedModality] = useState(searchParams.get('modality') || '');
  const [selectedSort, setSelectedSort] = useState(searchParams.get('sort') || 'recent');
  const currentPage = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await catalogApi.getOpportunityTypes();
        setOpportunityTypes(response.data);
      } catch (error) {
        console.error('Error fetching types:', error);
      }
    };
    fetchTypes();
  }, []);

  useEffect(() => {
    const fetchOpportunities = async () => {
      setIsLoading(true);
      try {
        const response = await opportunityApi.getAll({
          page: currentPage,
          limit: 12,
          type: selectedType ? parseInt(selectedType) : undefined,
          modality: selectedModality || undefined,
          search: search || undefined,
          sort: selectedSort,
        });

        setOpportunities(response.data.opportunities);
        setTotalPages(response.data.totalPages);
        setTotal(response.data.total);

        // Fetch saved opportunities if authenticated
        if (isAuthenticated) {
          const savedResponse = await opportunityApi.getSaved({ limit: 100 });
          setSavedIds(new Set(savedResponse.data.opportunities.map((o: Opportunity) => o.id)));
        }
      } catch (error) {
        console.error('Error fetching opportunities:', error);
        toast.error('Error al cargar oportunidades');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunities();
  }, [currentPage, selectedType, selectedModality, search, selectedSort, isAuthenticated]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search, page: '1' });
  };

  const updateFilters = (updates: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedType('');
    setSelectedModality('');
    setSelectedSort('recent');
    setSearchParams({});
  };

  const handleSave = async (id: number) => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para guardar oportunidades');
      return;
    }
    try {
      await opportunityApi.save(id);
      setSavedIds(new Set([...savedIds, id]));
      toast.success('Oportunidad guardada');
    } catch (error) {
      toast.error('Error al guardar');
    }
  };

  const handleUnsave = async (id: number) => {
    try {
      await opportunityApi.unsave(id);
      const newSaved = new Set(savedIds);
      newSaved.delete(id);
      setSavedIds(newSaved);
      toast.success('Oportunidad removida de guardados');
    } catch (error) {
      toast.error('Error al remover');
    }
  };

  const hasActiveFilters = selectedType || selectedModality || search;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-app py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Oportunidades</h1>
          <p className="text-gray-600 mt-2">
            Explora {total} oportunidades disponibles
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar oportunidades..."
                  className="input pl-10 pr-4"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </form>

            {/* Filter toggles */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={clsx(
                  'btn-outline flex items-center',
                  showFilters && 'bg-gray-100'
                )}
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filtros
                {hasActiveFilters && (
                  <span className="ml-2 w-5 h-5 bg-primary-800 text-white text-xs rounded-full flex items-center justify-center">
                    !
                  </span>
                )}
              </button>

              {hasActiveFilters && (
                <button onClick={clearFilters} className="btn-outline text-red-600">
                  <X className="w-4 h-4 mr-1" />
                  Limpiar
                </button>
              )}
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-white rounded-xl p-4 border border-gray-200 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Type filter */}
                <div>
                  <label className="label">Tipo</label>
                  <select
                    value={selectedType}
                    onChange={(e) => {
                      setSelectedType(e.target.value);
                      updateFilters({ type: e.target.value, page: '1' });
                    }}
                    className="input"
                  >
                    <option value="">Todos los tipos</option>
                    {opportunityTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Modality filter */}
                <div>
                  <label className="label">Modalidad</label>
                  <select
                    value={selectedModality}
                    onChange={(e) => {
                      setSelectedModality(e.target.value);
                      updateFilters({ modality: e.target.value, page: '1' });
                    }}
                    className="input"
                  >
                    <option value="">Todas las modalidades</option>
                    <option value="presencial">Presencial</option>
                    <option value="virtual">Virtual</option>
                    <option value="hibrido">Híbrido</option>
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="label">Ordenar por</label>
                  <select
                    value={selectedSort}
                    onChange={(e) => {
                      setSelectedSort(e.target.value);
                      updateFilters({ sort: e.target.value });
                    }}
                    className="input"
                  >
                    <option value="recent">Más recientes</option>
                    <option value="deadline">Fecha límite</option>
                    <option value="popular">Más populares</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
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
        ) : opportunities.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron oportunidades
            </h3>
            <p className="text-gray-600 mb-4">
              Intenta ajustar los filtros o realizar otra búsqueda
            </p>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="btn-primary">
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunities.map((opp) => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  isSaved={savedIds.has(opp.id)}
                  onSave={handleSave}
                  onUnsave={handleUnsave}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => updateFilters({ page: page.toString() })}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
