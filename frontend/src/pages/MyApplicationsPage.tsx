import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, Eye, ChevronRight, Filter } from 'lucide-react';
import { applicationApi } from '../services/api';
import { Application } from '../types';
import Pagination from '../components/common/Pagination';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const statusConfig: Record<string, { label: string; color: string; icon: React.ComponentType<any> }> = {
  pendiente: { label: 'Pendiente', color: 'yellow', icon: Clock },
  en_revision: { label: 'En revisión', color: 'blue', icon: Eye },
  preseleccionado: { label: 'Preseleccionado', color: 'purple', icon: AlertCircle },
  aceptado: { label: 'Aceptado', color: 'green', icon: CheckCircle },
  rechazado: { label: 'Rechazado', color: 'red', icon: XCircle },
  retirado: { label: 'Retirado', color: 'gray', icon: XCircle },
};

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchApplications();
  }, [selectedStatus, currentPage]);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const response = await applicationApi.getMy({
        page: currentPage,
        limit: 10,
        status: selectedStatus || undefined,
      });
      setApplications(response.data.applications);
      setStats(response.data.stats);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Error al cargar postulaciones');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async (id: number) => {
    if (!confirm('¿Estás seguro de retirar esta postulación?')) return;

    try {
      await applicationApi.withdraw(id);
      toast.success('Postulación retirada');
      fetchApplications();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al retirar postulación');
    }
  };

  const statusFilters = [
    { value: '', label: 'Todas', count: stats.total || 0 },
    { value: 'pendiente', label: 'Pendientes', count: stats.pendiente || 0 },
    { value: 'en_revision', label: 'En revisión', count: stats.en_revision || 0 },
    { value: 'preseleccionado', label: 'Preseleccionados', count: stats.preseleccionado || 0 },
    { value: 'aceptado', label: 'Aceptados', count: stats.aceptado || 0 },
    { value: 'rechazado', label: 'Rechazados', count: stats.rechazado || 0 },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container-app">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Postulaciones</h1>
            <p className="text-gray-600 mt-1">
              Gestiona y da seguimiento a tus postulaciones
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-gray-900">{stats.total || 0}</div>
            <div className="text-sm text-gray-500">Total postulaciones</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-yellow-600">{stats.pendiente || 0}</div>
            <div className="text-sm text-gray-500">Pendientes</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-green-600">{stats.aceptado || 0}</div>
            <div className="text-sm text-gray-500">Aceptadas</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-purple-600">{stats.preseleccionado || 0}</div>
            <div className="text-sm text-gray-500">Preseleccionadas</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="flex overflow-x-auto p-1">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => {
                  setSelectedStatus(filter.value);
                  setCurrentPage(1);
                }}
                className={clsx(
                  'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                  selectedStatus === filter.value
                    ? 'bg-primary-100 text-primary-800'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                {filter.label}
                <span className="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Applications List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-sm text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tienes postulaciones
            </h3>
            <p className="text-gray-600 mb-4">
              {selectedStatus
                ? 'No hay postulaciones con este estado'
                : 'Comienza explorando las oportunidades disponibles'}
            </p>
            <Link to="/opportunities" className="btn-primary">
              Explorar oportunidades
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => {
              const status = statusConfig[app.status];
              const StatusIcon = status.icon;

              return (
                <div key={app.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={clsx(
                            'badge',
                            `bg-${status.color}-100 text-${status.color}-800`
                          )}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {status.label}
                          </span>
                          {app.type_name && (
                            <span className="badge bg-gray-100 text-gray-700">
                              {app.type_name}
                            </span>
                          )}
                        </div>

                        <Link
                          to={`/opportunities/${app.opportunity_id}`}
                          className="text-lg font-semibold text-gray-900 hover:text-primary-700"
                        >
                          {app.title}
                        </Link>

                        {app.organization_name && (
                          <p className="text-gray-600 mt-1">{app.organization_name}</p>
                        )}

                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                          <span>
                            Postulado: {format(new Date(app.created_at), "d 'de' MMMM, yyyy", { locale: es })}
                          </span>
                          {app.updated_at !== app.created_at && (
                            <span>
                              Actualizado: {format(new Date(app.updated_at), "d MMM", { locale: es })}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {(app.status === 'pendiente' || app.status === 'en_revision') && (
                          <button
                            onClick={() => handleWithdraw(app.id)}
                            className="btn-outline text-sm text-red-600 hover:bg-red-50"
                          >
                            Retirar
                          </button>
                        )}
                        <Link
                          to={`/opportunities/${app.opportunity_id}`}
                          className="btn-outline text-sm"
                        >
                          Ver detalle
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                      </div>
                    </div>

                    {app.cover_letter && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Tu carta de presentación:</p>
                        <p className="text-sm text-gray-700 line-clamp-2">{app.cover_letter}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
