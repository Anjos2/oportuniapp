import { useState, useEffect } from 'react';
import { Search, Filter, Check, X, Star, StarOff, Eye, Trash2 } from 'lucide-react';
import { adminApi, catalogApi } from '../../services/api';
import { Opportunity, OpportunityType } from '../../types';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';
import clsx from 'clsx';

export default function AdminPublicationsPage() {
  const [publications, setPublications] = useState<Opportunity[]>([]);
  const [opportunityTypes, setOpportunityTypes] = useState<OpportunityType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPub, setSelectedPub] = useState<Opportunity | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    catalogApi.getOpportunityTypes().then(res => setOpportunityTypes(res.data));
  }, []);

  useEffect(() => {
    fetchPublications();
  }, [search, statusFilter, typeFilter, currentPage]);

  const fetchPublications = async () => {
    setIsLoading(true);
    try {
      const response = await adminApi.getPublications({
        page: currentPage,
        limit: 20,
        status: statusFilter || undefined,
        type: typeFilter ? parseInt(typeFilter) : undefined,
        search: search || undefined,
      });
      setPublications(response.data.publications);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error('Error al cargar publicaciones');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await adminApi.updatePublicationStatus(id, { status: 'activa' });
      toast.success('Publicación aprobada');
      fetchPublications();
    } catch (error) {
      toast.error('Error al aprobar');
    }
  };

  const handleReject = async () => {
    if (!selectedPub || !rejectionReason.trim()) {
      toast.error('Debes indicar la razón del rechazo');
      return;
    }
    try {
      await adminApi.updatePublicationStatus(selectedPub.id, {
        status: 'rechazada',
        rejection_reason: rejectionReason,
      });
      toast.success('Publicación rechazada');
      setSelectedPub(null);
      setRejectionReason('');
      fetchPublications();
    } catch (error) {
      toast.error('Error al rechazar');
    }
  };

  const handleToggleFeatured = async (id: number, currentFeatured: boolean) => {
    try {
      await adminApi.updatePublicationStatus(id, { is_featured: !currentFeatured });
      toast.success(currentFeatured ? 'Destacado removido' : 'Marcado como destacado');
      fetchPublications();
    } catch (error) {
      toast.error('Error al actualizar');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta publicación permanentemente?')) return;
    try {
      await adminApi.deletePublication(id);
      toast.success('Publicación eliminada');
      fetchPublications();
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  const statusColors: Record<string, string> = {
    borrador: 'gray',
    pendiente: 'yellow',
    activa: 'green',
    pausada: 'orange',
    finalizada: 'blue',
    rechazada: 'red',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Publicaciones</h1>
        <p className="text-gray-600">Administra todas las oportunidades publicadas</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input w-40">
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="activa">Activa</option>
            <option value="rechazada">Rechazada</option>
            <option value="pausada">Pausada</option>
          </select>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="input w-40">
            <option value="">Todos los tipos</option>
            {opportunityTypes.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Cargando...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Publicador</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {publications.map((pub) => (
                <tr key={pub.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      {pub.is_featured && <Star className="w-4 h-4 text-yellow-500 mr-2" />}
                      <span className="font-medium text-gray-900 truncate max-w-xs">{pub.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{pub.type_name}</td>
                  <td className="px-4 py-3">
                    <span className={clsx('badge', `bg-${statusColors[pub.status]}-100 text-${statusColors[pub.status]}-800`)}>
                      {pub.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{pub.publisher_name}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {format(new Date(pub.created_at), 'd MMM yyyy', { locale: es })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {pub.status === 'pendiente' && (
                        <>
                          <button onClick={() => handleApprove(pub.id)} className="p-1 text-green-600 hover:bg-green-50 rounded" title="Aprobar">
                            <Check className="w-5 h-5" />
                          </button>
                          <button onClick={() => setSelectedPub(pub)} className="p-1 text-red-600 hover:bg-red-50 rounded" title="Rechazar">
                            <X className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleToggleFeatured(pub.id, pub.is_featured)}
                        className={clsx('p-1 rounded', pub.is_featured ? 'text-yellow-600 hover:bg-yellow-50' : 'text-gray-400 hover:bg-gray-100')}
                        title={pub.is_featured ? 'Quitar destacado' : 'Destacar'}
                      >
                        {pub.is_featured ? <Star className="w-5 h-5" /> : <StarOff className="w-5 h-5" />}
                      </button>
                      <button onClick={() => handleDelete(pub.id)} className="p-1 text-red-600 hover:bg-red-50 rounded" title="Eliminar">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}

      {/* Reject Modal */}
      <Modal isOpen={!!selectedPub} onClose={() => setSelectedPub(null)} title="Rechazar Publicación">
        <div className="space-y-4">
          <p className="text-gray-600">¿Por qué rechazas esta publicación?</p>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="input h-24"
            placeholder="Indica la razón del rechazo..."
          />
          <div className="flex justify-end space-x-3">
            <button onClick={() => setSelectedPub(null)} className="btn-outline">Cancelar</button>
            <button onClick={handleReject} className="btn-danger">Rechazar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
