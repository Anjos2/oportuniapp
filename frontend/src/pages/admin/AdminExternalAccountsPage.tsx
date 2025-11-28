import { useState, useEffect } from 'react';
import { Building2, Plus, Check, X, Eye } from 'lucide-react';
import { adminApi } from '../../services/api';
import { ExternalAccount } from '../../types';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const entityTypeLabels: Record<string, string> = {
  empresa: 'Empresa',
  ong: 'ONG',
  institucion_educativa: 'Institución Educativa',
  gobierno: 'Gobierno',
  otro: 'Otro',
};

const statusColors: Record<string, string> = {
  pendiente: 'yellow',
  aprobada: 'green',
  rechazada: 'red',
  suspendida: 'gray',
};

export default function AdminExternalAccountsPage() {
  const [accounts, setAccounts] = useState<ExternalAccount[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState<ExternalAccount | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Create form
  const [createForm, setCreateForm] = useState({
    organization_name: '',
    ruc: '',
    representative_name: '',
    email: '',
    phone: '',
    entity_type: 'empresa',
    description: '',
    website: '',
  });

  useEffect(() => {
    fetchAccounts();
  }, [statusFilter, currentPage]);

  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      const response = await adminApi.getExternalAccounts({
        page: currentPage,
        limit: 20,
        status: statusFilter || undefined,
      });
      setAccounts(response.data.accounts);
      setStats(response.data.stats);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error('Error al cargar cuentas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await adminApi.updateExternalAccountStatus(id, { status: 'aprobada' });
      toast.success('Cuenta aprobada');
      fetchAccounts();
    } catch (error) {
      toast.error('Error al aprobar');
    }
  };

  const handleReject = async () => {
    if (!selectedAccount) return;
    try {
      await adminApi.updateExternalAccountStatus(selectedAccount.id, {
        status: 'rechazada',
        rejection_reason: rejectionReason,
      });
      toast.success('Cuenta rechazada');
      setSelectedAccount(null);
      setRejectionReason('');
      fetchAccounts();
    } catch (error) {
      toast.error('Error al rechazar');
    }
  };

  const handleCreate = async () => {
    try {
      await adminApi.createExternalAccount(createForm);
      toast.success('Cuenta creada exitosamente');
      setShowCreateModal(false);
      setCreateForm({
        organization_name: '',
        ruc: '',
        representative_name: '',
        email: '',
        phone: '',
        entity_type: 'empresa',
        description: '',
        website: '',
      });
      fetchAccounts();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al crear cuenta');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cuentas Externas</h1>
          <p className="text-gray-600">Gestiona las solicitudes de organizaciones externas</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Nueva cuenta
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-yellow-600">{stats.pendiente || 0}</div>
          <div className="text-sm text-gray-500">Pendientes</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-green-600">{stats.aprobada || 0}</div>
          <div className="text-sm text-gray-500">Aprobadas</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-red-600">{stats.rechazada || 0}</div>
          <div className="text-sm text-gray-500">Rechazadas</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-gray-600">{stats.suspendida || 0}</div>
          <div className="text-sm text-gray-500">Suspendidas</div>
        </div>
      </div>

      {/* Filter */}
      <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input w-48">
        <option value="">Todos los estados</option>
        <option value="pendiente">Pendientes</option>
        <option value="aprobada">Aprobadas</option>
        <option value="rechazada">Rechazadas</option>
        <option value="suspendida">Suspendidas</option>
      </select>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Cargando...</div>
        ) : accounts.length === 0 ? (
          <div className="p-8 text-center">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No hay cuentas</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Organización</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Representante</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {accounts.map((account) => (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{account.organization_name}</p>
                      <p className="text-sm text-gray-500">{account.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {entityTypeLabels[account.entity_type]}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {account.representative_name}
                  </td>
                  <td className="px-4 py-3">
                    <span className={clsx('badge', `bg-${statusColors[account.status]}-100 text-${statusColors[account.status]}-800`)}>
                      {account.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {format(new Date(account.created_at), 'd MMM yyyy', { locale: es })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {account.status === 'pendiente' && (
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => handleApprove(account.id)} className="p-1 text-green-600 hover:bg-green-50 rounded">
                          <Check className="w-5 h-5" />
                        </button>
                        <button onClick={() => setSelectedAccount(account)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    )}
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
      <Modal isOpen={!!selectedAccount} onClose={() => setSelectedAccount(null)} title="Rechazar Cuenta">
        <div className="space-y-4">
          <p className="text-gray-600">¿Por qué rechazas esta solicitud?</p>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="input h-24"
            placeholder="Indica la razón del rechazo..."
          />
          <div className="flex justify-end space-x-3">
            <button onClick={() => setSelectedAccount(null)} className="btn-outline">Cancelar</button>
            <button onClick={handleReject} className="btn-danger">Rechazar</button>
          </div>
        </div>
      </Modal>

      {/* Create Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Crear Cuenta Externa" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Nombre de organización *</label>
              <input
                value={createForm.organization_name}
                onChange={(e) => setCreateForm({ ...createForm, organization_name: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="label">RUC</label>
              <input
                value={createForm.ruc}
                onChange={(e) => setCreateForm({ ...createForm, ruc: e.target.value })}
                className="input"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Representante *</label>
              <input
                value={createForm.representative_name}
                onChange={(e) => setCreateForm({ ...createForm, representative_name: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="label">Tipo de entidad *</label>
              <select
                value={createForm.entity_type}
                onChange={(e) => setCreateForm({ ...createForm, entity_type: e.target.value })}
                className="input"
              >
                {Object.entries(entityTypeLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Email *</label>
              <input
                type="email"
                value={createForm.email}
                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="label">Teléfono</label>
              <input
                value={createForm.phone}
                onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                className="input"
              />
            </div>
          </div>
          <div>
            <label className="label">Sitio web</label>
            <input
              value={createForm.website}
              onChange={(e) => setCreateForm({ ...createForm, website: e.target.value })}
              className="input"
              placeholder="https://"
            />
          </div>
          <div>
            <label className="label">Descripción</label>
            <textarea
              value={createForm.description}
              onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
              className="input h-24"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button onClick={() => setShowCreateModal(false)} className="btn-outline">Cancelar</button>
            <button onClick={handleCreate} className="btn-primary">Crear cuenta</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
