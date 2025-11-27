import express from 'express';
import User from '../models/User.js';
import ProfesorRequest from '../models/ProfesorRequest.js';
import { verifyToken, verifyAdmin } from '../middlewares/authMiddleware.js';
import { enviarEmailAprobacion } from '../config/email.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// ✅ AGREGAR verifyAdmin a TODAS las rutas admin
// Obtener todos los usuarios - ADMIN ONLY
router.get('/usuarios', verifyToken, verifyAdmin, async (req, res) => {
  try {
    console.log('🔧 Admin obteniendo usuarios, rol:', req.usuario_rol);
    const usuarios = await User.findAll({
      attributes: ['id', 'nombre', 'email', 'rol', 'telefono', 'createdAt'],
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener solicitudes de profesor - ADMIN ONLY
router.get('/solicitudes-profesor', verifyToken, verifyAdmin, async (req, res) => {
  try {
    console.log('🔧 Admin obteniendo solicitudes, rol:', req.usuario_rol);
    const solicitudes = await ProfesorRequest.findAll({
      include: [
        {
          model: User,
          as: 'usuario',
          attributes: ['id', 'nombre', 'email'],
          required: false,
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(solicitudes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ CORREGIDO - Aprobar solicitud de profesor
router.post('/aprobar-profesor/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🔧 Aprobando solicitud:', id);
    
    const solicitud = await ProfesorRequest.findByPk(id, {
      include: [
        {
          model: User,
          as: 'usuario',
          attributes: ['id', 'nombre', 'email'],
          required: false,
        },
      ],
    });

    if (!solicitud) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    console.log('📧 Datos solicitud:', {
      nombre: solicitud.nombre,
      email_personal: solicitud.email_personal,
      usuario_id: solicitud.usuario_id
    });

    // Generar contraseña temporal
    const passwordTemporal = 'GymConnect2024';

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(passwordTemporal, 10);

    let usuario;

    if (solicitud.usuario_id) {
      // Usuario ya existe, solo actualizar rol
      usuario = await User.findByPk(solicitud.usuario_id);
      if (usuario) {
        usuario.rol = 'profesor';
        await usuario.save();
        console.log('✅ Usuario actualizado a profesor:', usuario.id);
      } else {
        // Crear nuevo usuario si no existe
        usuario = await User.create({
          nombre: solicitud.nombre,
          email: solicitud.email_personal, // ✅ CORREGIDO: email_personal no emailpersonal
          password: hashedPassword,
          rol: 'profesor',
          telefono: solicitud.telefono || null,
        });
        console.log('✅ Nuevo usuario creado:', usuario.id);
      }
    } else {
      // Crear nuevo usuario
      usuario = await User.create({
        nombre: solicitud.nombre,
        email: solicitud.email_personal, // ✅ CORREGIDO
        password: hashedPassword,
        rol: 'profesor',
        telefono: solicitud.telefono || null,
      });
      console.log('✅ Nuevo usuario creado:', usuario.id);

      // Actualizar la solicitud con el usuario creado
      solicitud.usuario_id = usuario.id;
    }

    // Actualizar estado
    solicitud.estado = 'aprobada';
    await solicitud.save();

    // ENVIAR EMAIL
    try {
      await enviarEmailAprobacion({
        nombre: usuario.nombre,
        email_personal: solicitud.email_personal,
        email_corporativo: usuario.email,
        password_temporal: passwordTemporal,
      });
      console.log('✅ Email enviado correctamente a:', solicitud.email_personal);
    } catch (emailError) {
      console.error('❌ Error enviando email:', emailError.message);
      // Continuar aunque falle el email
    }

    res.json({
      message: 'Solicitud aprobada exitosamente',
      solicitud,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
      },
    });
  } catch (error) {
    console.error('❌ Error aprobando solicitud:', error);
    res.status(500).json({ 
      error: 'Error aprobando solicitud: ' + error.message 
    });
  }
});

// Rechazar solicitud de profesor - ADMIN ONLY
router.post('/rechazar-profesor/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const solicitud = await ProfesorRequest.findByPk(id);

    if (!solicitud) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    solicitud.estado = 'rechazada';
    await solicitud.save();

    res.json({ message: 'Solicitud rechazada', solicitud });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar usuario - ADMIN ONLY
router.put('/usuarios/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { rol, nombre, email, telefono } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (rol) user.rol = rol;
    if (nombre) user.nombre = nombre;
    if (email) user.email = email;
    if (telefono) user.telefono = telefono;

    await user.save();
    res.json({ message: 'Usuario actualizado', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar usuario - ADMIN ONLY
router.delete('/usuarios/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Proteger contra borrar admin
    if (user.rol === 'admin') {
      return res.status(403).json({ error: 'No se puede eliminar un admin' });
    }

    await user.destroy();
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;