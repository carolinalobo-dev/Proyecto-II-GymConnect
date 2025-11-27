import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura_cambiala_en_produccion';

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    req.usuario_id = decoded.usuario_id || decoded.id;
    req.usuario_email = decoded.email;
    req.usuario_rol = decoded.rol;
    next();
  } catch (error) {
    console.error('❌ Error verificando token:', error.message);
    res.status(403).json({ error: 'Token inválido o expirado' });
  }
};

export const optionalToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, SECRET_KEY);
      req.usuario_id = decoded.usuario_id || decoded.id;
      req.usuario_email = decoded.email;
      req.usuario_rol = decoded.rol;
    }
    next();
  } catch (error) {
    next();
  }
};

// ✅ AGREGAR ESTE MIDDLEWARE para verificar que es admin
export const verifyAdmin = (req, res, next) => {
  if (req.usuario_rol !== 'admin') {
    console.log('❌ Acceso denegado. Rol:', req.usuario_rol);
    return res.status(403).json({ error: 'Acceso denegado: solo admins' });
  }
  next();
};

// ✅ AGREGAR ESTE MIDDLEWARE para verificar que es profesor
export const verifyProfesor = (req, res, next) => {
  if (req.usuario_rol !== 'profesor') {
    return res.status(403).json({ error: 'Acceso denegado: solo profesores' });
  }
  next();
};