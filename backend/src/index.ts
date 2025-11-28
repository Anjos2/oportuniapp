import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Cargar variables de entorno
dotenv.config();

// Importar rutas
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import opportunityRoutes from './routes/opportunity.routes';
import applicationRoutes from './routes/application.routes';
import publicationRoutes from './routes/publication.routes';
import reportRoutes from './routes/report.routes';
import adminRoutes from './routes/admin.routes';
import catalogRoutes from './routes/catalog.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Crear directorios de uploads si no existen
const uploadDirs = ['uploads/cvs', 'uploads/photos', 'uploads/attachments', 'uploads/misc'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/my-publications', publicationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/catalogs', catalogRoutes);

// Ruta de health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'OportUNI API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Manejo de errores global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);

  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'El archivo excede el tamaño máximo permitido' });
    }
    return res.status(400).json({ error: 'Error al subir el archivo' });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor'
  });
});

// Ruta 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════════╗
  ║         OportUNI API Server                ║
  ║         Puerto: ${PORT}                        ║
  ║         Entorno: ${process.env.NODE_ENV || 'development'}              ║
  ╚════════════════════════════════════════════╝
  `);
});

export default app;
