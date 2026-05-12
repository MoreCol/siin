import { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import '../styles/shared.css';
import '../styles/pedidos.css';
import { MdEdit, MdDelete, MdAdd } from 'react-icons/md';
import * as XLSX from 'xlsx';

const API_PEDIDOS = 'http://localhost:3000/api/pedidos';
const API_PRODUCTOS = 'http://localhost:3000/api/products';
const API_PROVEEDORES = 'http://localhost:3000/api/proveedores';
const API_DETALLES = 'http://localhost:3000/api/detalles';

const initialPedidoForm = {
  fecha_pedido: '',
  fecha_entrega: '',
  estado: 'Pendiente'
};

const initialDetalleForm = {
  id_producto: '',
  id_proveedor: '',
  cantidad: 1
};

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPedido, setEditingPedido] = useState(null);
  const [editingDetalle, setEditingDetalle] = useState(null);
  const [loading, setLoading] = useState(true);

  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  const [detallePedidos, setDetallePedidos] = useState([]);
  const [pedidoForm, setPedidoForm] = useState(initialPedidoForm);
  const [detalleForm, setDetalleForm] = useState(initialDetalleForm);

  useEffect(() => {
    cargarPedidos();
    cargarProductos();
    cargarProveedores();
  }, []);

  const cargarPedidos = async () => {
    try {
      const resPedidos = await axios.get(API_PEDIDOS);
      const resDetalles = await axios.get(API_DETALLES);

      const pedidosFormateados = resPedidos.data.map(p => {
        const detalles = resDetalles.data.filter(d => d.id_pedido === p.id_pedido);

        return {
          id_pedido: p.id_pedido,
          fecha_pedido: p.fecha_pedido,
          fecha_entrega: p.fecha_entrega,
          estado: p.estado,
          items: detalles.map(d => ({
            id_detalle_pedido: d.id_detalle_pedido,
            id_producto: d.id_producto,
            producto_descripcion: d.producto?.descripcion || 'Sin producto',
            id_proveedor: d.id_proveedor,
            proveedor_nombre: d.proveedor?.nombre || 'Sin proveedor',
            cantidad: Number(d.cantidad)
          }))
        };
      });

      setPedidos(pedidosFormateados);
    } catch (error) {
      console.error('Error cargando pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarProductos = async () => {
    try {
      const res = await axios.get(API_PRODUCTOS);
      setProductos(res.data.data);
    } catch (error) {
      console.error('Error cargando productos:', error);
    }
  };

  const cargarProveedores = async () => {
    try {
      const res = await axios.get(API_PROVEEDORES);
      setProveedores(res.data);
    } catch (error) {
      console.error('Error cargando proveedores:', error);
    }
  };

  const pedidosFiltrados = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return pedidos;

    return pedidos.filter(p =>
      [p.id_pedido, p.fecha_pedido, p.fecha_entrega, p.estado].some(v => String(v).toLowerCase().includes(q))
    );
  }, [pedidos, search]);

  const resetForms = () => {
    setEditingPedido(null);
    setEditingDetalle(null);
    setDetallePedidos([]);
    setPedidoForm({ ...initialPedidoForm });
    setDetalleForm({ ...initialDetalleForm });
  };

  const abrirModal = () => {
    resetForms();
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    resetForms();
  };

  const editarPedido = pedido => {
    setEditingPedido(pedido);
    setDetallePedidos(
      (pedido.items || []).map(x => ({
        ...x,
        id: x.id_detalle_pedido || Date.now()
      }))
    );
    setPedidoForm({
      fecha_pedido: pedido.fecha_pedido || '',
      fecha_entrega: pedido.fecha_entrega || '',
      estado: pedido.estado || 'Pendiente'
    });
    setDetalleForm({ ...initialDetalleForm });
    setShowModal(true);
  };

  const cambiarPedidoForm = e => {
    const { name, value } = e.target;
    setPedidoForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const cambiarDetalleForm = e => {
    const { name, value } = e.target;
    setDetalleForm(prev => ({
      ...prev,
      [name]: name === 'cantidad' || name.startsWith('id_') ? Number(value) || '' : value
    }));
  };

  const agregarItem = e => {
    e.preventDefault();

    if (!detalleForm.id_producto) return alert('Seleccione un producto');
    if (!detalleForm.id_proveedor) return alert('Seleccione un proveedor');
    if (!detalleForm.cantidad || detalleForm.cantidad < 1) return alert('Cantidad inválida');

    const prod = productos.find(p => Number(p.id) === Number(detalleForm.id_producto));
    const prov = proveedores.find(p => Number(p.id_proveedor || p.id) === Number(detalleForm.id_proveedor));

    const itemNuevo = {
      id_detalle_pedido: editingDetalle ? editingDetalle.id_detalle_pedido : Date.now(),
      id_producto: Number(detalleForm.id_producto),
      producto_descripcion: prod?.descripcion || 'Sin producto',
      id_proveedor: Number(detalleForm.id_proveedor),
      proveedor_nombre: prov?.nombre || 'Sin proveedor',
      cantidad: Number(detalleForm.cantidad)
    };

    setDetallePedidos(prev => {
      if (editingDetalle) {
        return prev.map(it => (it.id === editingDetalle.id ? { ...itemNuevo, id: editingDetalle.id } : it));
      }
      return [{ ...itemNuevo, id: Date.now() }, ...prev];
    });

    setEditingDetalle(null);
    setDetalleForm({ ...initialDetalleForm });
  };

  const editarItem = item => {
    setEditingDetalle(item);
    setDetalleForm({
      id_producto: item.id_producto,
      id_proveedor: item.id_proveedor,
      cantidad: item.cantidad
    });
  };

  const eliminarItem = id => {
    setDetallePedidos(prev => prev.filter(it => it.id !== id));
    if (editingDetalle?.id === id) setEditingDetalle(null);
  };

  const handleGuardar = async () => {
    if (detallePedidos.length === 0) return alert('Agrega al menos un detalle');
    if (!pedidoForm.fecha_pedido) return alert('Falta la fecha del pedido');
    if (!pedidoForm.fecha_entrega) return alert('Falta la fecha de entrega');
    if (!pedidoForm.estado) return alert('Falta el estado');

    try {
      const pedidoPayload = {
        fecha_pedido: pedidoForm.fecha_pedido,
        fecha_entrega: pedidoForm.fecha_entrega,
        estado: pedidoForm.estado,
        detalles: detallePedidos.map(i => ({
          id_producto: i.id_producto,
          id_proveedor: i.id_proveedor,
          cantidad: i.cantidad
        }))
      };

      if (editingPedido) {
        await axios.put(`${API_PEDIDOS}/${editingPedido.id_pedido}`, pedidoPayload);
      } else {
        await axios.post(API_PEDIDOS, pedidoPayload);
      }

      await cargarPedidos();
      cerrarModal();
    } catch (error) {
      console.error('Error guardando pedido:', error);
      alert('No se pudo guardar');
    }
  };

  const eliminarPedido = async id_pedido => {
    if (!confirm('¿Eliminar este pedido?')) return;

    try {
      await axios.delete(`${API_PEDIDOS}/${id_pedido}`);
      setPedidos(prev => prev.filter(p => p.id_pedido !== id_pedido));
    } catch (error) {
      console.error('Error eliminando pedido:', error);
      alert('No se pudo eliminar');
    }
  };
  const cambiarEstadoPedido = async (id_pedido, nuevoEstado) => {
    try {
      await axios.put(`${API_PEDIDOS}/${id_pedido}`, { estado: nuevoEstado });
      const pedidoActualziado = pedidos.map(p => {
        if (p.id_pedido === id_pedido) {
          return { p, estado: nuevoEstado.toLowerCase() };
        }
        return p;
      });
      setPedidos(pedidosActualizados);
    } catch (error) {
      alert('no se eude cambiar estado');
    }
  };

  const exportarExcel = () => {
    const data = pedidosFiltrados.flatMap(pedido =>
      (pedido.items || []).map(item => ({
        ID_Pedido: pedido.id_pedido,
        Fecha_Pedido: pedido.fecha_pedido,
        Fecha_Entrega: pedido.fecha_entrega,
        Estado: pedido.estado,
        Producto: item.producto_descripcion,
        Proveedor: item.proveedor_nombre,
        Cantidad: item.cantidad
      }))
    );

    if (data.length === 0) {
      alert('No hay pedidos para exportar');
      return;
    }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pedidos');
    XLSX.writeFile(wb, `pedidos_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  if (loading) {
    return <div className="container">Cargando pedidos...</div>;
  }

  return (
    <div className="container">
      <div className="header">
        <div className="header-left">
          <h1 className="inventario-title">Pedidos</h1>
        </div>
      </div>

      <div className="filtros-bar">
        <div className="filtros-izq">
          <input
            className="filtro-input search-global"
            placeholder="🔍 Buscar por pedido, fecha o estado..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="filtros-der">
          <button className="btn-producto btn-nuevo" type="button" onClick={abrirModal}>
            <MdAdd className="add-icon" />
            Nuevo pedido
          </button>
          <button className="btn-producto btn-nuevo" type="button" onClick={exportarExcel}>
            Exportar Excel
          </button>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2>Pedidos registrados</h2>
        </div>

        <div className="table-responsive">
          <table className="inventario-table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Fecha pedido</th>
                <th>Fecha entrega</th>
                <th>Estado</th>
                <th>Items</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidosFiltrados.map(p => (
                <tr key={p.id_pedido}>
                  <td>{p.id_pedido}</td>
                  <td>{p.fecha_pedido}</td>
                  <td>{p.fecha_entrega}</td>
                  <td>
                    <span className={`estado-badge ${p.estado.toLowerCase()}`}> {p.estado} </span>
                    {p.estado === 'Enviado' && (
                      <button onClick={() => cambiarEstadoPedido(Pedidos.id_pedido, 'Recibido')}></button>
                    )}
                  </td>
                  <td>{p.items?.length || 0}</td>
                  <td className="acciones-cell">
                    <button className="btn-accion editar" onClick={() => editarPedido(p)} title="Editar">
                      <MdEdit />
                    </button>
                    <button
                      className="btn-accion eliminar"
                      onClick={() => eliminarPedido(p.id_pedido)}
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
      </div>

      {showModal && (
        <div
          className="modal-overlay modal-pedido"
          onClick={e => {
            if (e.target === e.currentTarget) cerrarModal();
          }}
        >
          <div className="modal-content">
            <h2>{editingPedido ? 'Editar pedido' : 'Nuevo pedido'}</h2>
            <h4 className="subtitle">Agrega productos al pedido</h4>

            <form onSubmit={agregarItem}>
              <div className="fechas-row">
                <label>Fecha pedido</label>
                <input
                  type="date"
                  name="fecha_pedido"
                  value={pedidoForm.fecha_pedido}
                  onChange={cambiarPedidoForm}
                  required
                />

                <label>Fecha entrega</label>
                <input
                  type="date"
                  name="fecha_entrega"
                  value={pedidoForm.fecha_entrega}
                  onChange={cambiarPedidoForm}
                  required
                />
              </div>

              <div className="estado-row">
                <label>Estado</label>
                <select name="estado" value={pedidoForm.estado} onChange={cambiarPedidoForm} required>
                  <div className="selected">
                    <option value="Pendiente">Pendiente</option>
                    <option value="Enviado">Enviado</option>
                    <option value="Recibido">Recibido</option>
                    <option value="Cancelado">Cancelado</option>
                  </div>
                </select>
              </div>

              <label>Producto</label>
              <select name="id_producto" value={detalleForm.id_producto} onChange={cambiarDetalleForm} required>
                <option className="selected" value="">
                  Seleccione un producto
                </option>
                {productos.map(p => (
                  <option className="selected" key={p.id} value={p.id}>
                    {p.codigo_barras} - {p.descripcion}
                  </option>
                ))}
              </select>

              <label>Proveedor</label>
              <select name="id_proveedor" value={detalleForm.id_proveedor} onChange={cambiarDetalleForm} required>
                <option className="selected" value="">
                  Seleccione un proveedor
                </option>
                {proveedores.map(pr => (
                  <option className="selected" key={pr.id_proveedor || pr.id} value={pr.id_proveedor || pr.id}>
                    {pr.nombre}
                  </option>
                ))}
              </select>

              <label>Cantidad</label>
              <input
                type="number"
                name="cantidad"
                placeholder="Cantidad"
                min="1"
                step="1"
                value={detalleForm.cantidad}
                onChange={cambiarDetalleForm}
                required
              />

              <div className="modal-actions">
                <button type="button" className="btn-cancelar" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-guardar">
                  {editingDetalle ? 'Guardar ítem' : 'Agregar ítem'}
                </button>
              </div>
            </form>

            <div className="modal-pedido  table-container" style={{ marginTop: '0.5rem' }}>
              <div className="table-header">
                <h2>Ítems del pedido</h2>
              </div>

              <div className="table-responsive">
                <table className="inventario-table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Proveedor</th>
                      <th>Cantidad</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detallePedidos.map(item => (
                      <tr key={item.id}>
                        <td>{item.producto_descripcion}</td>
                        <td>{item.proveedor_nombre}</td>
                        <td>{item.cantidad}</td>
                        <td className="acciones-cell">
                          <button className="btn-accion editar" type="button" onClick={() => editarItem(item)}>
                            <MdEdit />
                          </button>
                          <button className="btn-accion eliminar" type="button" onClick={() => eliminarItem(item.id)}>
                            <MdDelete />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-actions" style={{ marginTop: '1rem' }}>
              <button type="button" className="btn-cancelar" onClick={cerrarModal}>
                Cerrar
              </button>
              <button type="button" className="btn-guardar" onClick={handleGuardar}>
                Guardar pedido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
