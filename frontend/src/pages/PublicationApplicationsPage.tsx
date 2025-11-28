import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Download, Search, Filter, User, Mail, Phone, FileText, ExternalLink, Check, X, Clock } from 'lucide-react';
import { publicationApi, applicationApi } from '../services/api';
import { Application } from '../types';
import Pagination from '../components/common/Pagination';
import Modal from '../components/common/Modal';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const statusConfig: Record<string, { label: string; color: string; nextStates: string[] }> = {
  pendiente: { label: 'Pendiente', color: 'yellow', nextStates: ['en_revision', 'rechazado'] },
  en_revision: { label: 'En revisión', color: 'blue', nextStates: ['preseleccionado', 'rechazado'] },
  preseleccionado: { label: 'Preseleccionado', color: 'purple', nextStates: ['aceptado', 'rechazado'] },
  aceptado: { label: 'Aceptado', color: 'green', nextStates: [] },
  rechazado: { label: 'Rechazado', color: 'red', nextStates: [] },
};

export default function PublicationApplicationsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState<{ id: number; title: string } | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  useEffect(() => {
    fetchApplications();
  }, [id, selectedStatus, searchQuery, currentPage]);

  const fetchApplications = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const response = await publicationApi.getApplications(parseInt(id), {
        page: currentPage,
        limit: 20,
        status: selectedStatus || undefined,
      });
      setOpportunity(response.data.opportunity);
      setApplications(response.data.applications);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar postulaciones');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (appId: number, newStatus: string, notes?: string) => {
    try {
      await applicationApi.updateStatus(appId, { status: newStatus, publisher_notes: notes });
      toast.success('Estado actualizado');
      fetchApplications();
      setSelectedApplication(null);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al actualizar');
    }
  };

  const handleExport = async () => {
    try {
      const response = await applicationApi.export(parseInt(id!));
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `postulaciones_${id}.csv`;
      link.click();
      toast.success('Archivo descargado');
    } catch (error) {
      toast.error('Error al exportar');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container-app">
        <button onClick={() => navigate('/my-publications')} className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a mis publicaciones
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Postulaciones</h1>
            {opportunity && (
              <p className="text-gray-600 mt-1">{opportunity.title}</p>
            )}
          </div>
          <button onClick={handleExport} className="btn-outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input w-48"
            >
              <option value="">Todos los estados</option>
              {Object.entries(statusConfig).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Applications List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-sm text-center">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Sin postulaciones
            </h3>
            <p className="text-gray-600">
              Aún no hay postulaciones para esta oportunidad
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Postulante</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contacto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Facultad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {applications.map((app) => {
                  const status = statusConfig[app.status];
                  return (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {app.profile_photo ? (
                            <img src={app.profile_photo} alt="" className="w-10 h-10 rounded-full mr-3" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                              <span className="text-primary-800 font-medium">
                                {app.name?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{app.name}</p>
                            <p className="text-sm text-gray-500">{app.student_code}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">{app.email}</p>
                        {app.phone && <p className="text-sm text-gray-500">{app.phone}</p>}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">{app.faculty_name || '-'}</p>
                        <p className="text-sm text-gray-500">{app.school_name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={clsx('badge', `bg-${status.color}-100 text-${status.color}-800`)}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {format(new Date(app.created_at), 'd MMM yyyy', { locale: es })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedApplication(app)}
                          className="text-primary-700 hover:text-primary-800 text-sm font-medium"
                        >
                          Ver detalle
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        )}

        {/* Application Detail Modal */}
        <Modal
          isOpen={!!selectedApplication}
          onClose={() => setSelectedApplication(null)}
          title="Detalle de Postulación"
          size="lg"
        >
          {selectedApplication && (
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                {selectedApplication.profile_photo ? (
                  <img src={selectedApplication.profile_photo} alt="" className="w-16 h-16 rounded-full" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-2xl text-primary-800 font-medium">
                      {selectedApplication.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold">{selectedApplication.name}</h3>
                  <p className="text-gray-600">{selectedApplication.email}</p>
                  {selectedApplication.phone && (
                    <p className="text-gray-500">{selectedApplication.phone}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Facultad:</span>
                  <p className="font-medium">{selectedApplication.faculty_name || '-'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Escuela:</span>
                  <p className="font-medium">{selectedApplication.school_name || '-'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Ciclo:</span>
                  <p className="font-medium">{selectedApplication.cycle || '-'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Código:</span>
                  <p className="font-medium">{selectedApplication.student_code || '-'}</p>
                </div>
              </div>

              {selectedApplication.cv_url && (
                <a
                  href={selectedApplication.cv_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-primary-700 hover:text-primary-800"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Ver CV
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              )}

              {selectedApplication.cover_letter && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Carta de presentación:</h4>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{selectedApplication.cover_letter}</p>
                </div>
              )}

              {/* Status Change Buttons */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Cambiar estado:</h4>
                <div className="flex flex-wrap gap-2">
                  {statusConfig[selectedApplication.status]?.nextStates.map(nextStatus => (
                    <button
                      key={nextStatus}
                      onClick={() => handleStatusChange(selectedApplication.id, nextStatus)}
                      className={clsx(
                        'btn text-sm',
                        nextStatus === 'rechazado' ? 'btn-danger' : 'btn-primary'
                      )}
                    >
                      {statusConfig[nextStatus].label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
