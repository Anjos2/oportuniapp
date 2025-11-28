# MANUAL TÉCNICO DEL SISTEMA

## OPORTUNIDADES ACADÉMICAS Y PROFESIONALES PARA ESTUDIANTES UNI (OportUNI)

---

**UNIVERSIDAD NACIONAL DE INGENIERÍA**
**Facultad de Ingeniería Industrial y de Sistemas**

---

**Versión:** 1.0
**Fecha:** Noviembre 2025

---

## ÍNDICE

1. [Introducción](#1-introducción)
2. [Arquitectura del Sistema](#2-arquitectura-del-sistema)
3. [Requisitos Técnicos](#3-requisitos-técnicos)
4. [Instalación y Configuración](#4-instalación-y-configuración)
5. [Base de Datos](#5-base-de-datos)
6. [API REST](#6-api-rest)
7. [Frontend](#7-frontend)
8. [Seguridad](#8-seguridad)
9. [Mantenimiento](#9-mantenimiento)
10. [Anexos](#10-anexos)

---

## 1. INTRODUCCIÓN

### 1.1 Propósito del Documento

Este manual técnico proporciona la documentación necesaria para:
- Instalar y configurar el sistema OportUNI
- Comprender la arquitectura y componentes
- Realizar mantenimiento y actualizaciones
- Resolver problemas técnicos
- Extender funcionalidades

### 1.2 Audiencia

- Desarrolladores de software
- Administradores de sistemas
- Personal de TI
- Equipo de soporte técnico

### 1.3 Alcance

Cubre todos los aspectos técnicos del sistema:
- Backend (Node.js/Express)
- Frontend (React)
- Base de datos (PostgreSQL)
- Infraestructura de despliegue

### 1.4 Stack Tecnológico Resumen

| Capa | Tecnología | Versión |
|------|------------|---------|
| Frontend | React + TypeScript | 18.2 / 5.3 |
| Backend | Node.js + Express | 20.x / 4.18 |
| Base de Datos | PostgreSQL | 15+ |
| Build Tool | Vite | 5.0 |
| CSS Framework | Tailwind CSS | 3.4 |
| Autenticación | JWT | - |

---

## 2. ARQUITECTURA DEL SISTEMA

### 2.1 Diagrama de Arquitectura

```
                                    ┌─────────────────┐
                                    │     CLIENTE     │
                                    │   (Navegador)   │
                                    └────────┬────────┘
                                             │
                                             │ HTTPS
                                             ▼
                              ┌──────────────────────────┐
                              │      LOAD BALANCER       │
                              │       (Nginx/CDN)        │
                              └────────────┬─────────────┘
                                           │
                         ┌─────────────────┴─────────────────┐
                         │                                   │
                         ▼                                   ▼
              ┌─────────────────────┐          ┌─────────────────────┐
              │   STATIC FILES      │          │    API SERVER       │
              │   (React Build)     │          │   (Node.js)         │
              │                     │          │                     │
              │  • index.html       │          │  • Express          │
              │  • bundle.js        │          │  • Controllers      │
              │  • styles.css       │          │  • Middlewares      │
              │  • assets/          │          │  • Routes           │
              └─────────────────────┘          └──────────┬──────────┘
                                                          │
                                                          │ SQL
                                                          ▼
                                               ┌─────────────────────┐
                                               │    PostgreSQL       │
                                               │    Database         │
                                               │                     │
                                               │  • Users            │
                                               │  • Opportunities    │
                                               │  • Applications     │
                                               │  • ...              │
                                               └─────────────────────┘
```

### 2.2 Patrón Arquitectónico

Se implementa una arquitectura **Cliente-Servidor** con los siguientes patrones:

**Backend:**
- **MVC (Model-View-Controller):** Separación de lógica de negocio
- **Repository Pattern:** Abstracción de acceso a datos
- **Middleware Pattern:** Procesamiento de requests en cadena

**Frontend:**
- **Component-Based Architecture:** React components
- **Context Pattern:** Estado global con React Context
- **Container/Presenter:** Separación de lógica y presentación

### 2.3 Flujo de Datos

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  React   │────▶│  Axios   │────▶│ Express  │────▶│PostgreSQL│
│  Component│    │  Client  │     │  Route   │     │  Query   │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
     │                                                    │
     │           ┌──────────┐     ┌──────────┐           │
     │◀──────────│  State   │◀────│Controller│◀──────────│
     │           │  Update  │     │ Response │           │
     └───────────┴──────────┴─────┴──────────┴───────────┘
```

### 2.4 Estructura de Directorios

```
oportuniapp/
│
├── frontend/                      # Aplicación React
│   ├── public/                    # Archivos estáticos públicos
│   │   ├── favicon.ico
│   │   └── robots.txt
│   │
│   ├── src/                       # Código fuente
│   │   ├── components/            # Componentes React
│   │   │   ├── common/            # Componentes compartidos
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Pagination.tsx
│   │   │   │   └── MainLayout.tsx
│   │   │   │
│   │   │   ├── admin/             # Componentes admin
│   │   │   │   └── AdminLayout.tsx
│   │   │   │
│   │   │   └── opportunities/     # Componentes de oportunidades
│   │   │       └── OpportunityCard.tsx
│   │   │
│   │   ├── pages/                 # Páginas de la aplicación
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── OpportunitiesPage.tsx
│   │   │   ├── OpportunityDetailPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── MyApplicationsPage.tsx
│   │   │   ├── SavedOpportunitiesPage.tsx
│   │   │   ├── MyPublicationsPage.tsx
│   │   │   ├── CreatePublicationPage.tsx
│   │   │   ├── EditPublicationPage.tsx
│   │   │   ├── PublicationApplicationsPage.tsx
│   │   │   ├── HelpPage.tsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboardPage.tsx
│   │   │       ├── AdminPublicationsPage.tsx
│   │   │       ├── AdminReportsPage.tsx
│   │   │       └── AdminExternalAccountsPage.tsx
│   │   │
│   │   ├── context/               # React Context
│   │   │   └── AuthContext.tsx
│   │   │
│   │   ├── services/              # Servicios API
│   │   │   └── api.ts
│   │   │
│   │   ├── types/                 # TypeScript types
│   │   │   └── index.ts
│   │   │
│   │   ├── App.tsx                # Componente principal
│   │   ├── main.tsx               # Entry point
│   │   └── index.css              # Estilos globales
│   │
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── tsconfig.json
│
├── backend/                       # API Node.js
│   ├── src/
│   │   ├── config/                # Configuraciones
│   │   │   ├── database.ts        # Pool PostgreSQL
│   │   │   └── multer.ts          # Upload de archivos
│   │   │
│   │   ├── controllers/           # Controladores
│   │   │   ├── auth.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── opportunity.controller.ts
│   │   │   ├── application.controller.ts
│   │   │   ├── publication.controller.ts
│   │   │   ├── report.controller.ts
│   │   │   ├── admin.controller.ts
│   │   │   └── catalog.controller.ts
│   │   │
│   │   ├── middlewares/           # Middlewares
│   │   │   ├── auth.middleware.ts
│   │   │   └── validate.middleware.ts
│   │   │
│   │   ├── routes/                # Definición de rutas
│   │   │   ├── auth.routes.ts
│   │   │   ├── user.routes.ts
│   │   │   ├── opportunity.routes.ts
│   │   │   ├── application.routes.ts
│   │   │   ├── publication.routes.ts
│   │   │   ├── report.routes.ts
│   │   │   ├── admin.routes.ts
│   │   │   └── catalog.routes.ts
│   │   │
│   │   └── index.ts               # Entry point Express
│   │
│   ├── uploads/                   # Archivos subidos
│   │   ├── cvs/
│   │   ├── photos/
│   │   └── attachments/
│   │
│   ├── package.json
│   └── tsconfig.json
│
├── database/
│   └── schema.sql                 # Schema completo
│
└── docs/                          # Documentación
    ├── Documentacion_Proyecto_Software.md
    ├── Manual_de_Usuario.md
    └── Manual_Tecnico_Sistema.md
```

---

## 3. REQUISITOS TÉCNICOS

### 3.1 Requisitos de Hardware

#### Servidor de Desarrollo
| Componente | Mínimo | Recomendado |
|------------|--------|-------------|
| CPU | 2 cores | 4 cores |
| RAM | 4 GB | 8 GB |
| Almacenamiento | 20 GB | 50 GB SSD |

#### Servidor de Producción
| Componente | Mínimo | Recomendado |
|------------|--------|-------------|
| CPU | 4 cores | 8 cores |
| RAM | 8 GB | 16 GB |
| Almacenamiento | 50 GB SSD | 100 GB SSD |
| Red | 100 Mbps | 1 Gbps |

### 3.2 Requisitos de Software

#### Sistema Operativo
- Ubuntu 22.04 LTS (recomendado)
- Debian 11+
- CentOS 8+
- Windows Server 2019+ (con WSL2)

#### Software Requerido

| Software | Versión | Propósito |
|----------|---------|-----------|
| Node.js | 20.x LTS | Runtime JavaScript |
| npm | 10.x | Gestor de paquetes |
| PostgreSQL | 15+ | Base de datos |
| Nginx | 1.24+ | Servidor web/proxy |
| Git | 2.40+ | Control de versiones |
| PM2 | 5.x | Process manager |

### 3.3 Dependencias del Proyecto

#### Backend (package.json)

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "multer": "^1.4.5-lts.1",
    "express-validator": "^7.0.1",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "compression": "^1.7.4",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "@types/node": "^20.10.0",
    "@types/express": "^4.17.21",
    "@types/bcrypt": "^5.0.2",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/multer": "^1.4.11",
    "@types/cors": "^2.8.17",
    "@types/compression": "^1.7.5",
    "ts-node-dev": "^2.0.0"
  }
}
```

#### Frontend (package.json)

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.0",
    "@tanstack/react-query": "^5.14.0",
    "react-hook-form": "^7.49.0",
    "@hookform/resolvers": "^3.3.2",
    "zod": "^3.22.4",
    "axios": "^1.6.2",
    "date-fns": "^3.0.6",
    "recharts": "^2.10.3",
    "lucide-react": "^0.300.0",
    "react-hot-toast": "^2.4.1",
    "clsx": "^2.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.3.3",
    "vite": "^5.0.8",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.32",
    "autoprefixer": "^10.4.16"
  }
}
```

---

## 4. INSTALACIÓN Y CONFIGURACIÓN

### 4.1 Instalación en Desarrollo

#### Paso 1: Clonar Repositorio

```bash
git clone https://github.com/uni/oportuniapp.git
cd oportuniapp
```

#### Paso 2: Configurar Base de Datos

```bash
# Crear base de datos
sudo -u postgres psql
CREATE DATABASE oportuniapp_dev;
CREATE USER oportuniapp_user WITH PASSWORD 'dev_password';
GRANT ALL PRIVILEGES ON DATABASE oportuniapp_dev TO oportuniapp_user;
\q

# Ejecutar schema
psql -U oportuniapp_user -d oportuniapp_dev -f database/schema.sql
```

#### Paso 3: Configurar Backend

```bash
cd backend

# Instalar dependencias
npm install

# Crear archivo .env
cat > .env << EOF
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://oportuniapp_user:dev_password@localhost:5432/oportuniapp_dev
JWT_SECRET=your-super-secret-key-for-development-only
JWT_EXPIRES_IN=7d
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
EOF

# Crear directorios de uploads
mkdir -p uploads/cvs uploads/photos uploads/attachments

# Iniciar servidor de desarrollo
npm run dev
```

#### Paso 4: Configurar Frontend

```bash
cd ../frontend

# Instalar dependencias
npm install

# Crear archivo .env
echo "VITE_API_URL=http://localhost:3000" > .env

# Iniciar servidor de desarrollo
npm run dev
```

#### Paso 5: Verificar Instalación

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api/health

### 4.2 Instalación en Producción

#### Paso 1: Preparar Servidor

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependencias del sistema
sudo apt install -y curl git build-essential

# Instalar Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Instalar Nginx
sudo apt install -y nginx

# Instalar PM2 globalmente
sudo npm install -g pm2
```

#### Paso 2: Configurar PostgreSQL

```bash
# Configurar usuario y base de datos
sudo -u postgres psql << EOF
CREATE USER oportuniapp_prod WITH PASSWORD 'secure_production_password';
CREATE DATABASE oportuniapp_prod OWNER oportuniapp_prod;
GRANT ALL PRIVILEGES ON DATABASE oportuniapp_prod TO oportuniapp_prod;
EOF

# Configurar acceso remoto (si es necesario)
sudo nano /etc/postgresql/15/main/pg_hba.conf
# Agregar: host oportuniapp_prod oportuniapp_prod 10.0.0.0/8 md5

sudo nano /etc/postgresql/15/main/postgresql.conf
# Cambiar: listen_addresses = '*'

sudo systemctl restart postgresql
```

#### Paso 3: Desplegar Aplicación

```bash
# Clonar repositorio
cd /var/www
sudo git clone https://github.com/uni/oportuniapp.git
sudo chown -R $USER:$USER oportuniapp
cd oportuniapp

# Ejecutar schema
psql -U oportuniapp_prod -h localhost -d oportuniapp_prod -f database/schema.sql

# Configurar Backend
cd backend
npm install --production

cat > .env << EOF
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://oportuniapp_prod:secure_production_password@localhost:5432/oportuniapp_prod
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRES_IN=7d
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
EOF

npm run build
mkdir -p uploads/cvs uploads/photos uploads/attachments

# Iniciar con PM2
pm2 start dist/index.js --name oportuniapp-api
pm2 save
pm2 startup

# Configurar Frontend
cd ../frontend
npm install
echo "VITE_API_URL=https://api.oportuniapp.uni.pe" > .env
npm run build

# Copiar build a directorio público
sudo mkdir -p /var/www/oportuniapp-static
sudo cp -r dist/* /var/www/oportuniapp-static/
```

#### Paso 4: Configurar Nginx

```bash
sudo nano /etc/nginx/sites-available/oportuniapp
```

```nginx
# /etc/nginx/sites-available/oportuniapp

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name oportuniapp.uni.pe api.oportuniapp.uni.pe;
    return 301 https://$server_name$request_uri;
}

# Frontend
server {
    listen 443 ssl http2;
    server_name oportuniapp.uni.pe;

    ssl_certificate /etc/letsencrypt/live/oportuniapp.uni.pe/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/oportuniapp.uni.pe/privkey.pem;

    root /var/www/oportuniapp-static;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# API Backend
server {
    listen 443 ssl http2;
    server_name api.oportuniapp.uni.pe;

    ssl_certificate /etc/letsencrypt/live/api.oportuniapp.uni.pe/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.oportuniapp.uni.pe/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # File upload size
    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static uploads
    location /uploads {
        alias /var/www/oportuniapp/backend/uploads;
        expires 30d;
        add_header Cache-Control "public";
    }
}
```

```bash
# Activar sitio
sudo ln -s /etc/nginx/sites-available/oportuniapp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Configurar SSL con Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d oportuniapp.uni.pe -d api.oportuniapp.uni.pe
```

### 4.3 Variables de Entorno

#### Backend (.env)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| NODE_ENV | Ambiente de ejecución | production |
| PORT | Puerto del servidor | 3000 |
| DATABASE_URL | Connection string PostgreSQL | postgresql://user:pass@host:5432/db |
| JWT_SECRET | Clave secreta para JWT (mín 32 chars) | random-256-bit-string |
| JWT_EXPIRES_IN | Tiempo de expiración del token | 7d |
| UPLOAD_DIR | Directorio de archivos subidos | ./uploads |
| MAX_FILE_SIZE | Tamaño máximo de archivo (bytes) | 10485760 |

#### Frontend (.env)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| VITE_API_URL | URL base de la API | https://api.oportuniapp.uni.pe |

---

## 5. BASE DE DATOS

### 5.1 Modelo Entidad-Relación

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           BASE DE DATOS                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────┐         ┌──────────────┐         ┌──────────────┐    │
│  │  faculties   │◄────────│   schools    │         │    users     │    │
│  │──────────────│         │──────────────│◄────────│──────────────│    │
│  │ id           │         │ id           │         │ id           │    │
│  │ name         │         │ faculty_id   │         │ email        │    │
│  │ code         │         │ name         │         │ password_hash│    │
│  └──────────────┘         └──────────────┘         │ name         │    │
│                                                     │ role         │    │
│                                                     │ faculty_id   │───►│
│  ┌──────────────┐         ┌──────────────┐         │ school_id    │───►│
│  │opportunity_  │         │opportunities │         │ cv_url       │    │
│  │    types     │◄────────│──────────────│         │ photo_url    │    │
│  │──────────────│         │ id           │         └───────┬──────┘    │
│  │ id           │         │ title        │                 │           │
│  │ name         │         │ type_id      │◄────────────────┤           │
│  │ description  │         │ publisher_id │                 │           │
│  │ icon         │         │ status       │                 │           │
│  │ color        │         │ start_date   │                 │           │
│  └──────────────┘         │ end_date     │                 │           │
│                           │ requirements │                 │           │
│                           └───────┬──────┘                 │           │
│                                   │                        │           │
│  ┌──────────────┐                 │         ┌──────────────┤           │
│  │ applications │◄────────────────┴─────────│              │           │
│  │──────────────│                           │              │           │
│  │ id           │                           │              │           │
│  │ user_id      │───────────────────────────┘              │           │
│  │ opportunity_id│                                          │           │
│  │ status       │                                          │           │
│  │ cover_letter │                           ┌──────────────┤           │
│  │ cv_url       │                           │              │           │
│  └──────────────┘                           │              │           │
│                                             │              │           │
│  ┌──────────────┐         ┌──────────────┐  │   ┌──────────┴───┐      │
│  │   reports    │         │ saved_opps   │  │   │notifications │      │
│  │──────────────│         │──────────────│  │   │──────────────│      │
│  │ id           │         │ id           │  │   │ id           │      │
│  │ opportunity_id│◄───────│ user_id      │──┘   │ user_id      │◄─────│
│  │ reporter_id  │◄────────│ opportunity_id│     │ type         │      │
│  │ reason       │         └──────────────┘     │ message      │      │
│  │ status       │                              │ is_read      │      │
│  └──────────────┘                              └──────────────┘      │
│                                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                │
│  │    skills    │  │  languages   │  │  interests   │                │
│  │──────────────│  │──────────────│  │──────────────│                │
│  │ id           │  │ id           │  │ id           │                │
│  │ name         │  │ name         │  │ name         │                │
│  │ category     │  │ code         │  │ category     │                │
│  └──────────────┘  └──────────────┘  └──────────────┘                │
│                                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                │
│  │ user_skills  │  │user_languages│  │user_interests│                │
│  │──────────────│  │──────────────│  │──────────────│                │
│  │ user_id      │──│ user_id      │──│ user_id      │                │
│  │ skill_id     │  │ language_id  │  │ interest_id  │                │
│  │ level        │  │ level        │  └──────────────┘                │
│  └──────────────┘  └──────────────┘                                  │
│                                                                        │
│  ┌────────────────────┐         ┌──────────────┐                     │
│  │ external_accounts  │         │  audit_log   │                     │
│  │────────────────────│         │──────────────│                     │
│  │ id                 │         │ id           │                     │
│  │ user_id            │         │ user_id      │                     │
│  │ organization_name  │         │ action       │                     │
│  │ ruc                │         │ entity_type  │                     │
│  │ entity_type        │         │ entity_id    │                     │
│  │ status             │         │ details      │                     │
│  └────────────────────┘         │ ip_address   │                     │
│                                 └──────────────┘                     │
└─────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Diccionario de Datos

#### Tabla: users

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| id | SERIAL | NO | auto | Identificador único |
| email | VARCHAR(255) | NO | - | Correo electrónico (único) |
| password_hash | VARCHAR(255) | NO | - | Contraseña hasheada |
| name | VARCHAR(255) | NO | - | Nombre completo |
| role | VARCHAR(20) | NO | 'user' | Rol: user, publisher, admin |
| student_code | VARCHAR(20) | YES | NULL | Código de estudiante |
| faculty_id | INTEGER | YES | NULL | FK a faculties |
| school_id | INTEGER | YES | NULL | FK a schools |
| cycle | INTEGER | YES | NULL | Ciclo académico (1-10) |
| phone | VARCHAR(20) | YES | NULL | Teléfono de contacto |
| bio | TEXT | YES | NULL | Descripción personal |
| linkedin_url | VARCHAR(500) | YES | NULL | URL de LinkedIn |
| cv_url | VARCHAR(500) | YES | NULL | URL del CV |
| profile_photo_url | VARCHAR(500) | YES | NULL | URL de foto |
| is_active | BOOLEAN | NO | true | Estado de la cuenta |
| email_verified | BOOLEAN | NO | false | Email verificado |
| created_at | TIMESTAMP | NO | NOW() | Fecha de creación |
| updated_at | TIMESTAMP | NO | NOW() | Fecha de actualización |

#### Tabla: opportunities

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| id | SERIAL | NO | auto | Identificador único |
| title | VARCHAR(500) | NO | - | Título de la oportunidad |
| description | TEXT | NO | - | Descripción detallada |
| type_id | INTEGER | NO | - | FK a opportunity_types |
| publisher_id | INTEGER | NO | - | FK a users (publicador) |
| organization_name | VARCHAR(255) | YES | NULL | Nombre de organización |
| location | VARCHAR(255) | YES | NULL | Ubicación |
| modality | VARCHAR(50) | YES | NULL | presencial/remoto/híbrido |
| start_date | DATE | YES | NULL | Fecha de inicio |
| end_date | DATE | YES | NULL | Fecha de fin |
| application_deadline | DATE | YES | NULL | Fecha límite postulación |
| requirements | TEXT | YES | NULL | Requisitos |
| benefits | TEXT | YES | NULL | Beneficios |
| salary_range | VARCHAR(100) | YES | NULL | Rango salarial |
| vacancies | INTEGER | NO | 1 | Número de vacantes |
| status | VARCHAR(20) | NO | 'borrador' | Estado publicación |
| rejection_reason | TEXT | YES | NULL | Motivo de rechazo |
| is_featured | BOOLEAN | NO | false | Es destacada |
| views_count | INTEGER | NO | 0 | Contador de vistas |
| applications_count | INTEGER | NO | 0 | Contador de postulaciones |
| created_at | TIMESTAMP | NO | NOW() | Fecha de creación |
| updated_at | TIMESTAMP | NO | NOW() | Fecha de actualización |

#### Tabla: applications

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| id | SERIAL | NO | auto | Identificador único |
| user_id | INTEGER | NO | - | FK a users (postulante) |
| opportunity_id | INTEGER | NO | - | FK a opportunities |
| cover_letter | TEXT | YES | NULL | Carta de presentación |
| cv_url | VARCHAR(500) | YES | NULL | URL del CV usado |
| status | VARCHAR(30) | NO | 'pendiente' | Estado de postulación |
| publisher_notes | TEXT | YES | NULL | Notas del publicador |
| created_at | TIMESTAMP | NO | NOW() | Fecha de postulación |
| updated_at | TIMESTAMP | NO | NOW() | Fecha de actualización |

**Constraint:** UNIQUE(user_id, opportunity_id)

### 5.3 Índices

```sql
-- Índices para búsqueda de oportunidades
CREATE INDEX idx_opportunities_status ON opportunities(status);
CREATE INDEX idx_opportunities_type ON opportunities(type_id);
CREATE INDEX idx_opportunities_publisher ON opportunities(publisher_id);
CREATE INDEX idx_opportunities_deadline ON opportunities(application_deadline);
CREATE INDEX idx_opportunities_featured ON opportunities(is_featured) WHERE is_featured = true;

-- Índices para postulaciones
CREATE INDEX idx_applications_user ON applications(user_id);
CREATE INDEX idx_applications_opportunity ON applications(opportunity_id);
CREATE INDEX idx_applications_status ON applications(status);

-- Índices para usuarios
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_faculty ON users(faculty_id);

-- Índice de texto completo para búsqueda
CREATE INDEX idx_opportunities_search ON opportunities
USING gin(to_tsvector('spanish', title || ' ' || description));
```

### 5.4 Triggers

```sql
-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_opportunities_updated_at
    BEFORE UPDATE ON opportunities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
    BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para actualizar contador de postulaciones
CREATE OR REPLACE FUNCTION update_applications_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE opportunities SET applications_count = applications_count + 1
        WHERE id = NEW.opportunity_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE opportunities SET applications_count = applications_count - 1
        WHERE id = OLD.opportunity_id;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_applications_count
    AFTER INSERT OR DELETE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_applications_count();
```

### 5.5 Procedimientos de Backup

```bash
#!/bin/bash
# /opt/scripts/backup_db.sh

# Configuración
DB_NAME="oportuniapp_prod"
DB_USER="oportuniapp_prod"
BACKUP_DIR="/var/backups/postgresql"
DATE=$(date +%Y%m%d_%H%M%S)

# Crear backup
pg_dump -U $DB_USER -h localhost $DB_NAME | gzip > $BACKUP_DIR/oportuniapp_$DATE.sql.gz

# Eliminar backups antiguos (más de 30 días)
find $BACKUP_DIR -name "oportuniapp_*.sql.gz" -mtime +30 -delete

# Log
echo "$(date) - Backup completado: oportuniapp_$DATE.sql.gz" >> /var/log/backup.log
```

**Cron job para backups diarios:**
```bash
# crontab -e
0 2 * * * /opt/scripts/backup_db.sh
```

---

## 6. API REST

### 6.1 Convenciones

- **Base URL:** `/api`
- **Formato:** JSON
- **Autenticación:** Bearer Token (JWT)
- **Códigos HTTP:**
  - 200: OK
  - 201: Created
  - 400: Bad Request
  - 401: Unauthorized
  - 403: Forbidden
  - 404: Not Found
  - 500: Internal Server Error

### 6.2 Endpoints

#### Autenticación (`/api/auth`)

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| POST | /register | No | Registrar usuario |
| POST | /login | No | Iniciar sesión |
| GET | /me | Sí | Obtener usuario actual |
| POST | /forgot-password | No | Solicitar reset |
| POST | /reset-password | No | Resetear contraseña |
| PUT | /change-password | Sí | Cambiar contraseña |

**POST /api/auth/register**
```json
// Request
{
  "email": "juan.perez@uni.pe",
  "password": "SecurePass123!",
  "name": "Juan Pérez García"
}

// Response 201
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": 1,
    "email": "juan.perez@uni.pe",
    "name": "Juan Pérez García",
    "role": "user"
  }
}
```

**POST /api/auth/login**
```json
// Request
{
  "email": "juan.perez@uni.pe",
  "password": "SecurePass123!"
}

// Response 200
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "juan.perez@uni.pe",
    "name": "Juan Pérez García",
    "role": "user"
  }
}
```

#### Usuarios (`/api/users`)

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| GET | /profile | Sí | Obtener perfil |
| PUT | /profile | Sí | Actualizar perfil |
| POST | /profile/photo | Sí | Subir foto |
| POST | /profile/cv | Sí | Subir CV |
| GET | /notifications | Sí | Listar notificaciones |
| PUT | /notifications/:id/read | Sí | Marcar como leída |
| PUT | /notifications/read-all | Sí | Marcar todas leídas |

#### Oportunidades (`/api/opportunities`)

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| GET | / | No | Listar oportunidades |
| GET | /:id | No | Obtener detalle |
| GET | /featured | No | Destacadas |
| GET | /saved | Sí | Mis guardadas |
| POST | /:id/save | Sí | Guardar |
| DELETE | /:id/save | Sí | Quitar guardada |
| GET | /:id/similar | No | Similares |

**GET /api/opportunities**
```
Query params:
- page: número de página (default: 1)
- limit: items por página (default: 20)
- type: ID del tipo
- faculty: ID de facultad
- modality: presencial|remoto|hibrido
- search: texto de búsqueda
- status: activa|pendiente
```

```json
// Response 200
{
  "opportunities": [
    {
      "id": 1,
      "title": "Beca de Investigación CONCYTEC",
      "description": "Programa de becas para estudiantes...",
      "type_id": 1,
      "type_name": "Beca",
      "publisher_name": "OCBU UNI",
      "organization_name": "CONCYTEC",
      "location": "Lima, Perú",
      "modality": "presencial",
      "application_deadline": "2025-03-15",
      "status": "activa",
      "is_featured": true,
      "views_count": 150,
      "applications_count": 25,
      "created_at": "2025-01-10T10:00:00Z"
    }
  ],
  "total": 45,
  "page": 1,
  "totalPages": 3
}
```

#### Postulaciones (`/api/applications`)

| Método | Endpoint | Auth | Rol | Descripción |
|--------|----------|------|-----|-------------|
| POST | / | Sí | user | Crear postulación |
| GET | /my | Sí | user | Mis postulaciones |
| PUT | /:id/status | Sí | publisher | Cambiar estado |
| GET | /export/:oppId | Sí | publisher | Exportar CSV |

**POST /api/applications**
```json
// Request (multipart/form-data)
{
  "opportunity_id": 1,
  "cover_letter": "Me interesa esta oportunidad porque...",
  "cv": <file> // opcional si tiene CV en perfil
}

// Response 201
{
  "message": "Postulación enviada exitosamente",
  "application": {
    "id": 1,
    "opportunity_id": 1,
    "status": "pendiente",
    "created_at": "2025-01-15T10:00:00Z"
  }
}
```

#### Publicaciones (`/api/publications`)

| Método | Endpoint | Auth | Rol | Descripción |
|--------|----------|------|-----|-------------|
| POST | / | Sí | publisher | Crear publicación |
| GET | /my | Sí | publisher | Mis publicaciones |
| GET | /:id | Sí | publisher | Detalle |
| PUT | /:id | Sí | publisher | Editar |
| DELETE | /:id | Sí | publisher | Eliminar |
| GET | /:id/applications | Sí | publisher | Ver postulantes |

#### Administración (`/api/admin`)

| Método | Endpoint | Auth | Rol | Descripción |
|--------|----------|------|-----|-------------|
| GET | /dashboard | Sí | admin | Obtener KPIs |
| GET | /publications | Sí | admin | Todas las publicaciones |
| PUT | /publications/:id/status | Sí | admin | Moderar |
| GET | /external-accounts | Sí | admin | Cuentas externas |
| POST | /external-accounts | Sí | admin | Crear cuenta |
| PUT | /external-accounts/:id/status | Sí | admin | Aprobar/rechazar |
| GET | /reports | Sí | admin | Listar reportes |
| PUT | /reports/:id/status | Sí | admin | Gestionar reporte |

### 6.3 Middleware de Autenticación

```typescript
// middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database';

interface JwtPayload {
  userId: number;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    const result = await pool.query(
      'SELECT id, email, name, role FROM users WHERE id = $1 AND is_active = true',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    next();
  };
};
```

### 6.4 Manejo de Errores

```typescript
// Error handler centralizado
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  // Error de validación
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Error de validación',
      details: err.message
    });
  }

  // Error de base de datos
  if (err.name === 'DatabaseError') {
    return res.status(500).json({
      error: 'Error de base de datos'
    });
  }

  // Error genérico
  res.status(500).json({
    error: 'Error interno del servidor'
  });
});
```

---

## 7. FRONTEND

### 7.1 Estructura de Componentes

```
src/
├── components/
│   ├── common/           # Componentes reutilizables
│   │   ├── Header.tsx    # Navegación principal
│   │   ├── Footer.tsx    # Pie de página
│   │   ├── Modal.tsx     # Modal genérico
│   │   ├── Pagination.tsx # Paginación
│   │   └── MainLayout.tsx # Layout principal
│   │
│   ├── admin/            # Componentes de admin
│   │   └── AdminLayout.tsx
│   │
│   └── opportunities/    # Componentes de oportunidades
│       └── OpportunityCard.tsx
│
├── pages/               # Páginas (rutas)
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   └── ...
│
├── context/             # Estado global
│   └── AuthContext.tsx
│
├── services/            # Servicios API
│   └── api.ts
│
└── types/               # TypeScript types
    └── index.ts
```

### 7.2 Configuración de Rutas

```typescript
// App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({
  children,
  allowedRoles
}: {
  children: React.ReactNode;
  allowedRoles?: string[]
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/opportunities" element={<OpportunitiesPage />} />
        <Route path="/opportunities/:id" element={<OpportunityDetailPage />} />

        {/* Rutas protegidas - usuarios */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/my-applications" element={
          <ProtectedRoute>
            <MyApplicationsPage />
          </ProtectedRoute>
        } />

        {/* Rutas protegidas - publicadores */}
        <Route path="/my-publications" element={
          <ProtectedRoute allowedRoles={['publisher', 'admin']}>
            <MyPublicationsPage />
          </ProtectedRoute>
        } />

        {/* Rutas protegidas - admin */}
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminRoutes />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}
```

### 7.3 Servicio de API

```typescript
// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API de autenticación
export const authApi = {
  register: (data: RegisterData) => api.post('/auth/register', data),
  login: (data: LoginData) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  changePassword: (data: ChangePasswordData) => api.put('/auth/change-password', data),
};

// API de oportunidades
export const opportunityApi = {
  getAll: (params?: OpportunityFilters) => api.get('/opportunities', { params }),
  getById: (id: number) => api.get(`/opportunities/${id}`),
  getFeatured: () => api.get('/opportunities/featured'),
  getSaved: () => api.get('/opportunities/saved'),
  save: (id: number) => api.post(`/opportunities/${id}/save`),
  unsave: (id: number) => api.delete(`/opportunities/${id}/save`),
};

// ... más APIs

export default api;
```

### 7.4 Context de Autenticación

```typescript
// context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authApi.getMe();
          setUser(response.data);
        } catch {
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    localStorage.setItem('token', response.data.token);
    setUser(response.data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### 7.5 Configuración de Tailwind

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf2f4',
          100: '#fce7eb',
          200: '#f9d0d9',
          300: '#f4a9ba',
          400: '#ed7693',
          500: '#e04b70',
          600: '#c9285a',
          700: '#8B1538',  // Color principal UNI
          800: '#741834',
          900: '#63182f',
          950: '#380813',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### 7.6 Estilos Globales

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply font-sans text-gray-900 antialiased;
  }
}

@layer components {
  .btn {
    @apply inline-flex items-center justify-center px-4 py-2
           rounded-lg font-medium transition-colors duration-200
           focus:outline-none focus:ring-2 focus:ring-offset-2;
  }

  .btn-primary {
    @apply btn bg-primary-700 text-white
           hover:bg-primary-800
           focus:ring-primary-500;
  }

  .btn-outline {
    @apply btn border border-primary-700 text-primary-700
           hover:bg-primary-50
           focus:ring-primary-500;
  }

  .btn-danger {
    @apply btn bg-red-600 text-white
           hover:bg-red-700
           focus:ring-red-500;
  }

  .input {
    @apply w-full px-4 py-2 border border-gray-300 rounded-lg
           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
           disabled:bg-gray-100 disabled:cursor-not-allowed;
  }

  .label {
    @apply block text-sm font-medium text-gray-700 mb-1;
  }

  .card {
    @apply bg-white rounded-xl shadow-sm border border-gray-100 p-6;
  }

  .badge {
    @apply inline-flex items-center px-2.5 py-0.5 rounded-full
           text-xs font-medium;
  }

  .container-app {
    @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  }
}
```

---

## 8. SEGURIDAD

### 8.1 Autenticación y Autorización

#### JWT (JSON Web Tokens)

**Generación de token:**
```typescript
const token = jwt.sign(
  { userId: user.id },
  process.env.JWT_SECRET!,
  { expiresIn: process.env.JWT_EXPIRES_IN }
);
```

**Estructura del token:**
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": 1,
    "iat": 1700000000,
    "exp": 1700604800
  }
}
```

**Recomendaciones:**
- JWT_SECRET debe tener mínimo 256 bits (32 caracteres)
- Usar algoritmo HS256 o RS256
- Expiraciones cortas (7 días máximo)
- No almacenar datos sensibles en el payload

### 8.2 Hashing de Contraseñas

```typescript
import bcrypt from 'bcrypt';

// Hashear contraseña
const saltRounds = 12;
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Verificar contraseña
const isValid = await bcrypt.compare(password, hashedPassword);
```

**Políticas de contraseñas:**
- Mínimo 8 caracteres
- Al menos una mayúscula
- Al menos un número
- Al menos un carácter especial

### 8.3 Protección contra Ataques

#### SQL Injection
```typescript
// MALO - vulnerable
const query = `SELECT * FROM users WHERE email = '${email}'`;

// BUENO - queries parametrizadas
const query = 'SELECT * FROM users WHERE email = $1';
await pool.query(query, [email]);
```

#### XSS (Cross-Site Scripting)
```typescript
// Helmet para headers de seguridad
import helmet from 'helmet';
app.use(helmet());

// Content Security Policy
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:"],
  }
}));
```

#### CSRF (Cross-Site Request Forgery)
- Tokens CSRF en formularios
- SameSite cookies
- Validación de origen

#### Rate Limiting
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: 'Demasiadas solicitudes, intenta más tarde'
});

app.use('/api/', limiter);
```

### 8.4 Validación de Datos

```typescript
import { body, validationResult } from 'express-validator';

const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .custom(value => value.endsWith('@uni.pe'))
    .withMessage('Solo se permiten correos @uni.pe'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener mínimo 8 caracteres')
    .matches(/[A-Z]/)
    .withMessage('Debe contener al menos una mayúscula')
    .matches(/[0-9]/)
    .withMessage('Debe contener al menos un número'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ max: 255 })
    .withMessage('El nombre es muy largo'),
];

const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
```

### 8.5 Configuración HTTPS

```nginx
# Nginx SSL configuration
server {
    listen 443 ssl http2;

    ssl_certificate /etc/letsencrypt/live/domain/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/domain/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers on;

    # HSTS
    add_header Strict-Transport-Security "max-age=31536000" always;
}
```

---

## 9. MANTENIMIENTO

### 9.1 Logs del Sistema

#### Configuración de logs
```typescript
// Usando morgan para HTTP logs
import morgan from 'morgan';

// Desarrollo
app.use(morgan('dev'));

// Producción
app.use(morgan('combined', {
  stream: fs.createWriteStream('./logs/access.log', { flags: 'a' })
}));
```

#### Logs de aplicación
```typescript
// Logger personalizado
const logger = {
  info: (message: string, meta?: object) => {
    console.log(JSON.stringify({
      level: 'info',
      timestamp: new Date().toISOString(),
      message,
      ...meta
    }));
  },
  error: (message: string, error?: Error) => {
    console.error(JSON.stringify({
      level: 'error',
      timestamp: new Date().toISOString(),
      message,
      stack: error?.stack
    }));
  }
};
```

### 9.2 Monitoreo

#### PM2 para Node.js
```bash
# Ver estado de procesos
pm2 status

# Ver logs en tiempo real
pm2 logs oportuniapp-api

# Monitoreo detallado
pm2 monit

# Información del proceso
pm2 show oportuniapp-api
```

#### Monitoreo de PostgreSQL
```sql
-- Conexiones activas
SELECT * FROM pg_stat_activity WHERE datname = 'oportuniapp_prod';

-- Tamaño de tablas
SELECT relname, pg_size_pretty(pg_total_relation_size(relid))
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC;

-- Queries lentas
SELECT query, calls, mean_time, total_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

### 9.3 Actualizaciones

#### Proceso de actualización
```bash
# 1. Crear backup
pg_dump -U oportuniapp_prod oportuniapp_prod > backup_$(date +%Y%m%d).sql

# 2. Obtener cambios
cd /var/www/oportuniapp
git fetch origin
git pull origin main

# 3. Actualizar dependencias
cd backend && npm install --production
cd ../frontend && npm install

# 4. Compilar
cd ../backend && npm run build
cd ../frontend && npm run build

# 5. Reiniciar servicio
pm2 restart oportuniapp-api

# 6. Copiar frontend
cp -r frontend/dist/* /var/www/oportuniapp-static/

# 7. Verificar funcionamiento
curl -I https://api.oportuniapp.uni.pe/api/health
```

### 9.4 Troubleshooting

#### Problemas comunes

| Problema | Causa | Solución |
|----------|-------|----------|
| API no responde | Proceso caído | `pm2 restart oportuniapp-api` |
| Error 502 | Backend no disponible | Verificar logs PM2 |
| Error DB connection | Pool agotado | Aumentar conexiones o reiniciar |
| Uploads fallan | Permisos directorio | `chmod 755 uploads/` |
| JWT inválido | Secret cambiado | Verificar variable de entorno |

#### Verificación de salud
```bash
# API
curl http://localhost:3000/api/health

# Base de datos
psql -U oportuniapp_prod -c "SELECT 1"

# Nginx
nginx -t

# Espacio en disco
df -h

# Memoria
free -m

# Procesos Node
pm2 list
```

### 9.5 Limpieza de Datos

```sql
-- Eliminar notificaciones antiguas (más de 90 días)
DELETE FROM notifications
WHERE created_at < NOW() - INTERVAL '90 days'
AND is_read = true;

-- Eliminar logs de auditoría antiguos (más de 1 año)
DELETE FROM audit_log
WHERE created_at < NOW() - INTERVAL '1 year';

-- Vaciar archivos temporales
VACUUM ANALYZE;
```

---

## 10. ANEXOS

### 10.1 Scripts de Utilidad

#### Script de despliegue
```bash
#!/bin/bash
# deploy.sh

set -e

echo "=== Iniciando despliegue ==="

# Backup
pg_dump -U oportuniapp_prod oportuniapp_prod | gzip > /var/backups/pre_deploy_$(date +%Y%m%d_%H%M%S).sql.gz

# Pull cambios
cd /var/www/oportuniapp
git pull origin main

# Backend
cd backend
npm ci --production
npm run build
pm2 restart oportuniapp-api

# Frontend
cd ../frontend
npm ci
npm run build
cp -r dist/* /var/www/oportuniapp-static/

echo "=== Despliegue completado ==="
```

#### Script de monitoreo
```bash
#!/bin/bash
# health_check.sh

API_URL="https://api.oportuniapp.uni.pe/api/health"
ALERT_EMAIL="admin@uni.pe"

response=$(curl -s -o /dev/null -w "%{http_code}" $API_URL)

if [ $response -ne 200 ]; then
    echo "API no responde (HTTP $response)" | mail -s "ALERTA: OportUNI" $ALERT_EMAIL
    pm2 restart oportuniapp-api
fi
```

### 10.2 Configuración de Firewall

```bash
# UFW (Ubuntu)
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 10.3 Configuración de Logrotate

```
# /etc/logrotate.d/oportuniapp
/var/www/oportuniapp/backend/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    create 0640 www-data www-data
}
```

### 10.4 Comandos Útiles

```bash
# Ver logs en tiempo real
tail -f /var/log/nginx/error.log
pm2 logs oportuniapp-api --lines 100

# Verificar conexiones
netstat -tuln | grep -E '(3000|5432|80|443)'

# Uso de recursos por proceso
htop

# Consultas SQL activas
psql -U oportuniapp_prod -c "SELECT pid, query, state FROM pg_stat_activity WHERE datname = 'oportuniapp_prod'"

# Reinicio de servicios
sudo systemctl restart nginx
sudo systemctl restart postgresql
pm2 restart all
```

### 10.5 Checklist de Despliegue

- [ ] Backup de base de datos realizado
- [ ] Variables de entorno configuradas
- [ ] Certificados SSL válidos
- [ ] Permisos de directorios correctos
- [ ] Migraciones de base de datos ejecutadas
- [ ] Tests pasando
- [ ] Build de frontend exitoso
- [ ] PM2 configurado
- [ ] Nginx configurado
- [ ] Firewall configurado
- [ ] Monitoreo activo
- [ ] Backup automático configurado

---

**OportUNI - Manual Técnico v1.0**

*Universidad Nacional de Ingeniería*
*Noviembre 2025*
