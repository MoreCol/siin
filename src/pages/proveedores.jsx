import { useMemo, useState, useEffect } from 'react';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';
import axios from 'axios';


import '../styles/shared.css';
import '../styles/proveedores.css';

const API_URL = 'http://localhost:3000/api/proveedores';

export default function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);








  useEffect(() => {
    cargarProveedores();
  }, []);

  const cargarProveedores = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);

      const ProveedoresFormateados = res.data.map(p => ({
        id_proveedor: p.id_proveedor,
        nit: p.nit || '',
        nombre: p.nombre || '',
        telefono: p.telefono || '',

        email: p.correo || '',
        direccion: p.direccion || '',
        estado: p.estado ? 'Activo' : 'Inactivo'
      }));
      setProveedores(ProveedoresFormateados);
    } catch (error) {
      console.error('Error cargando proveedores:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProv = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return proveedores;
    return proveedores.filter(p =>
      [p.nit, p.nombre, p.telefono, p.email, p.estado].some(v => String(v).toLowerCase().includes(q))
    );
  }, [proveedores, search]);

  const editarUsuario = () => {
    setEditing(null);
    setShowModal(true);
  };

  const eliminarProveedor = async id_proveedor => {
    if (!confirm('¿Eliminar este proveedor?')) return;

    try {
      await axios.delete(`${API_URL}/${id_proveedor}`);

      setProveedores(prev => prev.filter(u => u.id_usuario !== id_usuario));
    } catch (error) {
      await cargarProveedores();
    }
  };

  const handleGuardar = async e => {
    e.preventDefault();
    const fd = new FormData(e.target);

    const Proovdata = {
      nit: Number(fd.get('nit')),
      nombre: String(fd.get('nombre')).trim(),
      telefono: Number(fd.get('telefono')),
      correo: String(fd.get('email')).trim(),
      direccion: String(fd.get('direccion')).trim(),
      estado: String(fd.get('estado')).trim() === 'Activo'
    };

    try {
      if (editing) {
        await axios.put(`${API_URL}/${editing.id_proveedor}`, Proovdata);
      } else {
        await axios.post(API_URL, Proovdata);
      }
      await cargarProveedores();

      setShowModal(false);
      setEditing(null);
      e.target.reset();
      await cargarProveedores();
    } catch (error) {
      console.error('Error al guardar proveedor', error);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="header-left">
          <h1 className="proveedores-title">Proveedores</h1>
        </div>
      </div>

      <div className="filtros-bar">
        <div className="filtros-izq">
          <input
            className="filtro-input"
            placeholder=" Buscar por NIT, nombre, teléfono, email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="filtros-der">
          <button
            className="btn-producto btn-nuevo"
            onClick={() => {
              setEditing(null);
              setShowModal(true);
            }}
          >
            <MdAdd className="add-icon" /> Agregar Proveedor
          </button>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2>Lista de proveedores</h2>
        </div>

        <div className="table-responsive">
          <table className="proveedores-table">
            <thead>
              <tr>
                <th>NIT</th>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Dirección</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProv.map(p => (
                <tr key={p.id_proveedor}>
                  <td>{p.nit}</td>
                  <td>{p.nombre}</td>
                  <td>{p.telefono}</td>
                  <td>{p.email}</td>
                  <td>{p.direccion}</td>
                  <td>{p.estado}</td>
                  <td className="acciones-cell">
                    <button className="btn-accion editar" onClick={() => editarUsuario(p)} title="Editar">
                      <MdEdit />
                    </button>
                    <button
                      className="btn-accion eliminar"
                      onClick={() => eliminarProveedor(p.id_proveedor)}
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
          <button className="btn-ver" type="button" >
            Ver proveedores
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
            <h2>{editing ? 'Editar' : 'Nuevo'} proveedor</h2>

            <form onSubmit={handleGuardar}>
              <input
                name="nit"
                className="proveedores-modal-input"
                placeholder="NIT (número)"
                type="number"
                defaultValue={editing?.nit}
                required
              />
              <input
                name="nombre"
                className="proveedores-modal-input"
                placeholder="Nombre del proveedor"
                defaultValue={editing?.nombre}
                required
              />
              <input
                name="telefono"
                className="proveedores-modal-input"
                placeholder="Teléfono"
                defaultValue={editing?.telefono}
                required
              />
              <input
                name="email"
                type="email"
                className="proveedores-modal-input"
                placeholder="Email"
                defaultValue={editing?.email}
                required
              />
              <input
                name="direccion"
                className="proveedores-modal-input"
                placeholder="Dirección"
                defaultValue={editing?.direccion}
                required
              />

              <select name="estado" className="proveedores-modal-input" defaultValue={editing?.estado ?? 'Activo'}>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>

              <div className="proveedores-modal-actions">
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
