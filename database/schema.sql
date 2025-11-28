-- ============================================
-- OportUNI - Schema de Base de Datos
-- Universidad Nacional de Ingeniería
-- Sistema de Oportunidades Académicas
-- ============================================

-- Eliminar tablas existentes (en orden de dependencias)
DROP TABLE IF EXISTS audit_log CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS saved_opportunities CASCADE;
DROP TABLE IF EXISTS opportunities CASCADE;
DROP TABLE IF EXISTS opportunity_types CASCADE;
DROP TABLE IF EXISTS user_interests CASCADE;
DROP TABLE IF EXISTS user_languages CASCADE;
DROP TABLE IF EXISTS user_skills CASCADE;
DROP TABLE IF EXISTS interests CASCADE;
DROP TABLE IF EXISTS languages CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS external_accounts CASCADE;
DROP TABLE IF EXISTS schools CASCADE;
DROP TABLE IF EXISTS faculties CASCADE;

-- ============================================
-- TABLAS DE CATÁLOGOS
-- ============================================

-- Facultades de la UNI
CREATE TABLE faculties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL UNIQUE,
    code VARCHAR(10) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Escuelas/Especialidades por facultad
CREATE TABLE schools (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    code VARCHAR(20),
    faculty_id INTEGER NOT NULL REFERENCES faculties(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, faculty_id)
);

-- Habilidades/Competencias
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Idiomas
CREATE TABLE languages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Áreas de interés
CREATE TABLE interests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tipos de oportunidad
CREATE TABLE opportunity_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA DE USUARIOS
-- ============================================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(200) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'publisher', 'admin')),
    faculty_id INTEGER REFERENCES faculties(id),
    school_id INTEGER REFERENCES schools(id),
    cycle INTEGER CHECK (cycle >= 1 AND cycle <= 10),
    student_code VARCHAR(20),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    user_status VARCHAR(20) DEFAULT 'estudiante' CHECK (user_status IN ('estudiante', 'egresado')),
    profile_photo VARCHAR(500),
    cv_url VARCHAR(500),
    bio TEXT,
    linkedin_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Habilidades del usuario
CREATE TABLE user_skills (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    level VARCHAR(20) DEFAULT 'intermedio' CHECK (level IN ('basico', 'intermedio', 'avanzado')),
    PRIMARY KEY (user_id, skill_id)
);

-- Idiomas del usuario
CREATE TABLE user_languages (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    language_id INTEGER NOT NULL REFERENCES languages(id) ON DELETE CASCADE,
    level VARCHAR(20) NOT NULL DEFAULT 'intermedio' CHECK (level IN ('basico', 'intermedio', 'avanzado', 'nativo')),
    PRIMARY KEY (user_id, language_id)
);

-- Intereses del usuario
CREATE TABLE user_interests (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    interest_id INTEGER NOT NULL REFERENCES interests(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, interest_id)
);

-- ============================================
-- CUENTAS EXTERNAS (Organizaciones/Empresas)
-- ============================================

CREATE TABLE external_accounts (
    id SERIAL PRIMARY KEY,
    organization_name VARCHAR(255) NOT NULL,
    ruc VARCHAR(20),
    representative_name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('empresa', 'ong', 'institucion_educativa', 'gobierno', 'otro')),
    description TEXT,
    logo_url VARCHAR(500),
    website VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'aprobada', 'rechazada', 'suspendida')),
    user_id INTEGER REFERENCES users(id),
    rejection_reason TEXT,
    approved_by INTEGER REFERENCES users(id),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- OPORTUNIDADES
-- ============================================

