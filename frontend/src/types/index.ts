// Tipos de usuario
export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  role: 'user' | 'publisher' | 'admin';
  faculty_id?: number;
  school_id?: number;
  cycle?: number;
  student_code?: string;
  user_status?: 'estudiante' | 'egresado';
  profile_photo?: string;
  cv_url?: string;
  bio?: string;
  linkedin_url?: string;
  created_at: string;
  faculty_name?: string;
  school_name?: string;
  skills?: UserSkill[];
  languages?: UserLanguage[];
  interests?: Interest[];
  unread_notifications?: number;
}

export interface UserSkill {
  id: number;
  name: string;
  category?: string;
  level: 'basico' | 'intermedio' | 'avanzado';
}

export interface UserLanguage {
  id: number;
  name: string;
  level: 'basico' | 'intermedio' | 'avanzado' | 'nativo';
}

// Tipos de oportunidad
export interface Opportunity {
  id: number;
  type_id: number;
  title: string;
  description: string;
  requirements?: string;
  documents_required?: string;
  benefits?: string;
  start_date?: string;
  end_date?: string;
  application_deadline?: string;
  modality: 'presencial' | 'virtual' | 'hibrido';
  location?: string;
  area?: string;
  publisher_id: number;
  publisher_name?: string;
  organization_name?: string;
  external_url?: string;
  attachment_url?: string;
  image_url?: string;
  visibility: 'publico' | 'facultad' | 'escuela';
  status: 'borrador' | 'pendiente' | 'activa' | 'pausada' | 'finalizada' | 'rechazada';
  is_featured: boolean;
  views_count: number;
  applications_count: number;
  created_at: string;
  type_name?: string;
  type_color?: string;
  type_icon?: string;
  is_saved?: boolean;
  has_applied?: boolean;
  application_status?: string;
}

export interface OpportunityType {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
}

// Tipos de postulación
export interface Application {
  id: number;
  user_id: number;
  opportunity_id: number;
  status: 'pendiente' | 'en_revision' | 'preseleccionado' | 'aceptado' | 'rechazado' | 'retirado';
  cover_letter?: string;
  notes?: string;
  publisher_notes?: string;
  created_at: string;
  updated_at: string;
  // Datos de oportunidad
  title?: string;
  organization_name?: string;
  modality?: string;
  application_deadline?: string;
  image_url?: string;
  opportunity_status?: string;
  type_name?: string;
  type_color?: string;
  // Datos de usuario (para publicadores)
  name?: string;
  email?: string;
  phone?: string;
  profile_photo?: string;
  cv_url?: string;
  cycle?: number;
  student_code?: string;
  faculty_name?: string;
  school_name?: string;
}

// Tipos de reporte
export interface Report {
  id: number;
  opportunity_id: number;
  user_id: number;
  reason: 'contenido_inapropiado' | 'informacion_falsa' | 'spam' | 'discriminacion' | 'otro';
  comment?: string;
  status: 'pendiente' | 'revisado' | 'accion_tomada' | 'descartado';
  admin_notes?: string;
  created_at: string;
  opportunity_title?: string;
  reporter_name?: string;
  reporter_email?: string;
  publisher_name?: string;
}

// Tipos de catálogos
export interface Faculty {
  id: number;
  name: string;
  code?: string;
}

export interface School {
  id: number;
  name: string;
  code?: string;
  faculty_id: number;
  faculty_name?: string;
}

export interface Skill {
  id: number;
  name: string;
  category?: string;
}

export interface Language {
  id: number;
  name: string;
}

export interface Interest {
  id: number;
  name: string;
}

// Tipos de cuenta externa
export interface ExternalAccount {
  id: number;
  organization_name: string;
  ruc?: string;
  representative_name: string;
  email: string;
  phone?: string;
  entity_type: 'empresa' | 'ong' | 'institucion_educativa' | 'gobierno' | 'otro';
  description?: string;
  logo_url?: string;
  website?: string;
  status: 'pendiente' | 'aprobada' | 'rechazada' | 'suspendida';
  created_at: string;
}

// Tipos de notificación
export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'application' | 'opportunity';
  link?: string;
  read: boolean;
  created_at: string;
}

// Tipos de respuesta de API
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}

// Tipos de estadísticas del dashboard
export interface DashboardStats {
  kpis: {
    active_opportunities: number;
    monthly_applications: number;
    total_users: number;
    new_users: number;
    pending_reports: number;
    pending_accounts: number;
  };
  charts: {
    byType: { name: string; color: string; count: number }[];
    monthlyTrend: { month: string; applications: number; unique_users: number }[];
    byFaculty: { code: string; name: string; count: number }[];
  };
  recentOpportunities: Opportunity[];
  recentReports: Report[];
}

// Tipos de progreso de perfil
export interface ProfileProgress {
  progress: number;
  fields: {
    name: string;
    completed: boolean;
    weight: number;
  }[];
  missing: string[];
}
