# OportUNI

Sistema de Gestión de Oportunidades Académicas y Profesionales para Estudiantes de la Universidad Nacional de Ingeniería.

![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?logo=postgresql)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)

## Descripción

OportUNI es una plataforma web que centraliza y gestiona todas las oportunidades académicas y profesionales disponibles para estudiantes y egresados de la UNI. El sistema permite acceder a:

- **Becas** - Programas de financiamiento para estudios
- **Prácticas pre-profesionales** - Experiencia laboral durante los estudios
- **Empleos** - Ofertas laborales para egresados
- **Voluntariados** - Oportunidades de servicio social
- **Eventos académicos** - Conferencias, talleres, seminarios
- **Concursos** - Competencias y hackathons
- **Investigación** - Proyectos de investigación

## Características

### Para Estudiantes/Egresados
- Registro con correo institucional (@uni.pe)
- Catálogo de oportunidades con filtros avanzados
- Sistema de postulación en línea
- Seguimiento de estado de postulaciones
- Guardado de oportunidades favoritas
- Notificaciones personalizadas
- Gestión de perfil y CV

### Para Publicadores
- Publicación de oportunidades
- Gestión de postulantes
- Exportación de datos (CSV)
- Estadísticas de publicaciones

### Para Administradores (OCBU)
- Dashboard con métricas y KPIs
- Moderación de publicaciones
- Gestión de cuentas externas
- Sistema de reportes
- Log de auditoría

## Tecnologías

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS
- React Router v6
- React Query (TanStack Query)
- React Hook Form + Zod
- Recharts (gráficos)
- Axios

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL
- JWT (autenticación)
- bcrypt (cifrado)
- Multer (uploads)
- express-validator

## Estructura del Proyecto

```
oportuniapp/
├── frontend/                # Aplicación React
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/          # Páginas de la aplicación
│   │   ├── context/        # React Context (Auth)
│   │   ├── services/       # Cliente API (Axios)
│   │   ├── types/          # TypeScript interfaces
│   │   └── App.tsx         # Rutas principales
│   └── package.json
│
├── backend/                 # API REST Node.js
│   ├── src/
│   │   ├── config/         # Configuraciones (DB, Multer)
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── middlewares/    # Auth, validación
│   │   ├── routes/         # Definición de endpoints
│   │   └── index.ts        # Entry point Express
│   └── package.json
│
├── database/
│   └── schema.sql          # Schema PostgreSQL
│
└── docs/                    # Documentación
    ├── Documentacion_Proyecto_Software.md
    ├── Manual_de_Usuario.md
    └── Manual_Tecnico_Sistema.md
```

## Instalación

### Prerrequisitos
- Node.js 20.x
- PostgreSQL 15+
- npm o yarn

### Base de Datos

```bash
# Crear base de datos
psql -U postgres
CREATE DATABASE oportuniapp;
CREATE USER oportuniapp_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE oportuniapp TO oportuniapp_user;
\q

# Ejecutar schema
psql -U oportuniapp_user -d oportuniapp -f database/schema.sql
```

### Backend

```bash
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Iniciar en desarrollo
npm run dev

# Compilar para producción
npm run build
npm start
```

**Variables de entorno (.env):**
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/oportuniapp
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRES_IN=7d
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
```

### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
echo "VITE_API_URL=http://localhost:3000" > .env

# Iniciar en desarrollo
npm run dev

# Compilar para producción
npm run build
```

## API Endpoints

### Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/auth/register | Registrar usuario |
| POST | /api/auth/login | Iniciar sesión |
| GET | /api/auth/me | Usuario actual |

### Oportunidades
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/opportunities | Listar (con filtros) |
| GET | /api/opportunities/:id | Obtener detalle |
| GET | /api/opportunities/featured | Destacadas |
| POST | /api/opportunities/:id/save | Guardar |

### Postulaciones
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/applications | Crear postulación |
| GET | /api/applications/my | Mis postulaciones |
| PUT | /api/applications/:id/status | Cambiar estado |

### Administración
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/admin/dashboard | Dashboard KPIs |
| GET | /api/admin/publications | Todas las publicaciones |
| PUT | /api/admin/publications/:id/status | Moderar |

## Usuarios de Prueba

| Email | Contraseña | Rol |
|-------|------------|-----|
| admin@uni.pe | Admin123! | Administrador |
| docente@uni.pe | Docente123! | Publicador |
| estudiante@uni.pe | Test123! | Usuario |

## Capturas de Pantalla

### Página Principal
Catálogo de oportunidades con filtros por tipo, facultad y modalidad.

### Dashboard Admin
Panel con métricas: oportunidades activas, postulaciones mensuales, reportes pendientes.

### Detalle de Oportunidad
Información completa con botones de postulación y guardado.

## Documentación

- [Documentación del Proyecto](docs/Documentacion_Proyecto_Software.md)
- [Manual de Usuario](docs/Manual_de_Usuario.md)
- [Manual Técnico](docs/Manual_Tecnico_Sistema.md)

## Equipo de Desarrollo

| Integrante | Código | Rol |
|------------|--------|-----|
| Muñoz Cruz Melannie Cristina | 20220402E | Product Owner / Frontend |
| Orosco Montalvan Sebastian Eduardo | 20221187K | Scrum Master / Backend |
| Nuñez Rivas Alvaro Fabricio | 20221152B | Dev Backend / DBA |
| Huayhualla Barboza Joseph Edgar | 20210245D | Dev Full Stack |

**Docente:** ING. COSSA CABANILLAS JESUS ALBERTO

## Curso

- **Universidad:** Universidad Nacional de Ingeniería (UNI)
- **Facultad:** Ingeniería Industrial y de Sistemas (FIIS)
- **Curso:** Ingeniería de Software (SI707V)
- **Grupo:** 6
- **Ciclo:** 2025-2

## Licencia

Este proyecto fue desarrollado con fines académicos para el curso de Ingeniería de Software.

---

**Universidad Nacional de Ingeniería** - Facultad de Ingeniería Industrial y de Sistemas

*Noviembre 2025*
