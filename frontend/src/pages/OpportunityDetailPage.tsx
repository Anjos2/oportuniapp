import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Calendar, Clock, Users, ExternalLink, Bookmark, BookmarkCheck,
  Share2, Flag, FileText, ChevronLeft, Building, CheckCircle, AlertCircle
} from 'lucide-react';
import { opportunityApi, applicationApi, reportApi } from '../services/api';
import OpportunityCard from '../components/opportunities/OpportunityCard';
import Modal from '../components/common/Modal';
import { Opportunity } from '../types';
import { useAuth } from '../context/AuthContext';
import { format, isPast } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const modalityLabels: Record<string, string> = {
  presencial: 'Presencial',
  virtual: 'Virtual',
  hibrido: 'Híbrido',
};

export default function OpportunityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [similarOpportunities, setSimilarOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [reportReason, setReportReason] = useState('');
  const [reportComment, setReportComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const [oppResponse, similarResponse] = await Promise.all([
          opportunityApi.getById(parseInt(id)),
          opportunityApi.getSimilar(parseInt(id), 4),
        ]);

        setOpportunity(oppResponse.data);
        setSimilarOpportunities(similarResponse.data);
      } catch (error) {
        console.error('Error fetching opportunity:', error);
        toast.error('Error al cargar la oportunidad');
        navigate('/opportunities');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para guardar oportunidades');
      return;
    }

    try {
      if (opportunity?.is_saved) {
        await opportunityApi.unsave(opportunity.id);
        setOpportunity({ ...opportunity, is_saved: false });
        toast.success('Oportunidad removida de guardados');
      } else if (opportunity) {
        await opportunityApi.save(opportunity.id);
        setOpportunity({ ...opportunity, is_saved: true });
        toast.success('Oportunidad guardada');
      }
    } catch (error) {
      toast.error('Error al guardar');
    }
  };

  const handleApply = async () => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para postular');
      return;
    }

    setIsSubmitting(true);
    try {
      await applicationApi.create(parseInt(id!), { cover_letter: coverLetter });
      setOpportunity(prev => prev ? { ...prev, has_applied: true, application_status: 'pendiente' } : null);
      setShowApplyModal(false);
      setCoverLetter('');
      toast.success('Postulación enviada exitosamente');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al postular');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReport = async () => {
    if (!reportReason) {
      toast.error('Selecciona una razón para el reporte');
      return;
    }

    setIsSubmitting(true);
    try {
      await reportApi.create({
        opportunity_id: parseInt(id!),
        reason: reportReason,
        comment: reportComment,
      });
      setShowReportModal(false);
      setReportReason('');
      setReportComment('');
      toast.success('Reporte enviado');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al enviar reporte');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: opportunity?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Enlace copiado');
    }
  };

  if (isLoading) {
    return (
      <div className="container-app py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
          <div className="h-64 bg-gray-200 rounded-xl mb-6" />
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="container-app py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Oportunidad no encontrada</h2>
        <Link to="/opportunities" className="btn-primary">
          Ver todas las oportunidades
        </Link>
      </div>
    );
  }

  const deadlinePassed = opportunity.application_deadline
    ? isPast(new Date(opportunity.application_deadline))
    : false;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-app py-8">
        {/* Back link */}
        <Link to="/opportunities" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Volver a oportunidades
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative h-48 bg-gradient-to-br from-primary-800 to-primary-600">
                {opportunity.image_url && (
                  <img
                    src={opportunity.image_url}
                    alt={opportunity.title}
                    className="w-full h-full object-cover"
                  />
                )}
                {opportunity.is_featured && (
                  <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 text-sm font-medium px-3 py-1 rounded-full">
                    Destacada
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className={clsx('badge mb-2', `bg-${opportunity.type_color}-100 text-${opportunity.type_color}-800`)}>
                      {opportunity.type_name}
                    </span>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {opportunity.title}
                    </h1>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={handleSave} className="p-2 hover:bg-gray-100 rounded-lg">
                      {opportunity.is_saved ? (
                        <BookmarkCheck className="w-5 h-5 text-primary-800" />
                      ) : (
                        <Bookmark className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                    <button onClick={handleShare} className="p-2 hover:bg-gray-100 rounded-lg">
                      <Share2 className="w-5 h-5 text-gray-500" />
                    </button>
                    {isAuthenticated && (
                      <button onClick={() => setShowReportModal(true)} className="p-2 hover:bg-gray-100 rounded-lg">
                        <Flag className="w-5 h-5 text-gray-500" />
                      </button>
                    )}
                  </div>
                </div>

                {opportunity.organization_name && (
                  <div className="flex items-center text-gray-600 mb-4">
                    <Building className="w-5 h-5 mr-2" />
                    {opportunity.organization_name}
                  </div>
                )}

                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {opportunity.location && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {opportunity.location}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {modalityLabels[opportunity.modality]}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {opportunity.applications_count} postulantes
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Descripción</h2>
              <div className="prose prose-gray max-w-none">
                <p className="whitespace-pre-wrap">{opportunity.description}</p>
              </div>
            </div>

            {/* Requirements */}
            {opportunity.requirements && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Requisitos</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="whitespace-pre-wrap">{opportunity.requirements}</p>
                </div>
              </div>
            )}

            {/* Benefits */}
            {opportunity.benefits && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Beneficios</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="whitespace-pre-wrap">{opportunity.benefits}</p>
                </div>
              </div>
            )}

            {/* Documents Required */}
            {opportunity.documents_required && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Documentos Requeridos</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="whitespace-pre-wrap">{opportunity.documents_required}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              {/* Dates */}
              <div className="space-y-3 mb-6">
                {opportunity.application_deadline && (
                  <div className={clsx('flex items-center', deadlinePassed && 'text-red-600')}>
                    <Calendar className="w-5 h-5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Fecha límite</p>
                      <p className="font-medium">
                        {format(new Date(opportunity.application_deadline), "d 'de' MMMM, yyyy", { locale: es })}
                      </p>
                    </div>
                  </div>
                )}

                {opportunity.start_date && (
                  <div className="flex items-center text-gray-700">
                    <Calendar className="w-5 h-5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Fecha de inicio</p>
                      <p className="font-medium">
                        {format(new Date(opportunity.start_date), "d 'de' MMMM, yyyy", { locale: es })}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Status / Actions */}
              {opportunity.has_applied ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center text-green-800">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span className="font-medium">Ya postulaste</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">
                    Estado: {opportunity.application_status}
                  </p>
                  <Link to="/my-applications" className="text-sm text-green-700 underline mt-2 inline-block">
                    Ver mis postulaciones
                  </Link>
                </div>
              ) : deadlinePassed ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center text-red-800">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <span className="font-medium">Postulaciones cerradas</span>
                  </div>
                </div>
              ) : opportunity.external_url ? (
                <a
                  href={opportunity.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full flex items-center justify-center"
                >
                  Postular externamente
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              ) : (
                <button
                  onClick={() => setShowApplyModal(true)}
                  className="btn-primary w-full"
                >
                  Postular ahora
                </button>
              )}

              {/* Attachment */}
              {opportunity.attachment_url && (
                <a
                  href={opportunity.attachment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center text-primary-700 hover:text-primary-800"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Ver documento adjunto
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Similar Opportunities */}
        {similarOpportunities.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Oportunidades similares</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarOpportunities.map((opp) => (
                <OpportunityCard key={opp.id} opportunity={opp} showActions={false} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Apply Modal */}
      <Modal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        title="Postular a esta oportunidad"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Estás por postular a: <strong>{opportunity.title}</strong>
          </p>

          <div>
            <label className="label">Carta de presentación (opcional)</label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="input h-32"
              placeholder="Cuéntanos por qué eres el candidato ideal..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowApplyModal(false)}
              className="btn-outline"
            >
              Cancelar
            </button>
            <button
              onClick={handleApply}
              disabled={isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar postulación'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Report Modal */}
      <Modal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        title="Reportar publicación"
      >
        <div className="space-y-4">
          <div>
            <label className="label">Razón del reporte</label>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="input"
            >
              <option value="">Selecciona una razón</option>
              <option value="contenido_inapropiado">Contenido inapropiado</option>
              <option value="informacion_falsa">Información falsa</option>
              <option value="spam">Spam</option>
              <option value="discriminacion">Discriminación</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div>
            <label className="label">Comentario adicional (opcional)</label>
            <textarea
              value={reportComment}
              onChange={(e) => setReportComment(e.target.value)}
              className="input h-24"
              placeholder="Describe el problema..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button onClick={() => setShowReportModal(false)} className="btn-outline">
              Cancelar
            </button>
            <button onClick={handleReport} disabled={isSubmitting} className="btn-danger">
              {isSubmitting ? 'Enviando...' : 'Enviar reporte'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
