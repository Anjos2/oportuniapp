import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = './uploads/';

    if (file.fieldname === 'cv') {
      uploadPath += 'cvs/';
    } else if (file.fieldname === 'photo') {
      uploadPath += 'photos/';
    } else if (file.fieldname === 'attachment') {
      uploadPath += 'attachments/';
    } else {
      uploadPath += 'misc/';
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/gif'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido'));
  }
};

export const uploadCV = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB para CV
  }
}).single('cv');

export const uploadPhoto = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes'));
    }
  },
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB para fotos
  }
}).single('photo');

export const uploadAttachment = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB para adjuntos
  }
}).single('attachment');

export default multer({ storage, fileFilter });
