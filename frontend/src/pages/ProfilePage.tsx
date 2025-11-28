import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Camera, Upload, Save, User, Mail, Phone, Building, BookOpen, FileText, Linkedin, Check } from 'lucide-react';
import { userApi, catalogApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Faculty, School, Skill, Language, Interest } from '../types';
import toast from 'react-hot-toast';
import clsx from 'clsx';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [profileProgress, setProfileProgress] = useState(0);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  // Catalogs
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [allLanguages, setAllLanguages] = useState<Language[]>([]);
  const [allInterests, setAllInterests] = useState<Interest[]>([]);

  // User selections
  const [selectedSkills, setSelectedSkills] = useState<{ id: number; level: string }[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<{ id: number; level: string }[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<number[]>([]);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      phone: '',
      faculty_id: '',
      school_id: '',
      cycle: '',
      student_code: '',
      user_status: 'estudiante',
      bio: '',
      linkedin_url: '',
    }
  });

  const selectedFacultyId = watch('faculty_id');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, progressRes, facultiesRes, skillsRes, languagesRes, interestsRes] = await Promise.all([
          userApi.getProfile(),
          userApi.getProfileProgress(),
          catalogApi.getFaculties(),
          catalogApi.getSkills(),
          catalogApi.getLanguages(),
          catalogApi.getInterests(),
        ]);

        const profile = profileRes.data;

        // Set form values
        setValue('name', profile.name || '');
        setValue('phone', profile.phone || '');
        setValue('faculty_id', profile.faculty_id?.toString() || '');
        setValue('school_id', profile.school_id?.toString() || '');
        setValue('cycle', profile.cycle?.toString() || '');
        setValue('student_code', profile.student_code || '');
        setValue('user_status', profile.user_status || 'estudiante');
        setValue('bio', profile.bio || '');
        setValue('linkedin_url', profile.linkedin_url || '');

        // Set skills, languages, interests
        setSelectedSkills(profile.skills?.map((s: any) => ({ id: s.id, level: s.level })) || []);
        setSelectedLanguages(profile.languages?.map((l: any) => ({ id: l.id, level: l.level })) || []);
        setSelectedInterests(profile.interests?.map((i: any) => i.id) || []);

        // Set catalogs
        setFaculties(facultiesRes.data);
        setAllSkills(skillsRes.data);
        setAllLanguages(languagesRes.data);
        setAllInterests(interestsRes.data);

        // Set progress
        setProfileProgress(progressRes.data.progress);
        setMissingFields(progressRes.data.missing);

        // Load schools if faculty selected
        if (profile.faculty_id) {
          const schoolsRes = await catalogApi.getSchools(profile.faculty_id);
          setSchools(schoolsRes.data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Error al cargar el perfil');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [setValue]);

  useEffect(() => {
    const loadSchools = async () => {
      if (selectedFacultyId) {
        try {
          const response = await catalogApi.getSchools(parseInt(selectedFacultyId));
          setSchools(response.data);
        } catch (error) {
          console.error('Error loading schools:', error);
        }
      } else {
        setSchools([]);
      }
    };
    loadSchools();
  }, [selectedFacultyId]);

  const onSubmit = async (data: any) => {
    setIsSaving(true);
    try {
      await userApi.updateProfile({
        ...data,
        faculty_id: data.faculty_id ? parseInt(data.faculty_id) : null,
        school_id: data.school_id ? parseInt(data.school_id) : null,
        cycle: data.cycle ? parseInt(data.cycle) : null,
        skills: selectedSkills,
        languages: selectedLanguages,
        interests: selectedInterests,
      });

      // Refresh progress
      const progressRes = await userApi.getProfileProgress();
      setProfileProgress(progressRes.data.progress);
      setMissingFields(progressRes.data.missing);

      toast.success('Perfil actualizado exitosamente');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al actualizar perfil');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const response = await userApi.uploadPhoto(file);
      if (user) {
        updateUser({ ...user, profile_photo: response.data.photo_url });
      }
      toast.success('Foto actualizada');
    } catch (error) {
      toast.error('Error al subir la foto');
    }
  };

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Solo se permiten archivos PDF');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('El archivo no debe exceder 5MB');
      return;
    }

    try {
      const response = await userApi.uploadCV(file);
      if (user) {
        updateUser({ ...user, cv_url: response.data.cv_url });
      }
      toast.success('CV subido exitosamente');
    } catch (error) {
      toast.error('Error al subir el CV');
    }
  };

  const toggleSkill = (skillId: number) => {
    const existing = selectedSkills.find(s => s.id === skillId);
    if (existing) {
      setSelectedSkills(selectedSkills.filter(s => s.id !== skillId));
    } else {
      setSelectedSkills([...selectedSkills, { id: skillId, level: 'intermedio' }]);
    }
  };

  const toggleLanguage = (languageId: number) => {
    const existing = selectedLanguages.find(l => l.id === languageId);
    if (existing) {
      setSelectedLanguages(selectedLanguages.filter(l => l.id !== languageId));
    } else {
      setSelectedLanguages([...selectedLanguages, { id: languageId, level: 'intermedio' }]);
    }
  };

  const toggleInterest = (interestId: number) => {
    if (selectedInterests.includes(interestId)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interestId));
    } else {
      setSelectedInterests([...selectedInterests, interestId]);
    }
  };

  if (isLoading) {
    return (
      <div className="container-app py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-xl" />
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'personal', label: 'Datos Personales', icon: User },
    { id: 'academic', label: 'Datos Académicos', icon: BookOpen },
    { id: 'skills', label: 'Competencias', icon: FileText },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container-app">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Mi Perfil</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Photo & Progress */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="text-center">
                <div className="relative inline-block">
                  {user?.profile_photo ? (
                    <img
                      src={user.profile_photo}
                      alt={user.name}
                      className="w-24 h-24 rounded-full object-cover mx-auto"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center mx-auto">
                      <span className="text-3xl text-primary-800 font-bold">
                        {user?.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-50">
                    <Camera className="w-4 h-4 text-gray-600" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <h2 className="mt-4 font-semibold text-gray-900">{user?.name}</h2>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>

              {/* Progress */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Perfil completo</span>
                  <span className="text-sm font-bold text-primary-800">{profileProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-800 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${profileProgress}%` }}
                  />
                </div>
                {missingFields.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    Falta: {missingFields.slice(0, 3).join(', ')}
                    {missingFields.length > 3 && ` y ${missingFields.length - 3} más`}
                  </p>
                )}
              </div>

              {/* CV Upload */}
              <div className="mt-6 pt-6 border-t">
                <label className="label">Curriculum Vitae</label>
                {user?.cv_url ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-green-700 flex items-center">
                      <Check className="w-4 h-4 mr-2" />
                      CV cargado
                    </span>
                    <a
                      href={user.cv_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-700 hover:underline"
                    >
                      Ver
                    </a>
                  </div>
                ) : (
                  <label className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500">
                    <Upload className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Subir CV (PDF, máx 5MB)</span>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleCVUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              {/* Tabs */}
              <div className="border-b">
                <div className="flex space-x-4 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={clsx(
                        'flex items-center py-4 border-b-2 transition-colors',
                        activeTab === tab.id
                          ? 'border-primary-800 text-primary-800'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      )}
                    >
                      <tab.icon className="w-4 h-4 mr-2" />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                {/* Personal Tab */}
                {activeTab === 'personal' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="label">Nombre completo</label>
                        <input
                          {...register('name', { required: true })}
                          className="input"
                        />
                      </div>
                      <div>
                        <label className="label">Teléfono</label>
                        <input
                          {...register('phone')}
                          className="input"
                          placeholder="+51 999 999 999"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="label">Biografía</label>
                      <textarea
                        {...register('bio')}
                        className="input h-24"
                        placeholder="Cuéntanos sobre ti..."
                      />
                    </div>

                    <div>
                      <label className="label">LinkedIn</label>
                      <input
                        {...register('linkedin_url')}
                        className="input"
                        placeholder="https://linkedin.com/in/tu-perfil"
                      />
                    </div>
                  </div>
                )}

                {/* Academic Tab */}
                {activeTab === 'academic' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="label">Facultad</label>
                        <select {...register('faculty_id')} className="input">
                          <option value="">Seleccionar facultad</option>
                          {faculties.map((f) => (
                            <option key={f.id} value={f.id}>{f.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="label">Escuela</label>
                        <select {...register('school_id')} className="input" disabled={!selectedFacultyId}>
                          <option value="">Seleccionar escuela</option>
                          {schools.map((s) => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="label">Ciclo actual</label>
                        <select {...register('cycle')} className="input">
                          <option value="">Seleccionar</option>
                          {[...Array(10)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}° ciclo</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="label">Código de estudiante</label>
                        <input
                          {...register('student_code')}
                          className="input"
                          placeholder="20220000X"
                        />
                      </div>
                      <div>
                        <label className="label">Estado</label>
                        <select {...register('user_status')} className="input">
                          <option value="estudiante">Estudiante</option>
                          <option value="egresado">Egresado</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Skills Tab */}
                {activeTab === 'skills' && (
                  <div className="space-y-6">
                    {/* Skills */}
                    <div>
                      <label className="label mb-3">Habilidades</label>
                      <div className="flex flex-wrap gap-2">
                        {allSkills.map((skill) => (
                          <button
                            key={skill.id}
                            type="button"
                            onClick={() => toggleSkill(skill.id)}
                            className={clsx(
                              'px-3 py-1.5 rounded-full text-sm transition-colors',
                              selectedSkills.some(s => s.id === skill.id)
                                ? 'bg-primary-100 text-primary-800 border-2 border-primary-300'
                                : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                            )}
                          >
                            {skill.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Languages */}
                    <div>
                      <label className="label mb-3">Idiomas</label>
                      <div className="flex flex-wrap gap-2">
                        {allLanguages.map((lang) => (
                          <button
                            key={lang.id}
                            type="button"
                            onClick={() => toggleLanguage(lang.id)}
                            className={clsx(
                              'px-3 py-1.5 rounded-full text-sm transition-colors',
                              selectedLanguages.some(l => l.id === lang.id)
                                ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                                : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                            )}
                          >
                            {lang.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Interests */}
                    <div>
                      <label className="label mb-3">Áreas de interés</label>
                      <div className="flex flex-wrap gap-2">
                        {allInterests.map((interest) => (
                          <button
                            key={interest.id}
                            type="button"
                            onClick={() => toggleInterest(interest.id)}
                            className={clsx(
                              'px-3 py-1.5 rounded-full text-sm transition-colors',
                              selectedInterests.includes(interest.id)
                                ? 'bg-green-100 text-green-800 border-2 border-green-300'
                                : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                            )}
                          >
                            {interest.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="mt-6 pt-6 border-t flex justify-end">
                  <button type="submit" disabled={isSaving} className="btn-primary">
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
