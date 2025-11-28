import { useState, useEffect } from 'react';
import { Flag, Check, X, AlertTriangle } from 'lucide-react';
import { reportApi } from '../../services/api';
import { Report } from '../../types';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const reasonLabels: Record<string, string> = {
  contenido_inapropiado: 'Contenido inapropiado',
  informacion_falsa: 'Información falsa',
  spam: 'Spam',
  discriminacion: 'Discriminación',
  otro: 'Otro',
};

const statusColors: Record<string, string> = {
  pendiente: 'yellow',
  revisado: 'blue',
  accion_tomada: 'green',
  descartado: 'gray',
};

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetchReports();
  }, [statusFilter, currentPage]);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const response = await reportApi.getAll({
        page: currentPage,
        limit: 20,
        status: statusFilter || undefined,
      });
      setReports(response.data.reports);
      setStats(response.data.stats);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error('Error al cargar reportes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (status: string, action?: string) => {
    if (!selectedReport) return;
    try {
      await reportApi.updateStatus(selectedReport.id, {
        status,
        admin_notes: adminNotes,
        action,
      });
      toast.success('Reporte actualizado');
      setSelectedReport(null);
      setAdminNotes('');
      fetchReports();
    } catch (error) {
      toast.error('Error al actualizar');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Reportes</h1>
        <p className="text-gray-600">Revisa y gestiona los reportes de usuarios</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-gray-900">{stats.total || 0}</div>
          <div className="text-sm text-gray-500">Total</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-yellow-600">{stats.pendiente || 0}</div>
          <div className="text-sm text-gray-500">Pendientes</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-green-600">{stats.accion_tomada || 0}</div>
          <div className="text-sm text-gray-500">Acción tomada</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-gray-600">{stats.descartado || 0}</div>
          <div className="text-sm text-gray-500">Descartados</div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-4">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input w-48">
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendientes</option>
          <option value="revisado">Revisados</option>
          <option value="accion_tomada">Acción tomada</option>
          <option value="descartado">Descartados</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Cargando...</div>
        ) : reports.length === 0 ? (
          <div className="p-8 text-center">
            <Flag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No hay reportes</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Oportunidad</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Razón</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reportado por</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-900 truncate block max-w-xs">
                      {report.opportunity_title}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {reasonLabels[report.reason]}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {report.reporter_name}
                  </td>
                  <td className="px-4 py-3">
                    <span className={clsx('badge', `bg-${statusColors[report.status]}-100 text-${statusColors[report.status]}-800`)}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {format(new Date(report.created_at), 'd MMM yyyy', { locale: es })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="text-primary-700 hover:text-primary-800 text-sm font-medium"
                    >
                      Revisar
                    </button>
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

      {/* Review Modal */}
      <Modal
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        title="Revisar Reporte"
        size="lg"
      >
        {selectedReport && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">{selectedReport.opportunity_title}</h4>
              <p className="text-sm text-gray-600">
                <strong>Razón:</strong> {reasonLabels[selectedReport.reason]}
              </p>
              {selectedReport.comment && (
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Comentario:</strong> {selectedReport.comment}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                Reportado por: {selectedReport.reporter_name} ({selectedReport.reporter_email})
              </p>
            </div>

            <div>
              <label className="label">Notas del administrador</label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="input h-24"
                placeholder="Agregar notas..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button onClick={() => handleUpdateStatus('descartado')} className="btn-outline">
                Descartar
              </button>
              <button onClick={() => handleUpdateStatus('revisado')} className="btn-outline">
                Marcar revisado
              </button>
              <button onClick={() => handleUpdateStatus('accion_tomada', 'suspend')} className="btn-danger">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Suspender publicación
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
