// En tu función login del AuthContext, volver a alert
const login = async (userData) => {
  try {
    const response = await authAPI.iniciarSesion(userData);
    
    const { token, usuario } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    
    setUser(usuario);
    setIsAuthenticated(true);

    // ✅ Volver a alert original
    alert(`✅ Bienvenido ${usuario.nombre}!`);

    return { success: true };
  } catch (error) {
    console.error('❌ Error en login:', error);
    
    // ✅ Volver a alert original
    alert('❌ ' + (error.response?.data?.error || 'Error en el login'));

    return {
      success: false,
      message: error.response?.data?.error || 'Error en el login'
    };
  }
};