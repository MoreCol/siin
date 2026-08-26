import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

import '../styles/login.css';


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
  <div className="min-h-screen flex items-center justify-center p-5 bg-slate-100">
    <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl border border-slate-200">
      <div className="flex flex-col gap-5">
        <p className="text-left text-[20px] font-bold text-[#264d75]">
          Miscelanea Moreno
        </p>

        <h1 className="text-center text-4xl font-bold text-[#264d75]">
          Registro de Usuario
        </h1>

        <form
          className="flex flex-col gap-4"
          onSubmit={handleRegister}
        >
          {/* Nombre */}
          <label
            htmlFor="nombre"
            className=" font-bold text-slate-600"
          >
            Nombre
          </label>

          <input
            id="nombre"
            name="nombre"
            type="text"
            placeholder="Ingresa tu nombre"
            value={form.nombre}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          {errors.nombre && (
            <p className=" text-red-500">
              {errors.nombre}
            </p>
          )}

          {/* Apellido */}
          <label
            htmlFor="apellido"
            className=" font-bold text-slate-600"
          >
            Apellido
          </label>

          <input
            id="apellido"
            name="apellido"
            type="text"
            placeholder="Ingresa tu apellido"
            value={form.apellido}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          {errors.apellido && (
            <p className="text-sm text-red-500">
              {errors.apellido}
            </p>
          )}

          {/* Correo */}
          <label
            htmlFor="correo"
            className="font-bold text-slate-600"
          >
            Correo
          </label>

          <input
            id="correo"
            name="correo"
            type="email"
            placeholder="Ingresa tu correo"
            value={form.correo}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          {errors.correo && (
            <p className="text-sm text-red-500">
              {errors.correo}
            </p>
          )}

          {/* Contraseña */}
          <label
            htmlFor="password"
            className=" font-bold text-slate-600"
          >
            Contraseña
          </label>

          <div className="relative">
            <input
              id="password"
              name="password"
              type={verPassword ? 'text' : 'password'}
              placeholder="Crea una contraseña"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />

            <button
              type="button"
              onClick={() => setVerPassword(!verPassword)}
              className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-xl
                text-blue-600
                hover:text-blue-500
              "
            >
              {verPassword ? (
                <MdVisibilityOff />
              ) : (
                <MdVisibility />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="text-sm text-red-500">
              {errors.password}
            </p>
          )}

          {errorServer && (
            <p className="text-sm text-red-500">
              {errorServer}
            </p>
          )}

          <button
            type="submit"
            className="
              mt-2
              w-full
              rounded-lg
              bg-blue-600
              px-4
              py-3
              font-bold
              text-white
              transition
              hover:bg-blue-700
              active:scale-95
            "
          >
            Registrarse
          </button>

          {mensajeExito && (
            <p className="text-center font-bold text-green-600">
              {mensajeExito}
            </p>
          )}
        </form>

        <div className="mt-3 text-sm">
          <span className="  text-[15px]  text-slate-600">
            ¿Ya tienes cuenta?
          </span>

          <Link
            to="/"
            className="ml-2  text-[18px]  text-blue-600 hover:underline"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  </div>
);
}
