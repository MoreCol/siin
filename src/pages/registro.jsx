import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

import '../styles/login.css';
import '../styles/shared.css';

export default function Register() {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [mensajeExito, setMensajeExito] = useState('');
  const [errorServer, setErrorServer] = useState('');

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
   const [verPassword, setVerPassword] = useState(false);

  const validarCampos = () => {
    const nuevosErrores = {};

    if (!form.nombre.trim()) {
      nuevosErrores.nombre = 'Ingrese su nombre';
    }

    if (!form.apellido.trim()) {
      nuevosErrores.apellido = 'Ingrese su apellido';
    }

    if (!form.correo.trim()) {
      nuevosErrores.correo = 'Ingrese su correo';
    } else if (!validarEmail(form.correo)) {
      nuevosErrores.correo = 'Ingrese un correo válido';
    }

    if (!form.password) {
      nuevosErrores.password = 'Digite su contraseña';
    } else if (form.password.length < 8) {
      nuevosErrores.password = 'La contraseña debe tener mínimo 8 caracteres';
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleRegister = async e => {
    e.preventDefault();
    setMensajeExito('');
    setErrorServer('');

    if (!validarCampos()) return;

    try {
      await axios.post('http://localhost:3000/api/auth/register', {
        nombre: form.nombre,
        apellido: form.apellido,
        correo: form.correo,
        password: form.password,
        estado: true,
        id_rol: 1
      });

      setMensajeExito('¡REGISTRO EXITOSO!');
      setTimeout(() => navigate('/'), 300);
    } catch (error) {
      setErrorServer(error?.response?.data?.message || 'Error al registrar usuario');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-container">
          <p className="empresa-nombre">Miscelanea Moreno</p>
          <h1 id="login-name">Registro de Usuario</h1>

          <form className="login-fields" onSubmit={handleRegister}>
            <label className="login-label" htmlFor="nombre">
              Nombre
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              placeholder="Ingresa tu nombre"
              value={form.nombre}
              onChange={handleChange}
            />
            {errors.nombre && <p style={{ color: 'red', margin: 0 }}>{errors.nombre}</p>}

            <label className="login-label" htmlFor="apellido">
              Apellido
            </label>
            <input
              id="apellido"
              name="apellido"
              type="text"
              placeholder="Ingresa tu apellido"
              value={form.apellido}
              onChange={handleChange}
            />
            {errors.apellido && <p style={{ color: 'red', margin: 0 }}>{errors.apellido}</p>}

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

            <label className="login-label" htmlFor="password">
              Contraseña
            </label>
            <div className="password-wrapper">
              <input
                id="password"
                name="password"
                type={verPassword ? 'text': 'password'}
                placeholder="Crea una contraseña"
                value={form.password}
                onChange={handleChange}
              />
              <span  className='toggle-password'
                onClick={()=>setVerPassword(!verPassword)}>
                  {verPassword?<MdVisibilityOff /> : <MdVisibility />}
              </span>
            </div>

            {errors.password && <p style={{ color: 'red', margin: 0 }}>{errors.password}</p>}

            {errorServer && <p style={{ color: 'red', margin: 0 }}>{errorServer}</p>}

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
