import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, Eye, Users, Clock, MoreVertical, Edit, Copy, Trash2, PauseCircle, PlayCircle } from 'lucide-react';
import { publicationApi } from '../services/api';
import Pagination from '../components/common/Pagination';
import { Opportunity } from '../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const statusConfig: Record<string, { label: string; color: string }> = {
  borrador: { label: 'Borrador', color: 'gray' },
  pendiente: { label: 'Pendiente', color: 'yellow' },
  activa: { label: 'Activa', color: 'green' },
  pausada: { label: 'Pausada', color: 'orange' },
  finalizada: { label: 'Finalizada', color: 'blue' },
  rechazada: { label: 'Rechazada', color: 'red' },
};

export default function MyPublicationsPage() {
  const [publications, setPublications] = useState<Opportunity[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  useEffect(() => {
    fetchPublications();
  }, [selectedStatus, currentPage]);

  const fetchPublications = async () => {
    setIsLoading(true);
    try {
      const response = await publicationApi.getMy({
        page: currentPage,
        limit: 10,
        status: selectedStatus || undefined,
      });
      setPublications(response.data.publications);
      setStats(response.data.stats);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching publications:', error);
      toast.error('Error al cargar publicaciones');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await publicationApi.updateStatus(id, newStatus);
      toast.success('Estado actualizado');
      fetchPublications();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al actualizar estado');
    }
    setOpenMenu(null);
  };

  const handleDuplicate = async (id: number) => {
    try {
      const response = await publicationApi.duplicate(id);
      toast.success('Publicación duplicada');
      fetchPublications();
    } catch (error) {
      toast.error('Error al duplicar');
    }
    setOpenMenu(null);
  };

  const statusFilters = [
    { value: '', label: 'Todas', count: stats.total || 0 },
    { value: 'activa', label: 'Activas', count: stats.activa || 0 },
    { value: 'pendiente', label: 'Pendientes', count: stats.pendiente || 0 },
    { value: 'borrador', label: 'Borradores', count: stats.borrador || 0 },
    { value: 'pausada', label: 'Pausadas', count: stats.pausada || 0 },
    { value: 'finalizada', label: 'Finalizadas', count: stats.finalizada || 0 },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container-app">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Publicaciones</h1>
            <p className="text-gray-600 mt-1">
              Gestiona tus oportunidades publicadas
            </p>
          </div>
          <Link to="/publications/new" className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Nueva publicación
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-gray-900">{stats.total || 0}</div>
            <div className="text-sm text-gray-500">Total publicaciones</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-green-600">{stats.activa || 0}</div>
            <div className="text-sm text-gray-500">Activas</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center text-2xl font-bold text-gray-900">
              {publications.reduce((sum, p) => sum + (p.views_count || 0), 0)}
            </div>
            <div className="text-sm text-gray-500">Vistas totales</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-primary-800">
              {publications.reduce((sum, p) => sum + (p.applications_count || 0), 0)}
            </div>
            <div className="text-sm text-gray-500">Postulaciones</div>
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

        {/* Publications List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : publications.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-sm text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tienes publicaciones
            </h3>
            <p className="text-gray-600 mb-4">
              Crea tu primera publicación para empezar a recibir postulaciones
            </p>
            <Link to="/publications/new" className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Crear publicación
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {publications.map((pub) => {
              const status = statusConfig[pub.status];

              return (
                <div key={pub.id} className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={clsx('badge', `bg-${status.color}-100 text-${status.color}-800`)}>
                            {status.label}
                          </span>
                          {pub.is_featured && (
                            <span className="badge bg-yellow-100 text-yellow-800">Destacada</span>
                          )}
                          {pub.type_name && (
                            <span className="badge bg-gray-100 text-gray-700">{pub.type_name}</span>
                          )}
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900">{pub.title}</h3>

                        <div className="flex items-center gap-6 mt-3 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {pub.views_count} vistas
                          </span>
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {pub.applications_count} postulaciones
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {format(new Date(pub.created_at), "d MMM yyyy", { locale: es })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/publications/${pub.id}/applications`}
                          className="btn-outline text-sm"
                        >
                          Ver postulaciones
                        </Link>

                        <div className="relative">
                          <button
                            onClick={() => setOpenMenu(openMenu === pub.id ? null : pub.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                          >
                            <MoreVertical className="w-5 h-5 text-gray-500" />
                          </button>

                          {openMenu === pub.id && (
                            <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10 animate-fade-in">
                              <Link
                                to={`/publications/${pub.id}/edit`}
                                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                              >
                                <Edit className="w-4 h-4 mr-3" />
                                Editar
                              </Link>
                              <button
                                onClick={() => handleDuplicate(pub.id)}
                                className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50"
                              >
                                <Copy className="w-4 h-4 mr-3" />
                                Duplicar
                              </button>
                              {pub.status === 'activa' && (
                                <button
                                  onClick={() => handleStatusChange(pub.id, 'pausada')}
                                  className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50"
                                >
                                  <PauseCircle className="w-4 h-4 mr-3" />
                                  Pausar
                                </button>
                              )}
                              {pub.status === 'pausada' && (
                                <button
                                  onClick={() => handleStatusChange(pub.id, 'activa')}
                                  className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50"
                                >
                                  <PlayCircle className="w-4 h-4 mr-3" />
                                  Reactivar
                                </button>
                              )}
                              {pub.status === 'borrador' && (
                                <button
                                  onClick={() => handleStatusChange(pub.id, 'pendiente')}
                                  className="flex items-center w-full px-4 py-2 text-green-700 hover:bg-green-50"
                                >
                                  <PlayCircle className="w-4 h-4 mr-3" />
                                  Publicar
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

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
