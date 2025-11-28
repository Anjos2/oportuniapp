import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Users, Flag, Building2, TrendingUp, Eye } from 'lucide-react';
import { adminApi } from '../../services/api';
import { DashboardStats } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import toast from 'react-hot-toast';

const COLORS = ['#8B1538', '#0ea5e9', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6'];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminApi.getDashboard();
        setStats(response.data);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Error al cargar estadísticas');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 h-24" />
          ))}
        </div>
        <div className="bg-white rounded-xl h-80" />
      </div>
    );
  }

  if (!stats) return null;

  const kpiCards = [
    { label: 'Oportunidades Activas', value: stats.kpis.active_opportunities, icon: FileText, color: 'primary' },
    { label: 'Postulaciones (30 días)', value: stats.kpis.monthly_applications, icon: TrendingUp, color: 'green' },
    { label: 'Reportes Pendientes', value: stats.kpis.pending_reports, icon: Flag, color: 'red', link: '/admin/reports' },
    { label: 'Cuentas Pendientes', value: stats.kpis.pending_accounts, icon: Building2, color: 'yellow', link: '/admin/external-accounts' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Panel de administración de OportUNI</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{kpi.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-${kpi.color}-100`}>
                <kpi.icon className={`w-6 h-6 text-${kpi.color}-700`} />
              </div>
            </div>
            {kpi.link && kpi.value > 0 && (
              <Link to={kpi.link} className="text-sm text-primary-700 hover:underline mt-2 block">
                Ver pendientes →
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Type */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Oportunidades por Tipo</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats.charts.byType}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {stats.charts.byType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Postulaciones Mensuales</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats.charts.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="applications" stroke="#8B1538" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* By Faculty */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Postulaciones por Facultad (30 días)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.charts.byFaculty} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="code" type="category" width={60} />
            <Tooltip />
            <Bar dataKey="count" fill="#8B1538" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Opportunities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-900">Oportunidades Recientes</h3>
          </div>
          <div className="divide-y">
            {stats.recentOpportunities.map((opp) => (
              <div key={opp.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 truncate max-w-xs">{opp.title}</p>
                  <p className="text-sm text-gray-500">{opp.type_name}</p>
                </div>
                <span className={`badge bg-${opp.status === 'activa' ? 'green' : 'yellow'}-100 text-${opp.status === 'activa' ? 'green' : 'yellow'}-800`}>
                  {opp.status}
                </span>
              </div>
            ))}
          </div>
          <div className="p-4 border-t">
            <Link to="/admin/publications" className="text-primary-700 text-sm hover:underline">
              Ver todas →
            </Link>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-900">Reportes Recientes</h3>
          </div>
          <div className="divide-y">
            {stats.recentReports.length === 0 ? (
              <div className="p-4 text-gray-500 text-center">No hay reportes recientes</div>
            ) : (
              stats.recentReports.map((report) => (
                <div key={report.id} className="p-4">
                  <p className="font-medium text-gray-900 truncate">{report.opportunity_title}</p>
                  <p className="text-sm text-gray-500">Razón: {report.reason}</p>
                </div>
              ))
            )}
          </div>
          <div className="p-4 border-t">
            <Link to="/admin/reports" className="text-primary-700 text-sm hover:underline">
              Ver todos →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