CREATE TABLE opportunities (
    id SERIAL PRIMARY KEY,
    type_id INTEGER NOT NULL REFERENCES opportunity_types(id),
    title VARCHAR(300) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    documents_required TEXT,
    benefits TEXT,
    start_date DATE,
    end_date DATE,
    application_deadline DATE,
    modality VARCHAR(30) NOT NULL DEFAULT 'presencial' CHECK (modality IN ('presencial', 'virtual', 'hibrido')),
    location VARCHAR(200),
    area VARCHAR(100),
    publisher_id INTEGER NOT NULL REFERENCES users(id),
    publisher_name VARCHAR(200),
    organization_name VARCHAR(200),
    external_url VARCHAR(500),
    attachment_url VARCHAR(500),
    image_url VARCHAR(500),
    visibility VARCHAR(20) NOT NULL DEFAULT 'publico' CHECK (visibility IN ('publico', 'facultad', 'escuela')),
    target_faculty_id INTEGER REFERENCES faculties(id),
    target_school_id INTEGER REFERENCES schools(id),
    status VARCHAR(20) NOT NULL DEFAULT 'borrador' CHECK (status IN ('borrador', 'pendiente', 'activa', 'pausada', 'finalizada', 'rechazada')),
    is_featured BOOLEAN DEFAULT FALSE,
    views_count INTEGER DEFAULT 0,
    applications_count INTEGER DEFAULT 0,
    rejection_reason TEXT,
    reviewed_by INTEGER REFERENCES users(id),
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para búsqueda
CREATE INDEX idx_opportunities_type ON opportunities(type_id);
CREATE INDEX idx_opportunities_status ON opportunities(status);
CREATE INDEX idx_opportunities_publisher ON opportunities(publisher_id);
CREATE INDEX idx_opportunities_created ON opportunities(created_at DESC);
CREATE INDEX idx_opportunities_featured ON opportunities(is_featured) WHERE is_featured = TRUE;

-- ============================================
-- OPORTUNIDADES GUARDADAS
-- ============================================

CREATE TABLE saved_opportunities (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    opportunity_id INTEGER NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, opportunity_id)
);

-- ============================================
-- POSTULACIONES
-- ============================================

CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    opportunity_id INTEGER NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'en_revision', 'preseleccionado', 'aceptado', 'rechazado', 'retirado')),
    cover_letter TEXT,
    additional_documents VARCHAR(500),
    notes TEXT,
    publisher_notes TEXT,
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, opportunity_id)
);

CREATE INDEX idx_applications_user ON applications(user_id);
CREATE INDEX idx_applications_opportunity ON applications(opportunity_id);
CREATE INDEX idx_applications_status ON applications(status);

-- ============================================
-- REPORTES DE PUBLICACIONES
-- ============================================

CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    opportunity_id INTEGER NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reason VARCHAR(50) NOT NULL CHECK (reason IN ('contenido_inapropiado', 'informacion_falsa', 'spam', 'discriminacion', 'otro')),
    comment TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'revisado', 'accion_tomada', 'descartado')),
    admin_notes TEXT,
    resolved_by INTEGER REFERENCES users(id),
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(opportunity_id, user_id)
);

-- ============================================
-- NOTIFICACIONES
-- ============================================

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error', 'application', 'opportunity')),
    link VARCHAR(500),
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read) WHERE read = FALSE;

-- ============================================
-- REGISTRO DE AUDITORÍA
-- ============================================

CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(50) NOT NULL,
    entity VARCHAR(50) NOT NULL,
    entity_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_entity ON audit_log(entity, entity_id);
CREATE INDEX idx_audit_created ON audit_log(created_at DESC);

-- ============================================
-- FUNCIONES Y TRIGGERS
-- ============================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_opportunities_updated_at BEFORE UPDATE ON opportunities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_external_accounts_updated_at BEFORE UPDATE ON external_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para incrementar contador de vistas
CREATE OR REPLACE FUNCTION increment_views()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE opportunities SET views_count = views_count + 1 WHERE id = NEW.opportunity_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Función para actualizar contador de postulaciones
CREATE OR REPLACE FUNCTION update_applications_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE opportunities SET applications_count = applications_count + 1 WHERE id = NEW.opportunity_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE opportunities SET applications_count = applications_count - 1 WHERE id = OLD.opportunity_id;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_opportunity_applications_count
    AFTER INSERT OR DELETE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_applications_count();

