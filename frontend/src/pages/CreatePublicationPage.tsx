import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Upload, Save, Send } from 'lucide-react';
import { opportunityApi, catalogApi } from '../services/api';
import { OpportunityType, Faculty, School } from '../types';
import toast from 'react-hot-toast';

export default function CreatePublicationPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [opportunityTypes, setOpportunityTypes] = useState<OpportunityType[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [attachment, setAttachment] = useState<File | null>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      type_id: '',
      title: '',
      description: '',
      requirements: '',
      documents_required: '',
      benefits: '',
      start_date: '',
      end_date: '',
      application_deadline: '',
      modality: 'presencial',
      location: '',
      organization_name: '',
      external_url: '',
      visibility: 'publico',
      target_faculty_id: '',
      target_school_id: '',
    }
  });

  const selectedFacultyId = watch('target_faculty_id');
  const visibility = watch('visibility');

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const [typesRes, facultiesRes] = await Promise.all([
          catalogApi.getOpportunityTypes(),
          catalogApi.getFaculties(),
        ]);
        setOpportunityTypes(typesRes.data);
        setFaculties(facultiesRes.data);
      } catch (error) {
        console.error('Error fetching catalogs:', error);
      }
    };
    fetchCatalogs();
  }, []);

  useEffect(() => {
    const loadSchools = async () => {
      if (selectedFacultyId) {
        try {
          const response = await catalogApi.getSchools(parseInt(selectedFacultyId));
          setSchools(response.data);
        } catch (error) {
          console.error('Error loading schools:', error);
        }
      }
    };
    loadSchools();
  }, [selectedFacultyId]);

  const onSubmit = async (data: any, status: 'borrador' | 'pendiente') => {
    setIsSubmitting(true);
    try {
      const formData = {
        ...data,
        type_id: parseInt(data.type_id),
        target_faculty_id: data.target_faculty_id ? parseInt(data.target_faculty_id) : null,
        target_school_id: data.target_school_id ? parseInt(data.target_school_id) : null,
        status,
      };

      await opportunityApi.create(formData, attachment || undefined);
      toast.success(status === 'borrador' ? 'Borrador guardado' : 'Publicación enviada para revisión');
      navigate('/my-publications');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al crear publicación');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container-app max-w-4xl">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Nueva Publicación</h1>

          <form className="space-y-6">
            {/* Tipo y Título */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Tipo de oportunidad *</label>
                <select {...register('type_id', { required: true })} className="input">
                  <option value="">Seleccionar tipo</option>
                  {opportunityTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
                {errors.type_id && <p className="text-sm text-red-600 mt-1">Requerido</p>}
              </div>
              <div>
                <label className="label">Organización</label>
                <input {...register('organization_name')} className="input" placeholder="Nombre de la empresa/institución" />
              </div>
            </div>

            <div>
              <label className="label">Título *</label>
              <input {...register('title', { required: true, minLength: 5 })} className="input" placeholder="Ej: Beca de investigación en IA" />
              {errors.title && <p className="text-sm text-red-600 mt-1">Mínimo 5 caracteres</p>}
            </div>

            <div>
              <label className="label">Descripción *</label>
              <textarea {...register('description', { required: true, minLength: 20 })} className="input h-32" placeholder="Describe la oportunidad en detalle..." />
              {errors.description && <p className="text-sm text-red-600 mt-1">Mínimo 20 caracteres</p>}
            </div>

            <div>
              <label className="label">Requisitos</label>
              <textarea {...register('requirements')} className="input h-24" placeholder="Lista los requisitos para postular..." />
            </div>

            <div>
              <label className="label">Beneficios</label>
              <textarea {...register('benefits')} className="input h-24" placeholder="Describe los beneficios..." />
            </div>

            <div>
              <label className="label">Documentos requeridos</label>
              <textarea {...register('documents_required')} className="input h-20" placeholder="CV, carta de motivación, etc." />
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="label">Fecha de inicio</label>
                <input type="date" {...register('start_date')} className="input" />
              </div>
              <div>
                <label className="label">Fecha de fin</label>
                <input type="date" {...register('end_date')} className="input" />
              </div>
              <div>
                <label className="label">Fecha límite postulación</label>
                <input type="date" {...register('application_deadline')} className="input" />
              </div>
            </div>

            {/* Modalidad y Ubicación */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Modalidad *</label>
                <select {...register('modality')} className="input">
                  <option value="presencial">Presencial</option>
                  <option value="virtual">Virtual</option>
                  <option value="hibrido">Híbrido</option>
                </select>
              </div>
              <div>
                <label className="label">Ubicación</label>
                <input {...register('location')} className="input" placeholder="Lima, Perú" />
              </div>
            </div>

            {/* URL externa */}
            <div>
              <label className="label">URL de postulación externa</label>
              <input {...register('external_url')} type="url" className="input" placeholder="https://..." />
              <p className="text-sm text-gray-500 mt-1">Si la postulación se realiza en otro sitio</p>
            </div>

            {/* Visibilidad */}
            <div>
              <label className="label">Visibilidad</label>
              <select {...register('visibility')} className="input">
                <option value="publico">Público (todos los estudiantes)</option>
                <option value="facultad">Solo una facultad</option>
                <option value="escuela">Solo una escuela</option>
              </select>
            </div>

            {visibility !== 'publico' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Facultad</label>
                  <select {...register('target_faculty_id')} className="input">
                    <option value="">Seleccionar</option>
                    {faculties.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
                {visibility === 'escuela' && (
                  <div>
                    <label className="label">Escuela</label>
                    <select {...register('target_school_id')} className="input" disabled={!selectedFacultyId}>
                      <option value="">Seleccionar</option>
                      {schools.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Archivo adjunto */}
            <div>
              <label className="label">Documento adjunto</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
                <p className="text-sm text-gray-500 mt-2">PDF, DOC, DOCX - Máximo 10MB</p>
              </div>
            </div>

            {/* Botones */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={handleSubmit((data) => onSubmit(data, 'borrador'))}
                disabled={isSubmitting}
                className="btn-outline"
              >
                <Save className="w-4 h-4 mr-2" />
                Guardar borrador
              </button>
              <button
                type="button"
                onClick={handleSubmit((data) => onSubmit(data, 'pendiente'))}
                disabled={isSubmitting}
                className="btn-primary"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Enviando...' : 'Publicar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
