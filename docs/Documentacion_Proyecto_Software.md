# DOCUMENTACIÓN DEL PROYECTO DE SOFTWARE

## OPORTUNIDADES ACADÉMICAS Y PROFESIONALES PARA ESTUDIANTES UNI (OportUNI)

---

**UNIVERSIDAD NACIONAL DE INGENIERÍA**
**Facultad de Ingeniería Industrial y de Sistemas**
**Escuela Profesional de Ingeniería de Sistemas**

---

**Curso:** Ingeniería de Software (SI707V)
**Grupo:** 6
**Docente:** ING. COSSA CABANILLAS JESUS ALBERTO

**Integrantes:**
| Apellidos y Nombres | Código |
|---------------------|--------|
| Muñoz Cruz Melannie Cristina | 20220402E |
| Orosco Montalvan Sebastian Eduardo | 20221187K |
| Nuñez Rivas Alvaro Fabricio | 20221152B |
| Huayhualla Barboza Joseph Edgar | 20210245D |

**Fecha:** Noviembre 2025

---

## ÍNDICE

1. [Información General del Proyecto](#1-información-general-del-proyecto)
2. [Planificación del Proyecto](#2-planificación-del-proyecto)
3. [Análisis del Sistema](#3-análisis-del-sistema)
4. [Diseño del Sistema](#4-diseño-del-sistema)
5. [Implementación](#5-implementación)
6. [Pruebas](#6-pruebas)
7. [Despliegue](#7-despliegue)
8. [Anexos](#8-anexos)

---

## 1. INFORMACIÓN GENERAL DEL PROYECTO

### 1.1 Nombre del Proyecto
**OportUNI** - Sistema de Gestión de Oportunidades Académicas y Profesionales para Estudiantes de la Universidad Nacional de Ingeniería

### 1.2 Descripción del Proyecto
OportUNI es una plataforma web integral diseñada para centralizar y gestionar todas las oportunidades académicas y profesionales disponibles para los estudiantes y egresados de la Universidad Nacional de Ingeniería (UNI). El sistema resuelve la problemática de la dispersión de información sobre convocatorias, becas, prácticas, empleos y eventos académicos que actualmente se encuentran fragmentados en múltiples canales de comunicación.

### 1.3 Problemática
Los estudiantes de la UNI enfrentan dificultades para acceder a información actualizada sobre oportunidades debido a:
- Información dispersa en múltiples plataformas (redes sociales, correos, páginas web)
- Falta de un canal oficial centralizado
- Pérdida de oportunidades por desconocimiento
- Dificultad para que las organizaciones lleguen al público objetivo
- Ausencia de un sistema de gestión de postulaciones

### 1.4 Justificación
El desarrollo de OportUNI se justifica por:
- **Necesidad institucional:** La UNI requiere un canal oficial para difundir oportunidades
- **Demanda estudiantil:** Los estudiantes necesitan acceso rápido y organizado a convocatorias
- **Eficiencia administrativa:** Optimización de procesos de la OCBU
- **Vinculación universidad-empresa:** Facilitar la conexión con el sector productivo

### 1.5 Objetivos

#### 1.5.1 Objetivo General
Desarrollar una plataforma web que centralice la gestión y difusión de oportunidades académicas y profesionales para la comunidad universitaria de la UNI.

#### 1.5.2 Objetivos Específicos
1. Implementar un sistema de registro y autenticación mediante correo institucional
2. Desarrollar un catálogo de oportunidades con filtros avanzados de búsqueda
3. Crear un módulo de gestión de postulaciones para estudiantes
4. Implementar un panel de administración para la OCBU
5. Desarrollar un módulo de publicación para organizaciones externas
6. Integrar un sistema de notificaciones y alertas personalizadas

### 1.6 Alcance del Proyecto

#### Incluido:
- Sistema de autenticación con correo @uni.pe
- Catálogo de oportunidades con búsqueda y filtros
- Gestión de postulaciones en línea
- Panel de administración (OCBU)
- Portal de publicadores externos
- Sistema de notificaciones
- Reportes y estadísticas
- Diseño responsive (web y móvil)

#### No Incluido:
- Integración con sistema académico DIRCE
- Aplicación móvil nativa
- Procesamiento de pagos
- Chat en tiempo real

### 1.7 Stakeholders

| Stakeholder | Rol | Interés |
|-------------|-----|---------|
| OCBU | Administrador | Gestionar y moderar todas las publicaciones |
| Estudiantes UNI | Usuario final | Acceder y postular a oportunidades |
| Egresados UNI | Usuario final | Acceder a ofertas laborales |
| Docentes UNI | Publicador | Difundir oportunidades académicas |
| Empresas | Publicador externo | Publicar ofertas de empleo/prácticas |
| ONGs | Publicador externo | Publicar voluntariados y proyectos |

---

## 2. PLANIFICACIÓN DEL PROYECTO

### 2.1 Metodología de Desarrollo
Se utilizó la metodología **Agile Scrum** adaptada al contexto académico, con sprints de 2 semanas y entregas incrementales.

### 2.2 Cronograma del Proyecto

| Fase | Actividad | Duración | Entregable |
|------|-----------|----------|------------|
| Fase 1 | Análisis de requisitos | 2 semanas | Documento de análisis |
| Fase 2 | Diseño del sistema | 2 semanas | Arquitectura y prototipos |
| Fase 3 | Desarrollo Backend | 3 semanas | API REST funcional |
| Fase 4 | Desarrollo Frontend | 3 semanas | Interfaz de usuario |
| Fase 5 | Integración y pruebas | 2 semanas | Sistema integrado |
| Fase 6 | Documentación | 1 semana | Manuales y documentación |

### 2.3 Equipo del Proyecto

| Integrante | Rol Principal | Responsabilidades |
|------------|---------------|-------------------|
| Muñoz Cruz Melannie | Product Owner / Frontend | Definición de requisitos, UI/UX |
| Orosco Montalvan Sebastian | Scrum Master / Backend | Coordinación, APIs |
| Nuñez Rivas Alvaro | Dev Backend / DBA | Base de datos, servicios |
| Huayhualla Barboza Joseph | Dev Full Stack | Integración, testing |

### 2.4 Herramientas Utilizadas

| Categoría | Herramienta |
|-----------|-------------|
| Gestión de proyecto | Trello, Discord |
| Control de versiones | Git, GitHub |
| Diseño UI/UX | Figma |
| IDE | Visual Studio Code |
| Base de datos | PostgreSQL, pgAdmin |
| Testing | Jest, Postman |
| Documentación | Markdown, Draw.io |

---

## 3. ANÁLISIS DEL SISTEMA

### 3.1 Requerimientos Funcionales

#### RF01 - Registro de Usuario
- **Descripción:** El sistema debe permitir el registro de nuevos usuarios mediante correo institucional @uni.pe
- **Prioridad:** Alta
- **Actor:** Usuario no registrado
- **Precondición:** Ninguna
- **Flujo principal:**
  1. Usuario accede al formulario de registro
  2. Ingresa datos personales y correo @uni.pe
  3. Sistema valida el dominio del correo
  4. Sistema envía correo de verificación
  5. Usuario confirma su cuenta

#### RF02 - Inicio de Sesión
- **Descripción:** El sistema debe permitir a usuarios registrados iniciar sesión
- **Prioridad:** Alta
- **Actor:** Usuario registrado
- **Validaciones:** Correo y contraseña válidos

#### RF03 - Gestión de Perfil
- **Descripción:** El usuario debe poder gestionar su información personal
- **Prioridad:** Alta
- **Funcionalidades:**
  - Editar datos personales
  - Subir foto de perfil
  - Subir CV (PDF, máx. 5MB)
  - Agregar habilidades e idiomas
  - Configurar intereses y preferencias

#### RF04 - Catálogo de Oportunidades
- **Descripción:** Visualizar listado de oportunidades con filtros
- **Prioridad:** Alta
- **Filtros disponibles:**
  - Por tipo (beca, práctica, empleo, etc.)
  - Por facultad/escuela
  - Por fecha de publicación
  - Por modalidad (presencial, remoto, híbrido)
  - Búsqueda por texto

#### RF05 - Detalle de Oportunidad
- **Descripción:** Ver información completa de una oportunidad
- **Prioridad:** Alta
- **Información mostrada:**
  - Título y descripción
  - Requisitos
  - Beneficios
  - Fecha límite
  - Información del publicador
  - Oportunidades similares

#### RF06 - Guardar Oportunidades
- **Descripción:** Guardar oportunidades de interés para consulta posterior
- **Prioridad:** Media

#### RF07 - Postulación a Oportunidades
- **Descripción:** Enviar postulación a una oportunidad
- **Prioridad:** Alta
- **Campos:**
  - Carta de presentación
  - CV (adjunto o del perfil)
  - Documentos adicionales opcionales

#### RF08 - Seguimiento de Postulaciones
- **Descripción:** Ver historial y estado de postulaciones
- **Prioridad:** Alta
- **Estados:** Pendiente, En revisión, Preseleccionado, Aceptado, Rechazado

#### RF09 - Notificaciones
- **Descripción:** Recibir alertas sobre oportunidades y postulaciones
- **Prioridad:** Media
- **Tipos:**
  - Nuevas oportunidades según intereses
  - Cambios en estado de postulación
  - Recordatorios de fecha límite

#### RF10 - Publicación de Oportunidades
- **Descripción:** Crear y publicar nuevas oportunidades
- **Prioridad:** Alta
- **Actores:** Docentes, Organizaciones externas, OCBU
- **Campos obligatorios:**
  - Título, descripción, tipo
  - Requisitos, beneficios
  - Fechas de inicio y cierre
  - Información de contacto

#### RF11 - Gestión de Publicaciones Propias
- **Descripción:** Editar, pausar o eliminar publicaciones
- **Prioridad:** Alta

#### RF12 - Visualización de Postulantes
- **Descripción:** Ver listado de postulantes a las oportunidades propias
- **Prioridad:** Alta
- **Funcionalidades:**
  - Ver perfil del postulante
  - Descargar CV
  - Cambiar estado de postulación
  - Exportar listado (CSV)

#### RF13 - Registro de Cuenta Externa
- **Descripción:** Organizaciones externas pueden solicitar cuenta
- **Prioridad:** Media
- **Datos requeridos:**
  - Nombre de organización
  - RUC
  - Representante legal
  - Documentación de respaldo

#### RF14 - Panel de Administración
- **Descripción:** Dashboard con métricas del sistema
- **Prioridad:** Alta
- **Métricas:**
  - Total de oportunidades activas
  - Postulaciones del mes
  - Reportes pendientes
  - Cuentas por aprobar

#### RF15 - Moderación de Publicaciones
- **Descripción:** OCBU aprueba/rechaza publicaciones
- **Prioridad:** Alta
- **Flujo:**
  - Nueva publicación queda en estado "pendiente"
  - Admin revisa y aprueba o rechaza con motivo
  - Se notifica al publicador

#### RF16 - Gestión de Cuentas Externas
- **Descripción:** Aprobar/rechazar solicitudes de organizaciones
- **Prioridad:** Media

#### RF17 - Sistema de Reportes
- **Descripción:** Usuarios pueden reportar publicaciones inapropiadas
- **Prioridad:** Media
- **Razones:**
  - Contenido inapropiado
  - Información falsa
  - Spam
  - Discriminación

#### RF18 - Gestión de Reportes
- **Descripción:** Admin revisa y toma acción sobre reportes
- **Prioridad:** Media
- **Acciones:**
  - Descartar reporte
  - Suspender publicación
  - Suspender cuenta

#### RF19-RF33 - Funcionalidades Adicionales
- Recuperación de contraseña
- Cambio de contraseña
- Cierre de sesión
- Oportunidades destacadas
- Oportunidades similares
- Historial de actividad
- Exportación de datos
- Configuración de notificaciones
- Página de ayuda/FAQ
- Términos y condiciones
- Accesibilidad (responsive design)
- Multiidioma (español/inglés)
- Integración con redes sociales
- Log de auditoría
- Backup automático

### 3.2 Requerimientos No Funcionales

| ID | Categoría | Descripción |
|----|-----------|-------------|
| RNF01 | Rendimiento | Tiempo de carga < 3 segundos |
| RNF02 | Rendimiento | Soporte para 500+ usuarios concurrentes |
| RNF03 | Seguridad | Cifrado HTTPS/TLS |
| RNF04 | Seguridad | Protección contra SQL Injection y XSS |
| RNF05 | Seguridad | Contraseñas hasheadas con bcrypt |
| RNF06 | Usabilidad | Diseño responsive (móvil, tablet, desktop) |
| RNF07 | Usabilidad | Interfaz intuitiva (máx. 3 clics) |
| RNF08 | Disponibilidad | Uptime 99.5% |
| RNF09 | Compatibilidad | Chrome, Firefox, Safari, Edge |
| RNF10 | Mantenibilidad | Código documentado y modular |
| RNF11 | Escalabilidad | Arquitectura preparada para crecimiento |
| RNF12 | Backup | Respaldos diarios de base de datos |

### 3.3 Casos de Uso

#### CU01 - Registrar Usuario
```
Actor: Usuario no registrado
Precondición: Ninguna
Flujo Principal:
1. Usuario accede a "Registrarse"
2. Sistema muestra formulario de registro
3. Usuario completa datos (nombre, correo @uni.pe, contraseña)
4. Sistema valida datos
5. Sistema crea cuenta y envía verificación
6. Usuario confirma correo
7. Sistema activa cuenta
Flujo Alternativo:
4a. Correo no es @uni.pe: Sistema rechaza registro
4b. Correo ya registrado: Sistema muestra error
Postcondición: Usuario registrado y activo
```

#### CU02 - Buscar Oportunidad
```
Actor: Usuario (registrado o visitante)
Precondición: Ninguna
Flujo Principal:
1. Usuario accede al catálogo
2. Sistema muestra listado paginado
3. Usuario aplica filtros o busca por texto
4. Sistema actualiza resultados
5. Usuario selecciona oportunidad
6. Sistema muestra detalle
Postcondición: Usuario visualiza oportunidad
```

#### CU03 - Postular a Oportunidad
```
Actor: Usuario registrado
Precondición: Usuario autenticado, oportunidad activa
Flujo Principal:
1. Usuario visualiza detalle de oportunidad
2. Usuario hace clic en "Postular"
3. Sistema muestra formulario de postulación
4. Usuario completa carta de presentación
5. Usuario adjunta CV (opcional si ya tiene en perfil)
6. Usuario confirma postulación
7. Sistema registra postulación
8. Sistema notifica al publicador
Flujo Alternativo:
6a. Usuario ya postuló: Sistema muestra error
6b. Fecha límite vencida: Sistema no permite postular
Postcondición: Postulación registrada
```

#### CU04 - Publicar Oportunidad
```
Actor: Publicador (docente, organización, admin)
Precondición: Usuario autenticado con rol publicador
Flujo Principal:
1. Publicador accede a "Nueva Publicación"
2. Sistema muestra formulario
3. Publicador completa información
4. Publicador envía para revisión
5. Sistema registra como "pendiente"
6. Admin revisa y aprueba
7. Sistema publica oportunidad
Flujo Alternativo:
6a. Admin rechaza: Sistema notifica motivo
Postcondición: Oportunidad publicada
```

#### CU05 - Gestionar Postulantes
```
Actor: Publicador
Precondición: Publicación activa con postulantes
Flujo Principal:
1. Publicador accede a sus publicaciones
2. Selecciona oportunidad
3. Sistema muestra listado de postulantes
4. Publicador revisa perfil y CV
5. Publicador cambia estado (en revisión, preseleccionado, etc.)
6. Sistema notifica al postulante
Postcondición: Estados actualizados
```

### 3.4 Diagrama de Casos de Uso

```
                        ┌─────────────────────────────────────────┐
                        │           SISTEMA OPORTUNIAPP           │
                        │                                         │
    ┌───────┐          │  ┌──────────────────────────────────┐   │
    │Usuario│──────────┼──│ CU01: Registrar Usuario          │   │
    │  No   │          │  └──────────────────────────────────┘   │
    │Regist.│          │  ┌──────────────────────────────────┐   │
    └───────┘          │  │ CU02: Buscar Oportunidad         │   │
                       │  └──────────────────────────────────┘   │
    ┌───────┐          │  ┌──────────────────────────────────┐   │
    │Usuario│──────────┼──│ CU03: Postular a Oportunidad     │   │
    │Regist.│          │  └──────────────────────────────────┘   │
    └───────┘          │  ┌──────────────────────────────────┐   │
        │              │  │ CU06: Gestionar Perfil           │   │
        │              │  └──────────────────────────────────┘   │
        │              │  ┌──────────────────────────────────┐   │
        │              │  │ CU07: Ver Mis Postulaciones      │   │
        │              │  └──────────────────────────────────┘   │
        │              │  ┌──────────────────────────────────┐   │
        │              │  │ CU08: Guardar Oportunidad        │   │
        │              │  └──────────────────────────────────┘   │
        │              │  ┌──────────────────────────────────┐   │
        │              │  │ CU09: Reportar Publicación       │   │
        │              │  └──────────────────────────────────┘   │
                       │                                         │
    ┌───────┐          │  ┌──────────────────────────────────┐   │
    │Publica│──────────┼──│ CU04: Publicar Oportunidad       │   │
    │  dor  │          │  └──────────────────────────────────┘   │
    └───────┘          │  ┌──────────────────────────────────┐   │
        │              │  │ CU05: Gestionar Postulantes      │   │
        │              │  └──────────────────────────────────┘   │
        │              │  ┌──────────────────────────────────┐   │
        │              │  │ CU10: Gestionar Publicaciones    │   │
        │              │  └──────────────────────────────────┘   │
                       │                                         │
    ┌───────┐          │  ┌──────────────────────────────────┐   │
    │ Admin │──────────┼──│ CU11: Moderar Publicaciones      │   │
    │(OCBU) │          │  └──────────────────────────────────┘   │
    └───────┘          │  ┌──────────────────────────────────┐   │
        │              │  │ CU12: Gestionar Cuentas Externas │   │
        │              │  └──────────────────────────────────┘   │
        │              │  ┌──────────────────────────────────┐   │
        │              │  │ CU13: Gestionar Reportes         │   │
        │              │  └──────────────────────────────────┘   │
        │              │  ┌──────────────────────────────────┐   │
        │              │  │ CU14: Ver Dashboard              │   │
        │              │  └──────────────────────────────────┘   │
                       │                                         │
                       └─────────────────────────────────────────┘
```

### 3.5 Modelo de Dominio

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Usuario   │     │ Oportunidad │     │ Postulación │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ id          │     │ id          │     │ id          │
│ nombre      │     │ título      │     │ usuario_id  │
│ email       │     │ descripción │     │ oport_id    │
│ contraseña  │     │ tipo_id     │     │ estado      │
│ rol         │     │ publicador  │     │ carta       │
│ facultad_id │     │ fecha_inicio│     │ cv_url      │
│ escuela_id  │     │ fecha_cierre│     │ created_at  │
│ cv_url      │     │ requisitos  │     └──────┬──────┘
│ foto_url    │     │ beneficios  │            │
└──────┬──────┘     │ estado      │            │
       │            └──────┬──────┘            │
       │                   │                   │
       │    ┌──────────────┴───────────────┐   │
       │    │                              │   │
       ▼    ▼                              ▼   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Facultad   │     │TipoOportun. │     │  Reporte    │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ id          │     │ id          │     │ id          │
│ nombre      │     │ nombre      │     │ oport_id    │
│ código      │     │ descripción │     │ usuario_id  │
└─────────────┘     │ icono       │     │ razón       │
       │            └─────────────┘     │ estado      │
       ▼                                └─────────────┘
┌─────────────┐     ┌─────────────┐
│   Escuela   │     │ Notificación│
├─────────────┤     ├─────────────┤
│ id          │     │ id          │
│ nombre      │     │ usuario_id  │
│ facultad_id │     │ tipo        │
└─────────────┘     │ mensaje     │
                    │ leída       │
                    └─────────────┘
```

---

## 4. DISEÑO DEL SISTEMA

### 4.1 Arquitectura del Sistema

Se implementó una arquitectura de **3 capas** con separación cliente-servidor:

```
┌─────────────────────────────────────────────────────────────────┐
│                    CAPA DE PRESENTACIÓN                         │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                   FRONTEND (React)                        │ │
│  │  • React 18 + TypeScript                                  │ │
│  │  • Vite (bundler)                                        │ │
│  │  • Tailwind CSS (estilos)                                │ │
│  │  • React Router (navegación)                              │ │
│  │  • React Query (estado servidor)                          │ │
│  │  • React Hook Form (formularios)                          │ │
│  │  • Recharts (gráficos)                                   │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST (JSON)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CAPA DE NEGOCIO                              │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                   BACKEND (Node.js)                       │ │
│  │  • Express.js (framework)                                 │ │
│  │  • TypeScript                                             │ │
│  │  • JWT (autenticación)                                    │ │
│  │  • bcrypt (cifrado)                                       │ │
│  │  • Multer (uploads)                                       │ │
│  │  • express-validator (validación)                         │ │
│  └───────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                   API REST                                │ │
│  │  /api/auth     - Autenticación                           │ │
│  │  /api/users    - Gestión de usuarios                     │ │
│  │  /api/opportunities - Catálogo                           │ │
│  │  /api/applications - Postulaciones                        │ │
│  │  /api/publications - Publicaciones                        │ │
│  │  /api/admin    - Administración                          │ │
│  │  /api/catalogs - Catálogos                               │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ SQL (pg driver)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CAPA DE DATOS                                │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                   PostgreSQL                              │ │
│  │  • 15+ tablas relacionadas                               │ │
│  │  • Triggers para timestamps                               │ │
│  │  • Índices para rendimiento                              │ │
│  │  • Seed data inicial                                     │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────────────┐
│                           FRONTEND                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐│
│  │   Pages     │  │ Components  │  │  Services   │  │   Context   ││
│  ├─────────────┤  ├─────────────┤  ├─────────────┤  ├─────────────┤│
│  │ HomePage    │  │ Header      │  │ api.ts      │  │ AuthContext ││
│  │ LoginPage   │  │ Footer      │  │ (axios)     │  │             ││
│  │ RegisterPage│  │ Modal       │  │             │  │             ││
│  │ Opportunit..│  │ Pagination  │  │             │  │             ││
│  │ ProfilePage │  │ OpportCard  │  │             │  │             ││
│  │ AdminPages  │  │ AdminLayout │  │             │  │             ││
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘│
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                           BACKEND                                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐│
│  │   Routes    │  │ Controllers │  │ Middlewares │  │   Config    ││
│  ├─────────────┤  ├─────────────┤  ├─────────────┤  ├─────────────┤│
│  │ auth.routes │  │ auth.ctrl   │  │ auth.mid    │  │ database.ts ││
│  │ user.routes │  │ user.ctrl   │  │ validate    │  │ multer.ts   ││
│  │ opportunity │  │ opportunity │  │             │  │             ││
│  │ application │  │ application │  │             │  │             ││
│  │ publication │  │ publication │  │             │  │             ││
│  │ admin.routes│  │ admin.ctrl  │  │             │  │             ││
│  │ catalog     │  │ catalog.ctrl│  │             │  │             ││
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

### 4.3 Modelo de Base de Datos

#### Diagrama Entidad-Relación

```
┌────────────────┐       ┌────────────────┐       ┌────────────────┐
│   faculties    │       │    schools     │       │     users      │
├────────────────┤       ├────────────────┤       ├────────────────┤
│ PK id          │◄──┐   │ PK id          │◄──┐   │ PK id          │
│    name        │   │   │ FK faculty_id  │───┘   │ FK faculty_id  │───┐
│    code        │   │   │    name        │       │ FK school_id   │───┤
│    created_at  │   │   │    created_at  │       │    email       │   │
└────────────────┘   │   └────────────────┘       │    password    │   │
                     │                            │    name        │   │
                     └────────────────────────────│    role        │   │
                                                  │    student_code│   │
┌────────────────┐       ┌────────────────┐       │    cv_url      │   │
│opportunity_types│      │  opportunities │       │    photo_url   │   │
├────────────────┤       ├────────────────┤       │    is_active   │   │
│ PK id          │◄──┐   │ PK id          │◄──┬───│    created_at  │   │
│    name        │   │   │ FK type_id     │───┘   └────────┬───────┘   │
│    description │   │   │ FK publisher_id│────────────────┘           │
│    icon        │   │   │    title       │                            │
│    color       │   │   │    description │       ┌────────────────┐   │
└────────────────┘   │   │    status      │       │  applications  │   │
                     │   │    start_date  │       ├────────────────┤   │
                     │   │    end_date    │◄──┐   │ PK id          │   │
                     │   │    requirements│   │   │ FK user_id     │───┤
                     │   │    benefits    │   │   │ FK opportun_id │───┘
                     │   │    is_featured │   │   │    status      │
                     │   │    views       │   │   │    cover_letter│
                     │   │    applications│   │   │    cv_url      │
                     │   └────────────────┘   │   │    created_at  │
                     │                        │   └────────────────┘
┌────────────────┐   │   ┌────────────────┐   │
│     skills     │   │   │    reports     │   │   ┌────────────────┐
├────────────────┤   │   ├────────────────┤   │   │  saved_opps    │
│ PK id          │   │   │ PK id          │   │   ├────────────────┤
│    name        │   │   │ FK opportun_id │───┘   │ PK id          │
│    category    │   │   │ FK reporter_id │       │ FK user_id     │
└────────────────┘   │   │    reason      │       │ FK opportun_id │
                     │   │    status      │       │    created_at  │
┌────────────────┐   │   │    admin_notes │       └────────────────┘
│   languages    │   │   └────────────────┘
├────────────────┤   │                            ┌────────────────┐
│ PK id          │   │   ┌────────────────┐       │ notifications  │
│    name        │   │   │external_accounts│      ├────────────────┤
│    code        │   │   ├────────────────┤       │ PK id          │
└────────────────┘   │   │ PK id          │       │ FK user_id     │
                     │   │ FK user_id     │       │    type        │
┌────────────────┐   │   │    org_name    │       │    title       │
│   interests    │   │   │    ruc         │       │    message     │
├────────────────┤   │   │    entity_type │       │    is_read     │
│ PK id          │   │   │    status      │       │    created_at  │
│    name        │   │   │    created_at  │       └────────────────┘
│    category    │   │   └────────────────┘
└────────────────┘   │                            ┌────────────────┐
                     │                            │   audit_log    │
┌────────────────┐   │                            ├────────────────┤
│  user_skills   │   │                            │ PK id          │
├────────────────┤   │                            │ FK user_id     │
│ PK id          │   │                            │    action      │
│ FK user_id     │   │                            │    entity_type │
│ FK skill_id    │   │                            │    entity_id   │
│    level       │   │                            │    details     │
└────────────────┘   │                            │    ip_address  │
                     │                            │    created_at  │
                     │                            └────────────────┘
```

#### Tablas Principales

**users** - Usuarios del sistema
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    student_code VARCHAR(20),
    faculty_id INTEGER REFERENCES faculties(id),
    school_id INTEGER REFERENCES schools(id),
    cycle INTEGER,
    phone VARCHAR(20),
    bio TEXT,
    linkedin_url VARCHAR(500),
    cv_url VARCHAR(500),
    profile_photo_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**opportunities** - Oportunidades publicadas
```sql
CREATE TABLE opportunities (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    type_id INTEGER REFERENCES opportunity_types(id),
    publisher_id INTEGER REFERENCES users(id),
    organization_name VARCHAR(255),
    location VARCHAR(255),
    modality VARCHAR(50),
    start_date DATE,
    end_date DATE,
    application_deadline DATE,
    requirements TEXT,
    benefits TEXT,
    salary_range VARCHAR(100),
    vacancies INTEGER DEFAULT 1,
    status VARCHAR(20) DEFAULT 'borrador',
    rejection_reason TEXT,
    is_featured BOOLEAN DEFAULT false,
    views_count INTEGER DEFAULT 0,
    applications_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**applications** - Postulaciones
```sql
CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    opportunity_id INTEGER REFERENCES opportunities(id),
    cover_letter TEXT,
    cv_url VARCHAR(500),
    status VARCHAR(30) DEFAULT 'pendiente',
    publisher_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, opportunity_id)
);
```

### 4.4 Diseño de API REST

#### Endpoints Principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| **Autenticación** |||
| POST | /api/auth/register | Registro de usuario |
| POST | /api/auth/login | Inicio de sesión |
| GET | /api/auth/me | Obtener usuario actual |
| POST | /api/auth/forgot-password | Recuperar contraseña |
| PUT | /api/auth/change-password | Cambiar contraseña |
| **Usuarios** |||
| GET | /api/users/profile | Obtener perfil |
| PUT | /api/users/profile | Actualizar perfil |
| POST | /api/users/profile/photo | Subir foto |
| POST | /api/users/profile/cv | Subir CV |
| GET | /api/users/notifications | Listar notificaciones |
| PUT | /api/users/notifications/:id/read | Marcar como leída |
| **Oportunidades** |||
| GET | /api/opportunities | Listar (con filtros) |
| GET | /api/opportunities/:id | Obtener detalle |
| GET | /api/opportunities/featured | Destacadas |
| POST | /api/opportunities/:id/save | Guardar |
| DELETE | /api/opportunities/:id/save | Quitar guardada |
| GET | /api/opportunities/saved | Mis guardadas |
| **Postulaciones** |||
| POST | /api/applications | Crear postulación |
| GET | /api/applications/my | Mis postulaciones |
| PUT | /api/applications/:id/status | Cambiar estado |
| GET | /api/applications/export/:oppId | Exportar CSV |
| **Publicaciones** |||
| POST | /api/publications | Crear publicación |
| GET | /api/publications/my | Mis publicaciones |
| PUT | /api/publications/:id | Editar publicación |
| DELETE | /api/publications/:id | Eliminar |
| GET | /api/publications/:id/applications | Ver postulantes |
| **Administración** |||
| GET | /api/admin/dashboard | Dashboard KPIs |
| GET | /api/admin/publications | Todas las publicaciones |
| PUT | /api/admin/publications/:id/status | Moderar |
| GET | /api/admin/external-accounts | Cuentas externas |
| PUT | /api/admin/external-accounts/:id/status | Aprobar/rechazar |
| GET | /api/admin/reports | Reportes |
| PUT | /api/admin/reports/:id/status | Gestionar reporte |

#### Ejemplo de Response

**GET /api/opportunities**
```json
{
  "opportunities": [
    {
      "id": 1,
      "title": "Beca de Investigación CONCYTEC",
      "description": "Programa de becas...",
      "type_id": 1,
      "type_name": "Beca",
      "publisher_name": "OCBU",
      "organization_name": "CONCYTEC",
      "location": "Lima",
      "modality": "presencial",
      "application_deadline": "2025-03-15",
      "status": "activa",
      "is_featured": true,
      "created_at": "2025-01-15T10:00:00Z"
    }
  ],
  "total": 50,
  "page": 1,
  "totalPages": 5
}
```

### 4.5 Diseño de Interfaz de Usuario

#### Paleta de Colores

| Color | Hex | Uso |
|-------|-----|-----|
| Rojo UNI (Primary) | #8B1538 | Encabezados, botones principales, acentos |
| Rojo claro | #B91C1C | Hover states |
| Beige | #F5F5DC | Fondos secundarios |
| Blanco | #FFFFFF | Fondos principales |
| Gris oscuro | #374151 | Texto principal |
| Gris medio | #6B7280 | Texto secundario |
| Gris claro | #F3F4F6 | Bordes, separadores |

#### Tipografía

- **Fuente principal:** Inter (sans-serif)
- **Títulos:** 600-700 weight
- **Cuerpo:** 400-500 weight
- **Tamaños:** 14px (body), 16px (large), 24px (h2), 32px (h1)

#### Componentes UI

1. **Botones**
   - Primary: Fondo rojo UNI, texto blanco
   - Secondary/Outline: Borde rojo UNI, fondo transparente
   - Danger: Fondo rojo error
   - Disabled: Gris con opacidad reducida

2. **Cards**
   - Fondo blanco
   - Sombra suave (shadow-sm)
   - Borde redondeado (rounded-xl)
   - Padding consistente

3. **Formularios**
   - Inputs con borde gris
   - Focus: borde rojo UNI
   - Labels en gris oscuro
   - Mensajes de error en rojo

4. **Navegación**
   - Header fijo con logo UNI
   - Menú responsive (hamburger en móvil)
   - Breadcrumbs para navegación profunda

#### Wireframes Principales

**Página de Inicio**
```
┌────────────────────────────────────────────────┐
│  HEADER: Logo | Nav | Search | Login/Profile  │
├────────────────────────────────────────────────┤
│                                                │
│     HERO SECTION                               │
│     "Descubre tu próxima oportunidad"          │
│     [Buscar]                                   │
│                                                │
├────────────────────────────────────────────────┤
│  CATEGORÍAS                                    │
│  [Becas] [Prácticas] [Empleos] [Eventos]      │
├────────────────────────────────────────────────┤
│  OPORTUNIDADES DESTACADAS                      │
│  ┌────────┐ ┌────────┐ ┌────────┐            │
│  │ Card 1 │ │ Card 2 │ │ Card 3 │            │
│  └────────┘ └────────┘ └────────┘            │
├────────────────────────────────────────────────┤
│  ESTADÍSTICAS                                  │
│  [150 Oportunidades] [50 Empresas] [500 Est.] │
├────────────────────────────────────────────────┤
│  FOOTER                                        │
└────────────────────────────────────────────────┘
```

**Catálogo de Oportunidades**
```
┌────────────────────────────────────────────────┐
│  HEADER                                        │
├────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌─────────────────────┐│
│  │    FILTROS       │  │   RESULTADOS        ││
│  │                  │  │                     ││
│  │  [x] Becas       │  │  ┌───────────────┐  ││
│  │  [ ] Prácticas   │  │  │ Oportunidad 1 │  ││
│  │  [ ] Empleos     │  │  └───────────────┘  ││
│  │                  │  │  ┌───────────────┐  ││
│  │  Facultad:       │  │  │ Oportunidad 2 │  ││
│  │  [Dropdown]      │  │  └───────────────┘  ││
│  │                  │  │  ┌───────────────┐  ││
│  │  Modalidad:      │  │  │ Oportunidad 3 │  ││
│  │  [Dropdown]      │  │  └───────────────┘  ││
│  │                  │  │                     ││
│  │  [Aplicar]       │  │  [1] [2] [3] >>    ││
│  └──────────────────┘  └─────────────────────┘│
├────────────────────────────────────────────────┤
│  FOOTER                                        │
└────────────────────────────────────────────────┘
```

---

## 5. IMPLEMENTACIÓN

### 5.1 Estructura del Proyecto

```
oportuniapp/
├── frontend/                    # Aplicación React
│   ├── public/
│   ├── src/
│   │   ├── components/         # Componentes reutilizables
│   │   │   ├── common/         # Header, Footer, Modal, etc.
│   │   │   ├── admin/          # Componentes admin
│   │   │   └── opportunities/  # Cards, filtros
│   │   ├── pages/              # Páginas de la aplicación
│   │   │   ├── admin/          # Páginas de administración
│   │   │   └── ...
│   │   ├── context/            # Context API (Auth)
│   │   ├── services/           # API client (axios)
│   │   ├── types/              # TypeScript interfaces
│   │   ├── App.tsx             # Rutas principales
│   │   ├── main.tsx            # Entry point
│   │   └── index.css           # Estilos globales
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── backend/                     # API Node.js
│   ├── src/
│   │   ├── config/             # Configuraciones (DB, Multer)
│   │   ├── controllers/        # Lógica de negocio
│   │   ├── middlewares/        # Auth, validación
│   │   ├── routes/             # Definición de rutas
│   │   └── index.ts            # Entry point Express
│   ├── uploads/                # Archivos subidos
│   ├── package.json
│   └── tsconfig.json
│
├── database/
│   └── schema.sql              # Script de base de datos
│
└── docs/                        # Documentación
    ├── Documentacion_Proyecto_Software.md
    ├── Manual_de_Usuario.md
    └── Manual_Tecnico_Sistema.md
```

### 5.2 Tecnologías Utilizadas

#### Frontend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | 18.2 | Biblioteca UI |
| TypeScript | 5.3 | Tipado estático |
| Vite | 5.0 | Build tool |
| Tailwind CSS | 3.4 | Framework CSS |
| React Router | 6.x | Navegación |
| React Query | 5.x | Estado servidor |
| React Hook Form | 7.x | Formularios |
| Zod | 3.x | Validación |
| Axios | 1.6 | Cliente HTTP |
| Recharts | 2.x | Gráficos |
| date-fns | 3.x | Formateo fechas |
| Lucide React | - | Iconos |
| react-hot-toast | - | Notificaciones |

#### Backend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Node.js | 20.x | Runtime |
| Express | 4.18 | Framework web |
| TypeScript | 5.3 | Tipado |
| pg | 8.x | Cliente PostgreSQL |
| bcrypt | 5.x | Hashing contraseñas |
| jsonwebtoken | 9.x | Autenticación JWT |
| multer | 1.4 | Upload de archivos |
| express-validator | 7.x | Validación |
| cors | 2.8 | CORS |
| helmet | 7.x | Seguridad headers |
| compression | 1.7 | Compresión |

#### Base de Datos
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| PostgreSQL | 15+ | RDBMS principal |

### 5.3 Código Destacado

#### Autenticación JWT (backend)
```typescript
// middlewares/auth.middleware.ts
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token requerido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

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

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    next();
  };
};
```

#### Context de Autenticación (frontend)
```typescript
// context/AuthContext.tsx
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authApi.getMe()
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    localStorage.setItem('token', response.data.token);
    setUser(response.data.user);
    return response.data;
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
```

#### Rutas Protegidas
```typescript
// App.tsx
function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <LoadingSpinner />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
```

### 5.4 Patrones de Diseño Aplicados

1. **Repository Pattern** - Abstracción de acceso a datos
2. **MVC** - Separación de responsabilidades en backend
3. **Provider Pattern** - Context API para estado global
4. **Compound Components** - Componentes complejos modulares
5. **Container/Presenter** - Separación lógica/presentación

---

## 6. PRUEBAS

### 6.1 Estrategia de Pruebas

Se implementaron pruebas en múltiples niveles:

| Nivel | Herramienta | Alcance |
|-------|-------------|---------|
| Unitarias | Jest | Funciones aisladas |
| Integración | Supertest | API endpoints |
| E2E | Manual | Flujos completos |
| UI | Manual | Interfaz de usuario |

### 6.2 Casos de Prueba

#### CP01 - Registro de Usuario
| Campo | Valor |
|-------|-------|
| ID | CP01 |
| Nombre | Registro con correo institucional |
| Precondición | Usuario no registrado |
| Pasos | 1. Ir a /register 2. Llenar formulario con @uni.pe 3. Enviar |
| Resultado esperado | Usuario creado, redirect a login |
| Resultado obtenido | ✅ Conforme |

#### CP02 - Registro con Correo No Institucional
| Campo | Valor |
|-------|-------|
| ID | CP02 |
| Nombre | Registro rechazado por correo inválido |
| Precondición | - |
| Pasos | 1. Ir a /register 2. Usar correo @gmail.com 3. Enviar |
| Resultado esperado | Error "Solo correos @uni.pe" |
| Resultado obtenido | ✅ Conforme |

#### CP03 - Login Exitoso
| Campo | Valor |
|-------|-------|
| ID | CP03 |
| Nombre | Inicio de sesión válido |
| Precondición | Usuario registrado |
| Pasos | 1. Ir a /login 2. Ingresar credenciales 3. Enviar |
| Resultado esperado | Redirect a home, usuario autenticado |
| Resultado obtenido | ✅ Conforme |

#### CP04 - Búsqueda de Oportunidades
| Campo | Valor |
|-------|-------|
| ID | CP04 |
| Nombre | Filtrar por tipo de oportunidad |
| Precondición | Oportunidades existentes |
| Pasos | 1. Ir a catálogo 2. Seleccionar filtro "Becas" |
| Resultado esperado | Solo mostrar becas |
| Resultado obtenido | ✅ Conforme |

#### CP05 - Postulación
| Campo | Valor |
|-------|-------|
| ID | CP05 |
| Nombre | Postular a oportunidad |
| Precondición | Usuario autenticado, oportunidad activa |
| Pasos | 1. Ver detalle 2. Clic "Postular" 3. Completar formulario |
| Resultado esperado | Postulación registrada |
| Resultado obtenido | ✅ Conforme |

#### CP06 - Doble Postulación
| Campo | Valor |
|-------|-------|
| ID | CP06 |
| Nombre | Prevenir postulación duplicada |
| Precondición | Ya postuló a la oportunidad |
| Pasos | 1. Ver detalle 2. Intentar postular |
| Resultado esperado | Botón deshabilitado "Ya postulaste" |
| Resultado obtenido | ✅ Conforme |

### 6.3 Resultados de Pruebas

| Categoría | Total | Pasadas | Fallidas | % Éxito |
|-----------|-------|---------|----------|---------|
| Autenticación | 8 | 8 | 0 | 100% |
| Oportunidades | 12 | 12 | 0 | 100% |
| Postulaciones | 10 | 10 | 0 | 100% |
| Administración | 15 | 15 | 0 | 100% |
| UI/UX | 10 | 10 | 0 | 100% |
| **TOTAL** | **55** | **55** | **0** | **100%** |

---

## 7. DESPLIEGUE

### 7.1 Requisitos de Infraestructura

#### Servidor de Aplicación
- CPU: 2 cores mínimo
- RAM: 4 GB mínimo
- Almacenamiento: 20 GB SSD
- SO: Ubuntu 22.04 LTS

#### Base de Datos
- PostgreSQL 15+
- RAM: 2 GB dedicados
- Almacenamiento: 10 GB inicial

### 7.2 Variables de Entorno

**Backend (.env)**
```
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@host:5432/oportuniapp
JWT_SECRET=<secret-key-256-bits>
JWT_EXPIRES_IN=7d
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
```

**Frontend (.env)**
```
VITE_API_URL=https://api.oportuniapp.uni.pe
```

### 7.3 Proceso de Despliegue

1. **Preparación del servidor**
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Instalar nginx
sudo apt install -y nginx
```

2. **Configurar base de datos**
```bash
sudo -u postgres psql
CREATE DATABASE oportuniapp;
CREATE USER oportuniapp_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE oportuniapp TO oportuniapp_user;
\q

# Ejecutar schema
psql -U oportuniapp_user -d oportuniapp -f database/schema.sql
```

3. **Desplegar backend**
```bash
cd backend
npm install --production
npm run build
pm2 start dist/index.js --name oportuniapp-api
```

4. **Desplegar frontend**
```bash
cd frontend
npm install
npm run build
# Copiar dist/ a /var/www/oportuniapp
```

5. **Configurar Nginx**
```nginx
server {
    listen 80;
    server_name oportuniapp.uni.pe;

    # Frontend
    location / {
        root /var/www/oportuniapp;
        try_files $uri $uri/ /index.html;
    }

    # API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 7.4 Diagrama de Despliegue

```
┌─────────────────────────────────────────────────────────────┐
│                        INTERNET                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   LOAD BALANCER / CDN                        │
│                      (Cloudflare)                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    SERVIDOR WEB                              │
│                      (Nginx)                                 │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Port 80/443 → SSL Termination                           ││
│  │ /          → Static files (React build)                 ││
│  │ /api/*     → Proxy to Node.js                           ││
│  │ /uploads/* → Static files (uploaded)                    ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│    APP SERVER            │  │    DATABASE SERVER       │
│    (Node.js + PM2)       │  │    (PostgreSQL)          │
│                          │  │                          │
│  • Express API           │  │  • Puerto 5432           │
│  • Puerto 3000           │  │  • Conexiones pooled     │
│  • JWT Authentication    │  │  • Backups diarios       │
│  • File uploads          │  │                          │
└──────────────────────────┘  └──────────────────────────┘
```

---

## 8. ANEXOS

### 8.1 Glosario de Términos

| Término | Definición |
|---------|------------|
| API | Application Programming Interface - Interfaz de programación |
| JWT | JSON Web Token - Estándar de autenticación |
| REST | Representational State Transfer - Arquitectura de APIs |
| SPA | Single Page Application - Aplicación de página única |
| CRUD | Create, Read, Update, Delete - Operaciones básicas |
| ORM | Object-Relational Mapping - Mapeo objeto-relacional |
| OCBU | Oficina Central de Bienestar Universitario |
| UNI | Universidad Nacional de Ingeniería |

### 8.2 Referencias

1. React Documentation - https://react.dev/
2. Node.js Documentation - https://nodejs.org/docs/
3. PostgreSQL Documentation - https://www.postgresql.org/docs/
4. Tailwind CSS - https://tailwindcss.com/docs
5. Express.js - https://expressjs.com/
6. JWT Introduction - https://jwt.io/introduction

### 8.3 Control de Versiones

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0.0 | Nov 2025 | Versión inicial del sistema |

### 8.4 Aprobaciones

| Rol | Nombre | Firma | Fecha |
|-----|--------|-------|-------|
| Product Owner | Muñoz Cruz Melannie | ____________ | ___/___/___ |
| Scrum Master | Orosco Montalvan Sebastian | ____________ | ___/___/___ |
| Developer | Nuñez Rivas Alvaro | ____________ | ___/___/___ |
| Developer | Huayhualla Barboza Joseph | ____________ | ___/___/___ |
| Docente | Ing. Cossa Cabanillas Jesus | ____________ | ___/___/___ |

---

*Documento generado para el curso de Ingeniería de Software (SI707V) - UNI 2025-2*