-- ============================================
-- DATOS INICIALES (SEED)
-- ============================================

-- Tipos de oportunidad
INSERT INTO opportunity_types (name, description, icon, color) VALUES
('Beca', 'Becas académicas y de investigación', 'GraduationCap', 'blue'),
('Pasantía', 'Prácticas pre-profesionales y pasantías', 'Briefcase', 'green'),
('Intercambio', 'Programas de intercambio estudiantil', 'Globe', 'purple'),
('Voluntariado', 'Oportunidades de voluntariado', 'Heart', 'red'),
('Mentoría', 'Programas de mentoría profesional', 'Users', 'orange'),
('Concurso', 'Concursos y competencias académicas', 'Trophy', 'yellow'),
('Empleo', 'Ofertas de empleo para estudiantes y egresados', 'Building', 'indigo'),
('Investigación', 'Proyectos y grupos de investigación', 'Search', 'cyan');

-- Facultades de la UNI
INSERT INTO faculties (name, code) VALUES
('Facultad de Ingeniería Industrial y de Sistemas', 'FIIS'),
('Facultad de Ingeniería Civil', 'FIC'),
('Facultad de Ingeniería Mecánica', 'FIM'),
('Facultad de Ingeniería Eléctrica y Electrónica', 'FIEE'),
('Facultad de Ingeniería de Petróleo, Gas Natural y Petroquímica', 'FIPGP'),
('Facultad de Ingeniería Geológica, Minera y Metalúrgica', 'FIGMM'),
('Facultad de Ingeniería Química y Textil', 'FIQT'),
('Facultad de Ingeniería Ambiental', 'FIA'),
('Facultad de Arquitectura, Urbanismo y Artes', 'FAUA'),
('Facultad de Ciencias', 'FC'),
('Facultad de Ingeniería Económica, Estadística y Ciencias Sociales', 'FIEECS');

-- Escuelas de FIIS
INSERT INTO schools (name, code, faculty_id) VALUES
('Ingeniería Industrial', 'II', 1),
('Ingeniería de Sistemas', 'IS', 1);

-- Escuelas de FIC
INSERT INTO schools (name, code, faculty_id) VALUES
('Ingeniería Civil', 'IC', 2);

-- Escuelas de FIM
INSERT INTO schools (name, code, faculty_id) VALUES
('Ingeniería Mecánica', 'IM', 3),
('Ingeniería Mecatrónica', 'IMT', 3),
('Ingeniería Naval', 'IN', 3);

-- Escuelas de FIEE
INSERT INTO schools (name, code, faculty_id) VALUES
('Ingeniería Eléctrica', 'IE', 4),
('Ingeniería Electrónica', 'IEL', 4),
('Ingeniería de Telecomunicaciones', 'IT', 4);

-- Escuelas de otras facultades
INSERT INTO schools (name, code, faculty_id) VALUES
('Ingeniería de Petróleo', 'IP', 5),
('Ingeniería Petroquímica', 'IPQ', 5),
('Ingeniería Geológica', 'IG', 6),
('Ingeniería de Minas', 'IMI', 6),
('Ingeniería Metalúrgica', 'IME', 6),
('Ingeniería Química', 'IQ', 7),
('Ingeniería Textil', 'ITX', 7),
('Ingeniería Sanitaria', 'ISA', 8),
('Ingeniería de Higiene y Seguridad Industrial', 'IHSI', 8),
('Arquitectura', 'ARQ', 9),
('Urbanismo', 'URB', 9),
('Física', 'FIS', 10),
('Matemática', 'MAT', 10),
('Química', 'QUI', 10),
('Ingeniería Económica', 'IEC', 11),
('Estadística', 'EST', 11);

