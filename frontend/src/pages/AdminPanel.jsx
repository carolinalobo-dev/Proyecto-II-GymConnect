// frontend/src/pages/AdminPanel.jsx
import { useState, useEffect } from 'react';
import { profesorAPI, adminAPI } from '../services/api';
import Navbar from '../components/Navbar';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('solicitudes');
  const [solicitudes, setSolicitudes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'solicitudes') {
      loadSolicitudes();
    } else if (activeTab === 'usuarios') {
      loadUsuarios();
    }
  }, [activeTab]);

  const loadSolicitudes = async () => {
    try {
      setLoading(true);
      const response = await profesorAPI.obtenerSolicitudes();
      setSolicitudes(response.data);
    } catch (error) {
      console.error('Error cargando solicitudes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.obtenerUsuarios();
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAprobar = async (id) => {
  try {
    const response = await profesorAPI.aprobar(id);
    alert('✅ ' + response.data.message);
    loadSolicitudes();
  } catch (error) {
    alert('Error aprobando solicitud');
  }
};


  const handleRechazar = async (id) => {
    if (window.confirm('¿Estás seguro de rechazar esta solicitud?')) {
      try {
        await profesorAPI.rechazar(id);
        alert('Solicitud rechazada');
        loadSolicitudes();
      } catch (error) {
        alert('Error rechazando solicitud');
      }
    }
  };

  const handleBuscar = async () => {
    if (busqueda.trim().length < 2) {
      alert('Ingresa al menos 2 caracteres');
      return;
    }
    try {
      const response = await adminAPI.buscarUsuarios(busqueda);
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error buscando:', error);
    }
  };

  const handleCambiarRol = async (id, nuevoRol) => {
    try {
      await adminAPI.cambiarRol(id, nuevoRol);
      alert('Rol cambiado exitosamente');
      loadUsuarios();
    } catch (error) {
      alert('Error cambiando rol');
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await adminAPI.eliminarUsuario(id);
        alert('Usuario eliminado');
        loadUsuarios();
      } catch (error) {
        alert(error.response?.data?.error || 'Error eliminando usuario');
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', paddingTop: '80px' }}>
      <Navbar />
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #00ff87 0%, #60efff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '2rem'
        }}>Panel de Administración</h1>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button
            onClick={() => setActiveTab('solicitudes')}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === 'solicitudes' ? '#00ff87' : '#161616',
              color: activeTab === 'solicitudes' ? '#0a0a0a' : '#a0a0a0',
              border: '1px solid #2a2a2a',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Solicitudes de Profesor
          </button>
          <button
            onClick={() => setActiveTab('usuarios')}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === 'usuarios' ? '#00ff87' : '#161616',
              color: activeTab === 'usuarios' ? '#0a0a0a' : '#a0a0a0',
              border: '1px solid #2a2a2a',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Gestión de Usuarios
          </button>
        </div>

        {/* Contenido de Solicitudes */}
        {activeTab === 'solicitudes' && (
          <div>
            {loading ? (
              <p style={{ color: '#a0a0a0' }}>Cargando...</p>
            ) : solicitudes.length === 0 ? (
              <p style={{ color: '#a0a0a0' }}>No hay solicitudes pendientes</p>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {solicitudes.map((solicitud) => (
                  <div key={solicitud.id} style={{
                    background: '#161616',
                    border: '1px solid #2a2a2a',
                    borderRadius: '0.75rem',
                    padding: '1.5rem'
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'start' }}>
                      <div>
                        <h3 style={{ color: '#00ff87', marginBottom: '0.5rem' }}>
                          {solicitud.nombre} 
                        </h3>
                        <p style={{ color: '#a0a0a0', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                          📧 {solicitud.email_personal}
                        </p>
                        <p style={{ color: '#a0a0a0', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                          📱 {solicitud.telefono || 'No especificado'}
                        </p>
                        {solicitud.mensaje && (
                          <p style={{ color: '#ffffff', marginTop: '0.5rem', fontSize: '0.95rem' }}>
                            "{solicitud.mensaje}"
                          </p>
                        )}
                        <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                          Estado: <strong>{solicitud.estado}</strong> | 
                          Fecha: {new Date(solicitud.fecha_solicitud).toLocaleDateString()}
                        </p>
                      </div>
                      
                      {solicitud.estado === 'pendiente' && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleAprobar(solicitud.id)}
                            style={{
                              padding: '0.5rem 1rem',
                              background: '#00ff87',
                              color: '#0a0a0a',
                              border: 'none',
                              borderRadius: '0.5rem',
                              cursor: 'pointer',
                              fontWeight: '600'
                            }}
                          >
                            Aprobar
                          </button>
                          <button
                            onClick={() => handleRechazar(solicitud.id)}
                            style={{
                              padding: '0.5rem 1rem',
                              background: '#ff4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0.5rem',
                              cursor: 'pointer',
                              fontWeight: '600'
                            }}
                          >
                            Rechazar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Contenido de Usuarios */}
        {activeTab === 'usuarios' && (
          <div>
            {/* Buscador */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <input
                type="text"
                placeholder="Buscar por nombre, o email..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: '#161616',
                  border: '1px solid #2a2a2a',
                  borderRadius: '0.5rem',
                  color: '#ffffff'
                }}
              />
              <button
                onClick={handleBuscar}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#00ff87',
                  color: '#0a0a0a',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Buscar
              </button>
              <button
                onClick={loadUsuarios}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#161616',
                  color: '#a0a0a0',
                  border: '1px solid #2a2a2a',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Ver Todos
              </button>
            </div>

            {/* Tabla de usuarios */}
            {loading ? (
              <p style={{ color: '#a0a0a0' }}>Cargando...</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#161616', borderBottom: '2px solid #00ff87' }}>
                      <th style={{ padding: '1rem', textAlign: 'left', color: '#00ff87' }}>Nombre</th>
                      <th style={{ padding: '1rem', textAlign: 'left', color: '#00ff87' }}>Email</th>
                      <th style={{ padding: '1rem', textAlign: 'left', color: '#00ff87' }}>Rol</th>
                      <th style={{ padding: '1rem', textAlign: 'left', color: '#00ff87' }}>Teléfono</th>
                      <th style={{ padding: '1rem', textAlign: 'center', color: '#00ff87' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((usuario) => (
                      <tr key={usuario.id} style={{ borderBottom: '1px solid #2a2a2a' }}>
                        <td style={{ padding: '1rem', color: '#ffffff' }}>
                          {usuario.nombre}
                        </td>
                        <td style={{ padding: '1rem', color: '#a0a0a0' }}>{usuario.email}</td>
                        <td style={{ padding: '1rem' }}>
                          <select
                            value={usuario.rol}
                            onChange={(e) => handleCambiarRol(usuario.id, e.target.value)}
                            disabled={usuario.rol === 'admin'}
                            style={{
                              padding: '0.5rem',
                              background: '#0a0a0a',
                              border: '1px solid #2a2a2a',
                              borderRadius: '0.25rem',
                              color: '#ffffff',
                              cursor: usuario.rol === 'admin' ? 'not-allowed' : 'pointer'
                            }}
                          >
                            <option value="cliente">Cliente</option>
                            <option value="profesor">Profesor</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td style={{ padding: '1rem', color: '#a0a0a0' }}>
                          {usuario.telefono || '-'}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          {usuario.rol !== 'admin' && (
                            <button
                              onClick={() => handleEliminar(usuario.id)}
                              style={{
                                padding: '0.5rem 1rem',
                                background: '#ff4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.25rem',
                                cursor: 'pointer',
                                fontSize: '0.85rem'
                              }}
                            >
                              Eliminar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
