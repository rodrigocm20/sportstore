import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaShieldAlt } from 'react-icons/fa';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulación de login
    localStorage.setItem('isAuthenticated', 'true');
    navigate('/');
  };

  return (
    <div className="container-fluid vh-100 p-0 overflow-hidden bg-light">
      <div className="row g-0 h-100">
        
        {/* --- LADO IZQUIERDO: RESTAURADO AL TAMAÑO ORIGINAL (col-md-6) --- */}
        {/* Usamos col-md-6 para volver a la proporción 50/50 original */}
        <div className="col-md-6 d-none d-md-flex flex-column justify-content-between p-5" 
             style={{ 
               backgroundImage: "url('/bannertienda.png')",
               backgroundSize: 'cover', 
               backgroundPosition: 'center', /* Volvemos a centrar la imagen */
               backgroundRepeat: 'no-repeat',
               backgroundColor: '#000'
             }}>
          {/* Espacio libre para el texto nativo de tu imagen */}
          <div></div> 
          
          <div className="d-flex align-items-center gap-2 opacity-50 small text-white position-relative" style={{ zIndex: 1 }}>
            <FaShieldAlt /> Sistema de inventario - Tienda Deportiva
          </div>
        </div>

        {/* --- LADO DERECHO: FORMULARIO MÁS ANCHO --- */}
        {/* Mantenemos col-md-6 para la columna, pero ensanchamos el card interno */}
        <div className="col-md-6 d-flex align-items-center justify-content-center p-4">
          
          {/* AUMENTAMOS EL ANCHO AQUÍ: maxWidth de 450px a 520px */}
          <div className="card border-0 shadow-lg rounded-4 p-5" style={{ maxWidth: '520px', width: '100%' }}>
            
            <div className="text-center mb-4">
              <div className="bg-danger text-white d-inline-flex p-3 rounded-circle mb-3 shadow">
                <FaUser size={30} /> {/* Icono de tamaño normal */}
              </div>
              <h2 className="fw-bold">Bienvenido de nuevo</h2>
              <p className="text-muted">Inicia sesión para continuar</p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label fw-bold small text-uppercase text-muted" style={{ letterSpacing: '1px' }}>Usuario</label>
                {/* Inputs de tamaño normal */}
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0"><FaUser className="text-muted" /></span>
                  <input type="text" className="form-control border-start-0" placeholder="Ingresa tu usuario" required />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold small text-uppercase text-muted" style={{ letterSpacing: '1px' }}>Contraseña</label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0"><FaLock className="text-muted" /></span>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="form-control border-start-0 border-end-0" 
                    placeholder="Ingresa tu contraseña" 
                    required 
                  />
                  <span className="input-group-text bg-white border-start-0" style={{ cursor: 'pointer' }} onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash className="text-muted" /> : <FaEye className="text-muted" />}
                  </span>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="remember" />
                  <label className="form-check-label small text-muted" htmlFor="remember">Recordarme</label>
                </div>
                <a href="#" className="text-danger text-decoration-none small fw-bold">¿Olvidaste tu contraseña?</a>
              </div>

              {/* Botón de tamaño normal */}
              <button type="submit" className="btn btn-danger w-100 rounded-pill py-2 fw-bold shadow-sm mt-3 transition-all hover-shadow">
                Iniciar sesión
              </button>
            </form>
            
            <div className="text-center mt-4 pt-3 border-top">
               <button type="button" className="btn btn-outline-dark w-100 rounded-pill py-2 fw-bold d-flex align-items-center justify-content-center gap-2 small hover-bg-dark">
                <FaShieldAlt /> Cuenta de administrador
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}