-- Habilidades
INSERT INTO skills (name, category) VALUES
('Python', 'Programación'),
('JavaScript', 'Programación'),
('TypeScript', 'Programación'),
('Java', 'Programación'),
('C++', 'Programación'),
('React', 'Frameworks'),
('Node.js', 'Frameworks'),
('Angular', 'Frameworks'),
('SQL', 'Base de Datos'),
('PostgreSQL', 'Base de Datos'),
('MongoDB', 'Base de Datos'),
('AWS', 'Cloud'),
('Docker', 'DevOps'),
('Git', 'Herramientas'),
('Excel Avanzado', 'Ofimática'),
('Power BI', 'Análisis de Datos'),
('Machine Learning', 'IA'),
('Gestión de Proyectos', 'Soft Skills'),
('Liderazgo', 'Soft Skills'),
('Comunicación Efectiva', 'Soft Skills');

-- Idiomas
INSERT INTO languages (name) VALUES
('Español'),
('Inglés'),
('Portugués'),
('Francés'),
('Alemán'),
('Italiano'),
('Chino Mandarín'),
('Japonés'),
('Coreano'),
('Quechua');

-- Intereses
INSERT INTO interests (name) VALUES
('Inteligencia Artificial'),
('Desarrollo Web'),
('Desarrollo Móvil'),
('Ciencia de Datos'),
('Ciberseguridad'),
('Internet de las Cosas'),
('Blockchain'),
('Energías Renovables'),
('Automatización Industrial'),
('Gestión de Proyectos'),
('Emprendimiento'),
('Investigación Científica'),
('Sostenibilidad Ambiental'),
('Finanzas'),
('Consultoría');

-- Usuario administrador por defecto (contraseña: admin123)
INSERT INTO users (email, password_hash, name, role, status) VALUES
('admin@uni.pe', '$2b$10$rQZ8K.1P5Z1Z1Z1Z1Z1Z1O1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1', 'Administrador OCBU', 'admin', 'active');

-- Usuario publicador de ejemplo (contraseña: publisher123)
INSERT INTO users (email, password_hash, name, role, faculty_id, status) VALUES
('publicador@uni.pe', '$2b$10$rQZ8K.1P5Z1Z1Z1Z1Z1Z1O1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1', 'Dr. Carlos García', 'publisher', 1, 'active');

-- Usuarios estudiantes de ejemplo (contraseña: student123)
INSERT INTO users (email, password_hash, name, role, faculty_id, school_id, cycle, student_code, user_status, status) VALUES
('20220402e@uni.pe', '$2b$10$rQZ8K.1P5Z1Z1Z1Z1Z1Z1O1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1', 'Melannie Cristina Muñoz Cruz', 'user', 1, 2, 7, '20220402E', 'estudiante', 'active'),
('20221187k@uni.pe', '$2b$10$rQZ8K.1P5Z1Z1Z1Z1Z1Z1O1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1', 'Sebastian Eduardo Orosco Montalvan', 'user', 1, 2, 7, '20221187K', 'estudiante', 'active'),
('20221152b@uni.pe', '$2b$10$rQZ8K.1P5Z1Z1Z1Z1Z1Z1O1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1', 'Alvaro Fabricio Nuñez Rivas', 'user', 1, 2, 7, '20221152B', 'estudiante', 'active'),
('20210245d@uni.pe', '$2b$10$rQZ8K.1P5Z1Z1Z1Z1Z1Z1O1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1', 'Joseph Edgar Huayhualla Barboza', 'user', 1, 2, 8, '20210245D', 'estudiante', 'active');

-- Oportunidades de ejemplo
INSERT INTO opportunities (type_id, title, description, requirements, benefits, start_date, end_date, application_deadline, modality, location, publisher_id, publisher_name, organization_name, status, is_featured) VALUES
(1, 'Beca de Investigación en IA - Google',
'Programa de becas para estudiantes interesados en investigación en Inteligencia Artificial. El programa incluye mentoría de investigadores de Google y acceso a recursos computacionales de última generación.',
'Estudiante de últimos ciclos de Ingeniería de Sistemas, Ciencias de la Computación o carreras afines. Conocimientos en Machine Learning y Deep Learning. Inglés avanzado.',
'Beca completa que cubre matrícula y manutención. Acceso a laboratorios de Google. Posibilidad de publicación en conferencias internacionales.',
'2025-03-01', '2025-12-31', '2025-02-15', 'hibrido', 'Lima, Perú / Remote', 2, 'Dr. Carlos García', 'Google Research', 'activa', true),

