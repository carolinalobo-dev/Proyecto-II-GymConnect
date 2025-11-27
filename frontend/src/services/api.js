import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ========================================
//  AUTH 
// ========================================
export const authAPI = {
  iniciarSesion: (datos) => api.post('/auth/login', datos),
  registrarse: (datos) => api.post('/auth/register', datos),
  validarToken: () => api.get('/auth/validar-token'),
  cerrarSesion: () => api.post('/auth/logout')
};

// ========================================
//  CLASES
// ========================================
export const clasesAPI = {
  obtenerTodas: () => api.get('/clases'),
  obtenerPorId: (id) => api.get(`/clases/${id}`),
  crear: (datos) => api.post('/clases/crear', datos),
  actualizar: (id, datos) => api.put(`/clases/${id}`, datos),
  eliminar: (id) => api.delete(`/clases/${id}`)
};

// ========================================
//  INSCRIPCIONES
// ========================================
export const inscripcionesAPI = {
  getMyClasses: () => api.get('/inscripciones/mis-clases'),
  inscribirse: (classId) => api.post('/inscripciones/inscribirse', { 
    class_id: classId
  }),
  cancelar: (enrollmentId) => api.post('/inscripciones/cancelar', { 
    enrollment_id: enrollmentId 
  })
};

// ========================================
//  TIENDA
// ========================================
export const tiendaAPI = {
  obtenerProductos: () => api.get('/shop/productos'),
  crearOrden: (datos) => api.post('/shop/ordenes', datos),
  obtenerMisCompras: () => api.get('/shop/mis-compras'), // ← NUEVA RUTA
  obtenerOrdenes: () => api.get('/shop/ordenes')
};
// ========================================
//  PROFESOR
// ========================================
export const profesorAPI = {
  solicitar: (datos) => api.post('/profesor/solicitar', datos)
};

// ========================================
//  ADMIN
// ========================================
export const adminAPI = {
  obtenerSolicitudes: () => api.get('/admin/solicitudes-profesor'),
  aprobarProfesor: (solicitudId) => api.post(`/admin/aprobar-profesor/${solicitudId}`),
  rechazarProfesor: (solicitudId) => api.post(`/admin/rechazar-profesor/${solicitudId}`),
  obtenerUsuarios: () => api.get('/admin/usuarios'),
  actualizarUsuario: (usuarioId, datos) => api.put(`/admin/usuario/${usuarioId}`, datos)
};

// Aliases para compatibilidad con código anterior
export const enrollmentAPI = inscripcionesAPI;
export const shopAPI = tiendaAPI;

export default api;