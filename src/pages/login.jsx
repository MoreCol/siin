import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../styles/login.css';
import '../styles/shared.css';

export default function Login() {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [errorCorreo, setErrorCorreo] = useState('');
  const [errorContraseña, setErrorContraseña] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  const navigate = useNavigate();

  const validarEmail = correoValue => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(correoValue);
  };

  const validarContraseña = passValue => {
    return passValue.length >= 8;
  };

  const validarCampos = () => {
    setErrorCorreo('');
    setErrorContraseña('');
    setMensajeExito('');

    if (correo === '') {
      setErrorCorreo('Ingrese su Correo');
      return false;
    }

    if (!validarEmail(correo)) {
      setErrorCorreo('Ingrese un correo válido');
      return false;
    }

    if (contraseña === '') {
      setErrorContraseña('Digite su Contraseña');
      return false;
    }

    if (!validarContraseña(contraseña)) {
      setErrorContraseña('La contraseña debe tener mínimo 8 caracteres');
      return false;
    }

    return true;
  };

  const handleLogin = e => {
    e.preventDefault();
    if (!validarCampos()) return;

    setMensajeExito('¡INICIO DE SESIÓN EXITOSO!');
    setTimeout(() => navigate('/productos'), 200);
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-container">
          <p className="empresa-nombre">Miscelanea Moreno</p>
          <h1 id="login-name">Inicio de Sesión</h1>

          <form className="login-fields" onSubmit={handleLogin}>
            <label className="login-label" htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              placeholder="Ingresa el Correo"
              value={correo}
              onChange={e => setCorreo(e.target.value)}
            />
            {errorCorreo && <p style={{ color: 'red', margin: 0 }}>{errorCorreo}</p>}

            <label className="login-label" htmlFor="login-password">
              Contraseña
            </label>
            <input
              id="login-password"
              type="password"
              placeholder="Contraseña"
              value={contraseña}
              onChange={e => setContraseña(e.target.value)}
            />
            {errorContraseña && <p style={{ color: 'red', margin: '4px 0' }}>{errorContraseña}</p>}

            <button className="login-button" type="submit">
              Iniciar Sesión
            </button>
            {mensajeExito && <p className="p-exito">{mensajeExito}</p>}
          </form>

          <div style={{ marginTop: 20, fontSize: '0.9rem' }}>
            <a href="#" style={{ color: '#007BFF', textDecoration: 'none' }}>
              ¿Olvidaste tu contraseña?
            </a>
            <span style={{ margin: '0 10px', color: '#ccc' }}>|</span>
            <a href="#" style={{ color: '#007BFF', textDecoration: 'none' }}>
              Registrarse
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
