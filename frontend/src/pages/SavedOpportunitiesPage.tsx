import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Search } from 'lucide-react';
import { opportunityApi } from '../services/api';
import OpportunityCard from '../components/opportunities/OpportunityCard';
import Pagination from '../components/common/Pagination';
import { Opportunity } from '../types';
import toast from 'react-hot-toast';

export default function SavedOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchSaved();
  }, [currentPage]);

  const fetchSaved = async () => {
    setIsLoading(true);
    try {
      const response = await opportunityApi.getSaved({
        page: currentPage,
        limit: 12,
      });
      setOpportunities(response.data.opportunities);
      setTotalPages(response.data.totalPages);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching saved:', error);
      toast.error('Error al cargar oportunidades guardadas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsave = async (id: number) => {
    try {
      await opportunityApi.unsave(id);
      setOpportunities(opportunities.filter(o => o.id !== id));
      setTotal(prev => prev - 1);
      toast.success('Oportunidad removida de guardados');
    } catch (error) {
      toast.error('Error al remover');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container-app">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Oportunidades Guardadas</h1>
          <p className="text-gray-600 mt-1">
            {total} oportunidades guardadas
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-40 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : opportunities.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-sm text-center">
            <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tienes oportunidades guardadas
            </h3>
            <p className="text-gray-600 mb-4">
              Guarda oportunidades para revisarlas más tarde
            </p>
            <Link to="/opportunities" className="btn-primary">
              Explorar oportunidades
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunities.map((opp) => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  isSaved={true}
                  onUnsave={handleUnsave}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