(2, 'Pasantía en Desarrollo de Software - Microsoft',
'Únete al equipo de desarrollo de Microsoft Perú. Trabajarás en proyectos reales usando las últimas tecnologías cloud y desarrollo de software.',
'Estudiante de 8vo ciclo en adelante de Ing. de Sistemas o carreras afines. Conocimientos en C#, .NET, Azure. Inglés intermedio-avanzado.',
'Remuneración competitiva. Horario flexible. Posibilidad de contratación. Capacitaciones y certificaciones.',
'2025-02-01', '2025-07-31', '2025-01-20', 'hibrido', 'Lima, Perú', 2, 'Dr. Carlos García', 'Microsoft Perú', 'activa', true),

(3, 'Intercambio Estudiantil - TU Delft, Holanda',
'Programa de intercambio de un semestre en la Universidad Técnica de Delft, una de las mejores universidades de ingeniería de Europa.',
'Promedio ponderado mínimo de 14. Inglés B2 o superior certificado. Estudiante regular de 6to ciclo en adelante.',
'Beca parcial (50% de gastos). Alojamiento universitario. Seguro médico internacional.',
'2025-09-01', '2026-02-28', '2025-04-30', 'presencial', 'Delft, Holanda', 2, 'Dr. Carlos García', 'TU Delft', 'activa', true),

(4, 'Voluntariado: Enseña Programación a Niños',
'Únete a nuestra iniciativa para enseñar programación básica a niños de comunidades vulnerables en Lima.',
'Estudiante de cualquier ciclo. Conocimientos básicos de programación. Vocación de servicio y paciencia.',
'Certificado de voluntariado. Desarrollo de habilidades blandas. Impacto social positivo.',
'2025-02-01', '2025-12-31', '2025-01-31', 'presencial', 'Diversos distritos de Lima', 2, 'Dr. Carlos García', 'Code.org Perú', 'activa', false),

(5, 'Programa de Mentoría - McKinsey & Company',
'Programa de mentoría de 6 meses donde consultores senior de McKinsey guiarán tu desarrollo profesional.',
'Estudiante de últimos 2 años. Liderazgo demostrado. Excelencia académica. Inglés avanzado.',
'Mentoría personalizada. Networking con profesionales top. Workshops exclusivos. Posibilidad de entrevista para prácticas.',
'2025-03-01', '2025-08-31', '2025-02-28', 'virtual', 'Virtual', 2, 'Dr. Carlos García', 'McKinsey & Company', 'activa', true),

(6, 'Hackathon UNI 2025',
'Competencia de 48 horas para desarrollar soluciones innovadoras a problemas reales. Premios en efectivo y oportunidades de incubación.',
'Equipos de 3-5 estudiantes UNI. Cualquier facultad. Cualquier ciclo.',
'1er lugar: S/. 10,000. 2do lugar: S/. 5,000. 3er lugar: S/. 2,500. Mentoría de startups.',
'2025-04-15', '2025-04-17', '2025-04-01', 'presencial', 'Campus UNI, Rímac', 2, 'Dr. Carlos García', 'UNI Innovation Hub', 'activa', true),

(7, 'Empleo Part-Time: Desarrollador Junior',
'Buscamos desarrollador junior para trabajar medio tiempo en startup tecnológica del ecosistema UNI.',
'Estudiante de 5to ciclo en adelante. Conocimientos de React y Node.js. Disponibilidad de 20 horas semanales.',
'S/. 1,200 mensuales. Horario flexible. Home office. Experiencia real en startup.',
'2025-01-15', '2025-12-31', '2025-01-31', 'hibrido', 'Lima, Perú / Remote', 2, 'Dr. Carlos García', 'TechStartup UNI', 'activa', false),

