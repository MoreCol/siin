import { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import '../styles/inventario.css';
import '../styles/productos.css';
import { MdEdit, MdDelete, MdAdd } from 'react-icons/md';

const API_URL = 'http://localhost:3000/api/inventario'; // ← CAMBIO

export default function Inventario() {
  const [ListaInventarios, setListaInventarios] = useState([]); // ← Plural
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingInvent, setEditingInvent] = useState(null); // ← Invent
  const [loading, setLoading] = useState(true);
  const [productos, setProductos] = useState([]); // ← Para select

  useEffect(() => {
    cargarInventarios();
    cargarProductos(); // ← Cargar para select
  }, []);

  const cargarInventarios = async () => {
    console.log(' Cargando inventarios...');
    try {
      const res = await axios.get(API_URL);
      console.log(' Respuesta inventarios:', res.data);

      const inventariosFormateados = res.data.map(i => ({
        id_movimiento: i.id_movimiento, // ← PK backend
        id_producto: i.id_producto,
        producto_descripcion: i.producto?.descripcion || 'Sin producto',
        id_usuario: i.id_usuario,
        tipo_movimiento: i.tipo_movimiento,
        cantidad: Number(i.cantidad),
        fecha_movimiento: i.fecha_movimiento || i.fecha_moviento,
        descripcion: i.descripcion || ''
      }));
      setListaInventarios(inventariosFormateados);
    } catch (error) {
      console.error('❌ Error cargando inventarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarProductos = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/products');
      setProductos(res.data);
    } catch (error) {
      console.error('Error productos:', error);
    }
  };

  const filteredInventarios = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ListaInventarios;

    return ListaInventarios.filter(i =>
      [i.id_movimiento, i.producto_descripcion, i.tipo_movimiento, i.cantidad, i.descripcion].some(v =>
        String(v).toLowerCase().includes(q)
      )
    );
  }, [ListaInventarios, search]);

  const editarInvent = invent => {
    setEditingInvent(invent);
    setShowModal(true);
  };

  const eliminarInvent = async id_movimiento => {
    if (!confirm('¿Eliminar este movimiento?')) return;

    try {
      await axios.delete(`${API_URL}/${id_movimiento}`);
      setListaInventarios(prev => prev.filter(i => i.id_movimiento !== id_movimiento));
    } catch (error) {
      alert('Error eliminando');
      cargarInventarios();
    }
  };

  const handleGuardar = async e => {
    e.preventDefault();
    const fd = new FormData(e.target);

    const inventData = {
      id_producto: Number(fd.get('id_producto')),

      id_usuario: Number(fd.get('id_usuario')),
      tipo_movimiento: String(fd.get('tipo_movimiento')).trim(),
      cantidad: Number(fd.get('cantidad')),
      fecha_movimiento: fd.get('fecha_movimiento'), // ← FALTABA
      descripcion: String(fd.get('descripcion')).trim()
    };

    console.log('INVENTDATA PARSED =>', inventData);
    console.log('VALIDATION =>', {
      id_producto: Number.isNaN(inventData.id_producto),
      id_usuario: Number.isNaN(inventData.id_usuario),
      cantidad: Number.isNaN(inventData.cantidad),
      tipo_movimiento: inventData.tipo_movimiento,
      descripcion: inventData.descripcion
    });

    console.log('VALOR SELECT:', fd.get('id_producto'));

    /*if (!inventData.id_producto || Number.isNaN(inventData.id_producto)) {
      alert('Selecciona un producto válido');
      return;
    }*/

    try {
      if (editingInvent) {
        await axios.put(`${API_URL}/${editingInvent.id_movimiento}`, inventData);
        console.log('✅ Inventario actualizado');
      } else {
        await axios.post(API_URL, inventData);
        console.log('✅ Nuevo movimiento creado');
      }

      await cargarInventarios();
      setEditingInvent(null);
      setShowModal(false);
      e.target.reset();
    } catch (error) {
      console.error('❌ ERROR COMPLETO:', error);
      console.error('❌ RESPONSE DATA:', error.response?.data);
      console.error('❌ STATUS:', error.response?.status);

      alert(error.response?.data?.message || 'No se pudo guardar');
    }
  };

  if (loading) return <div className="loading">Cargando inventarios...</div>;

  return (
    <div className="container">
      <div className="header">
        <div className="header-left">
          <h1 className="inventario-title">Inventario</h1>
        </div>
      </div>

      <div className="filtros-bar">
        <div className="filtros-izq">
          <input
            className="filtro-input search-global"
            placeholder="🔍 Buscar por código, nombre, tipo, fecha, usuario..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="filtros-der">
          <button
            className="btn-producto btn-nuevo"
            onClick={() => {
              setEditingInvent(null);
              setShowModal(true);
            }}
          >
            <MdAdd className="add-icon" />
            Agregar movimiento
          </button>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2>Movimientos</h2>
        </div>
        <div className="table-responsive">
          <table className="inventario-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Usuario</th>
                <th>Tipo de movimiento</th>
                <th>Cantidad</th>
                <th>Fecha de movimiento</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filteredInventarios.map(m => (
                <tr key={m.id_movimiento}>
                  <td>{m.producto_descripcion}</td>
                  <td>{m.id_usuario}</td>
                  <td>{m.tipo_movimiento}</td>
                  <td>{m.cantidad}</td>
                  <td>{new Date(m.fecha_movimiento).toLocaleDateString()}</td>
                  <td>{m.descripcion}</td>

                  <td className="acciones-cell">
                    <button className="btn-accion editar" onClick={() => editarInvent(m)} title="Editar">
                      <MdEdit />
                    </button>
                    <button
                      className="btn-accion eliminar"
                      onClick={() => eliminarInvent(m.id_movimiento)}
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
          <button className="btn-ver">Ver mas</button>
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
            <h2>{editingInvent ? 'Editar' : 'Nuevo'} movimiento</h2>
            <h4 className="subtitle">Formulario de movimiento</h4>

            <form onSubmit={handleGuardar}>
              <select name="id_producto" defaultValue={editingInvent?.id_producto || ''} required>
                <option value="">Seleccione un producto</option>

                {productos.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.codigo_barras} - {p.descripcion} {/* Opcional: más info */}
                  </option>
                ))}
              </select>

              <input
                type="number"
                name="id_usuario"
                placeholder="usuario"
                defaultValue={editingInvent?.id_usuario || '1'}
                required
              />
              <select name="tipo_movimiento" defaultValue={editingInvent?.tipo_movimiento ?? 'Entrada'}>
                <option value="entrada">Entrada</option>
                <option value="salida">Salida</option>
                <option value="ajuste">Ajuste</option>
              </select>

              <input
                type="number"
                name="cantidad"
                placeholder="Cantidad"
                min="1"
                step="1"
                defaultValue={editingInvent?.cantidad || ''}
                required
              />
              <input
                type="date"
                name="fecha_movimiento"
                defaultValue={
                  editingInvent?.fecha_movimiento
                    ? new Date(editingInvent.fecha_movimiento).toISOString().split('T')[0]
                    : ''
                }
                required
              />
              <input
                type="text"
                name="descripcion"
                placeholder="Descripción"
                defaultValue={editingInvent?.descripcion ?? ''}
                required
              />

              <div className="modal-actions">
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
