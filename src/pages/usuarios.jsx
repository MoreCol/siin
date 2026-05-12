import { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/usuarios.css';
import '../styles/shared.css';
import { MdEdit, MdDelete, MdAdd } from 'react-icons/md';

const API_URL = 'http://localhost:3000/api/usuarios';

export default function Usuarios() {
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    console.log('cargando usuarios');
    try {
      const res = await axios.get(API_URL);
      console.log('si', res.data);

      const usuariosFormateados = res.data.map(u => ({
        id_usuario: u.id_usuario,
        nombre: u.nombre,
        apellido: u.apellido,
        correo: u.correo,
        password: u.password,
        id_rol: u.id_rol,
        estado: u.estado
      }));

      setListaUsuarios(usuariosFormateados);
    } catch (error) {
      console.log('error al cargar usuarios', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsuarios = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return listaUsuarios;

    return listaUsuarios.filter(u =>
      [u.id_usuario, u.nombre, u.apellido, u.correo, u.password, u.id_rol, u.estado].some(v =>
        String(v).toLowerCase().includes(q)
      )
    );
  }, [listaUsuarios, search]);

  const editarUsuario = usuario => {
    setEditingUser(usuario);
    setShowModal(true);
  };

  const eliminarUsuario = async id_usuario => {
    if (!confirm('¿Eliminar este usuario?')) return;

    try {
      await axios.delete(`${API_URL}/${id_usuario}`);
      res.status(200).json({ message: 'Producto eliminado' });

      setListaUsuarios(prev => prev.filter(u => u.id_usuario !== id_usuario));
    } catch (error) {
      await cargarUsuarios();
    }
  };

  const handleGuardar = async e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    console.log('formData');

    const newData = {
      nombre: String(fd.get('nombre')).trim(),
      apellido: String(fd.get('apellido')).trim(),
      correo: String(fd.get('correo')).trim(),
      password: String(fd.get('password')).trim(),
      id_rol: Number(fd.get('id_rol')),
      estado: fd.get('estado')
    };

    console.log('informacion leida');
    try {
      if (editingUser) {
        await axios.put(`${API_URL}/${editingUser.id_usuario}`, newData);
        console.log('producto actualizado');
      } else {
        await axios.post(API_URL, newData);
      }

      await cargarUsuarios();

      setEditingUser(null);
      setShowModal(false);
      e.target.reset();
    } catch (error) {
      console.error('Error al guardar', error);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="header-left">
          <h1 className="usuarios-title">
            Usuarios <span></span>
          </h1>
        </div>
      </div>

      <div className="filtros-bar">
        <div className="filtros-izq">
          <input
            className="filtro-input"
            placeholder="🔍 Buscar por nombre, apellido, correo, rol, estado..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="filtros-der">
          <button
            className="btn-producto btn-nuevo"
            onClick={() => {
              setEditingUser(null);
              setShowModal(true);
            }}
          >
            <MdAdd className="add-icon" /> Agregar usuario
          </button>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2>Lista de usuarios</h2>
        </div>

        <div className="table-responsive">
          <table className="usuarios-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Correo</th>
                <th>Contraseña</th>

                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsuarios.map(u => (
                <tr key={u.id_usuario}>
                  <td>{u.nombre}</td>
                  <td>{u.apellido}</td>
                  <td>{u.correo}</td>

                  <td>{u.id_rol === 1 ? 'Admin' : u.id_rol === 2 ? 'Cajero' : 'Responsable Inventario'}</td>
                  <td>{u.estado ? 'Activo' : 'Inactivo'}</td>
                  <td className="acciones-cell">
                    <button className="btn-accion editar" onClick={() => editarUsuario(u)} title="Editar">
                      <MdEdit />
                    </button>
                    <button
                      className="btn-accion eliminar"
                      onClick={() => eliminarUsuario(u.id_usuario)}
                      title="Eliminar"
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <button className="btn-ver" type="button">
            Ver usuarios
          </button>
        </div>
      </div>

      {showModal && (
        <div
          className="modal-overlay"
          onClick={e => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div className="modal-content">
            <h2>{editingUser ? 'Editar' : 'Agregar'} usuario</h2>

            <form onSubmit={handleGuardar}>
              <input
                className="usuarios-modal-input"
                name="nombre"
                placeholder="Nombre"
                defaultValue={editingUser?.nombre}
                required
              />
              <input
                className="usuarios-modal-input"
                name="apellido"
                placeholder="Apellido"
                defaultValue={editingUser?.apellido}
                required
              />
              <input
                className="usuarios-modal-input"
                name="correo"
                placeholder="Correo"
                defaultValue={editingUser?.correo}
                type="email"
                required
              />
              <input
                className="usuarios-modal-input"
                name="password"
                placeholder="Contraseña"
                defaultValue={editingUser?.password}
                type="password"
              />

              <select className="usuarios-modal-input" name="id_rol" defaultValue={editingUser?.id_rol ?? 1} required>
                <div className="selected ">
                  <option value="1">Admin</option>
                  <option value="2">Cajero</option>
                  <option value="3">Responsable Inventario</option>
                </div>
              </select>

              <select
                className="usuarios-modal-input"
                name="estado"
                defaultValue={editingUser?.estado ? 1 : 0}
                required
              >
                <div className="selected">
                  <option value="1">Activo</option>
                  <option value="0">Inactivo</option>
                </div>
              </select>

              <div className="usuarios-modal-actions">
                <button type="button" className="btn-cancelar" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-guardar">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