(8, 'Grupo de Investigación en IoT',
'Convocatoria para integrar el grupo de investigación en Internet de las Cosas del Laboratorio de IA de la FIIS.',
'Estudiante de Ing. de Sistemas o Ing. Electrónica. Interés en IoT, sensores y sistemas embebidos.',
'Participación en proyectos de investigación. Publicaciones académicas. Uso de laboratorios.',
'2025-02-01', '2025-12-31', '2025-01-25', 'presencial', 'Laboratorio FIIS, UNI', 2, 'Dr. Carlos García', 'FIIS - UNI', 'activa', false);

-- Postulaciones de ejemplo
INSERT INTO applications (user_id, opportunity_id, status, cover_letter) VALUES
(3, 1, 'pendiente', 'Estimados, me encuentro muy interesado en esta oportunidad de beca en investigación de IA...'),
(3, 2, 'en_revision', 'Mi experiencia en desarrollo web y mi pasión por la tecnología me hacen un candidato ideal...'),
(4, 1, 'preseleccionado', 'Como estudiante destacado de Ingeniería de Sistemas con proyectos en ML...'),
(4, 5, 'pendiente', 'Busco mentoría para desarrollar mis habilidades de liderazgo y consultoría...'),
(5, 3, 'aceptado', 'El intercambio a TU Delft representa una oportunidad única para mi formación...'),
(5, 6, 'pendiente', 'Nuestro equipo está listo para el Hackathon UNI 2025...'),
(6, 2, 'pendiente', 'Con experiencia en C# y Azure, estoy preparado para contribuir en Microsoft...'),
(6, 7, 'aceptado', 'Mi disponibilidad de horarios y conocimientos técnicos se alinean perfectamente...');

-- Oportunidades guardadas de ejemplo
INSERT INTO saved_opportunities (user_id, opportunity_id) VALUES
(3, 3),
(3, 5),
(4, 2),
(4, 6),
(5, 1),
(6, 4);

-- Notificaciones de ejemplo
INSERT INTO notifications (user_id, title, message, type, link) VALUES
(3, 'Nueva oportunidad destacada', 'Se ha publicado una nueva beca de investigación en IA de Google', 'opportunity', '/opportunities/1'),
(3, 'Postulación recibida', 'Tu postulación a la pasantía de Microsoft ha sido recibida', 'application', '/my-applications'),
(4, 'Actualización de postulación', '¡Felicitaciones! Has sido preseleccionado para la Beca de Investigación en IA', 'success', '/my-applications'),
(5, '¡Postulación aceptada!', 'Tu postulación al intercambio en TU Delft ha sido aceptada', 'success', '/my-applications');

-- Vista para estadísticas del dashboard
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT
    (SELECT COUNT(*) FROM opportunities WHERE status = 'activa') as active_opportunities,
    (SELECT COUNT(*) FROM applications WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as monthly_applications,
    (SELECT COUNT(*) FROM users WHERE role = 'user' AND created_at >= CURRENT_DATE - INTERVAL '30 days') as new_users,
    (SELECT COUNT(*) FROM reports WHERE status = 'pendiente') as pending_reports;

-- Vista para oportunidades por tipo
CREATE OR REPLACE VIEW opportunities_by_type AS
SELECT
    ot.name as type_name,
    ot.color,
    COUNT(o.id) as count
FROM opportunity_types ot
LEFT JOIN opportunities o ON o.type_id = ot.id AND o.status = 'activa'
GROUP BY ot.id, ot.name, ot.color
ORDER BY count DESC;

-- Vista para postulaciones por facultad
CREATE OR REPLACE VIEW applications_by_faculty AS
SELECT
    f.name as faculty_name,
    f.code,
    COUNT(a.id) as applications_count
FROM faculties f
LEFT JOIN users u ON u.faculty_id = f.id
LEFT JOIN applications a ON a.user_id = u.id AND a.created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY f.id, f.name, f.code
ORDER BY applications_count DESC;
