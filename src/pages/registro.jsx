import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import '../styles/login.css';
import '../styles/shared.css';

export default function Register() {
  const [form, setForm] = useState({
    nombre_completo: '',
    nombre_usuario: '',
    correo: '',
    contraseña: '',
    confirmar_contraseña: ''
  });

  const [errors, setErrors] = useState({});
  const [mensajeExito, setMensajeExito] = useState('');

  const navigate = useNavigate();

  const validarEmail = correoValue => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(correoValue);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validarCampos = () => {
    const nuevosErrores = {};

    if (!form.nombre_completo.trim()) {
      nuevosErrores.nombre_completo = 'Ingrese su nombre completo';
    }

    if (!form.nombre_usuario.trim()) {
      nuevosErrores.nombre_usuario = 'Ingrese un nombre de usuario';
    }

    if (!form.correo.trim()) {
      nuevosErrores.correo = 'Ingrese su correo';
    } else if (!validarEmail(form.correo)) {
      nuevosErrores.correo = 'Ingrese un correo válido';
    }

    if (!form.contraseña) {
      nuevosErrores.contraseña = 'Digite su contraseña';
    } else if (form.contraseña.length < 8) {
      nuevosErrores.contraseña = 'La contraseña debe tener mínimo 8 caracteres';
    }

    if (!form.confirmar_contraseña) {
      nuevosErrores.confirmar_contraseña = 'Confirme su contraseña';
    } else if (form.contraseña !== form.confirmar_contraseña) {
      nuevosErrores.confirmar_contraseña = 'Las contraseñas no coinciden';
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleRegister = e => {
    e.preventDefault();
    setMensajeExito('');

    if (!validarCampos()) return;

    setMensajeExito('¡REGISTRO EXITOSO!');
    setTimeout(() => navigate('/'), 300);
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-container">
          <p className="empresa-nombre">Miscelanea Moreno</p>
          <h1 id="login-name">Registro de Usuario</h1>

          <form className="login-fields" onSubmit={handleRegister}>
            <label className="login-label" htmlFor="nombre_completo">
              Nombre completo
            </label>
            <input
              id="nombre_completo"
              name="nombre_completo"
              type="text"
              placeholder="Ingresa tu nombre completo"
              value={form.nombre_completo}
              onChange={handleChange}
            />
            {errors.nombre_completo && <p style={{ color: 'red', margin: 0 }}>{errors.nombre_completo}</p>}

            <label className="login-label" htmlFor="nombre_usuario">
              Nombre de usuario
            </label>
            <input
              id="nombre_usuario"
              name="nombre_usuario"
              type="text"
              placeholder="Ingresa tu nombre de usuario"
              value={form.nombre_usuario}
              onChange={handleChange}
            />
            {errors.nombre_usuario && <p style={{ color: 'red', margin: 0 }}>{errors.nombre_usuario}</p>}

            <label className="login-label" htmlFor="correo">
              Correo
            </label>
            <input
              id="correo"
              name="correo"
              type="email"
              placeholder="Ingresa tu correo"
              value={form.correo}
              onChange={handleChange}
            />
            {errors.correo && <p style={{ color: 'red', margin: 0 }}>{errors.correo}</p>}

            <label className="login-label" htmlFor="contraseña">
              Crear contraseña
            </label>
            <input
              id="contraseña"
              name="contraseña"
              type="password"
              placeholder="Crea una contraseña"
              value={form.contraseña}
              onChange={handleChange}
            />
            {errors.contraseña && <p style={{ color: 'red', margin: 0 }}>{errors.contraseña}</p>}

            <label className="login-label" htmlFor="confirmar_contraseña">
              Confirmar contraseña
            </label>
            <input
              id="confirmar_contraseña"
              name="confirmar_contraseña"
              type="password"
              placeholder="Confirma tu contraseña"
              value={form.confirmar_contraseña}
              onChange={handleChange}
            />
            {errors.confirmar_contraseña && (
              <p style={{ color: 'red', margin: 0 }}>{errors.confirmar_contraseña}</p>
            )}

            <button className="login-button" type="submit">
              Registrarse
            </button>

            {mensajeExito && <p className="p-exito">{mensajeExito}</p>}
          </form>

          <div style={{ marginTop: 20, fontSize: '0.9rem' }}>
            <span>¿Ya tienes cuenta? </span>
            <Link to="/" style={{ color: '#007BFF', textDecoration: 'none' }}>
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}