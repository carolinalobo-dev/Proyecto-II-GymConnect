import express from 'express';
import ProfesorRequest from '../models/ProfesorRequest.js';

const router = express.Router();

// ✅ Solicitar ser profesor (SIN token - público)
router.post('/solicitar', async (req, res) => {
  try {
    const { nombre, email_personal, telefono, mensaje } = req.body;

    // Crear solicitud sin usuario_id (no están logueados)
    const solicitud = await ProfesorRequest.create({
      usuario_id: null,
      nombre,
      email_personal,
      telefono,
      mensaje,
      estado: 'pendiente'
    });

    res.status(201).json({ 
      message: 'Solicitud enviada exitosamente',
      solicitud 
    });
  } catch (error) {
    console.error('Error creando solicitud:', error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ CORREGIR EXPORT
export default router;