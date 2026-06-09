import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';




export default function Login() {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [verPassword, setVerPassword] = useState(false);
  const [errorCorreo, setErrorCorreo] = useState('');
  const [errorContraseña, setErrorContraseña] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [errorServer, setErrorServer] = useState('');

  const navigate = useNavigate();

  const validarEmail = correoValue => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(correoValue);
  };

  const validarContraseña = passValue => passValue.length >= 8;

  const validarCampos = () => {
    setErrorCorreo('');
    setErrorContraseña('');
    setMensajeExito('');
    setErrorServer('');

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

  const handleLogin = async e => {
    e.preventDefault();
    if (!validarCampos()) return;

    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', {
        correo,
        password: contraseña
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      setMensajeExito('¡INICIO DE SESIÓN EXITOSO!');
      setTimeout(() => navigate('/dashboard', { replace: true }), 200);
    } catch (error) {
      setErrorServer(error?.response?.data?.message || 'Credenciales incorrectas');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center !p-5 bg-slate-100">
    <div className="w-full max-w-md rounded-3xl bg-white !p-9 shadow-xl border border-slate-200">
      <div className="flex flex-col gap-14">
        <p className="text-left text-[20px] font-bold text-[#264d75]">
          Miscelanea Moreno
        </p>

        <h1 className="text-center text-4xl font-bold text-[#264d75]">
          Inicio de Sesión
        </h1>

        <form
          className="flex flex-col gap-4"
          onSubmit={handleLogin}
        >
          <label
            className="text- font-bold text-slate-600"
            htmlFor="login-email"
          >
            Email
          </label>

          <input
            id="login-email"
            type="email"
            placeholder="Ingresa el Correo"
            value={correo}
            onChange={e => setCorreo(e.target.value)}
            className="
              w-full
              rounded-lg
              border border-slate-300
              !px-4 !py-3
              focus:outline-none
              focus:ring-2
              focus:ring-blue-300
              focus:border-blue-400
            "
          />

          {errorCorreo && (
            <p className="text-[15px] text-red-500">
              {errorCorreo}
            </p>
          )}

          <label
            className=" font-bold text-slate-600"
            htmlFor="login-password"
          >
            Contraseña
          </label>

          <div className="relative">
            <input
              id="login-password"
              type={verPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              value={contraseña}
              onChange={e => setContraseña(e.target.value)}
              className="
                w-full
                rounded-lg
                
                border border-slate-300
                !px-6 !py-3
                pr-12
                focus:outline-none
                focus:ring-2
                focus:ring-blue-300
                focus:border-blue-400
              "
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

          {errorContraseña && (
            <p className="text-[15px] text-red-500">
              {errorContraseña}
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
              mt-5
              w-full
              rounded-lg
              bg-blue-600
              !px-4
              !py-3
              font-bold
              text-white
              transition
              hover:bg-blue-800
              active:scale-95
            "
          >
            Iniciar Sesión
          </button>

          {mensajeExito && (
            <p className="text-center font-bold text-green-600">
              {mensajeExito}
            </p>
          )}
        </form>

        <div className="mt-3 text-sm">
          <a
            href="#"
            className="text-[15px] text-blue-600 hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </a>

          <span className="mx-7 text-slate-400">|</span>

          <Link
            to="/registro"
            className="text-[15px] text-blue-600 hover:underline"
          >
            Registrarse
          </Link>
        </div>
      </div>
    </div>
  </div>
);
}
