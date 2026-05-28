import { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { MdEdit, MdDelete, MdAdd } from 'react-icons/md';
import * as XLSX from 'xlsx';
import { Button } from '../components/ui/Button';
import { FilterBar } from '../components/ui/filterBar';

const API_PEDIDOS     = 'http://localhost:3000/api/pedidos';
const API_PRODUCTOS   = 'http://localhost:3000/api/products';
const API_PROVEEDORES = 'http://localhost:3000/api/proveedores';
const API_DETALLES    = 'http://localhost:3000/api/detalles';

const initialPedidoForm  = { fecha_pedido: '', fecha_entrega: '', estado: 'Pendiente' };
const initialDetalleForm = { id_producto: '', id_proveedor: '', cantidad: 1 };

export default function Pedidos() {
  const [pedidos, setPedidos]               = useState([]);
  const [search, setSearch]                 = useState('');
  const [loading, setLoading]               = useState(true);
  const [productos, setProductos]           = useState([]);
  const [proveedores, setProveedores]       = useState([]);
  const [pedidoForm, setPedidoForm]         = useState(initialPedidoForm);
  const [detalleForm, setDetalleForm]       = useState(initialDetalleForm);
  const [detallePedidos, setDetallePedidos] = useState([]);
  const [editingPedido, setEditingPedido]   = useState(null);
  const [editingDetalle, setEditingDetalle] = useState(null);
  const [expandido, setExpandido]           = useState(null); // ✅ filas expandibles

  useEffect(() => {
    cargarPedidos();
    cargarProductos();
    cargarProveedores();
  }, []);

  const cargarPedidos = async () => {
    try {
      const [resPedidos, resDetalles] = await Promise.all([
        axios.get(API_PEDIDOS),
        axios.get(API_DETALLES),
      ]);
      const pedidosFormateados = resPedidos.data.map(p => {
        const detalles = resDetalles.data.filter(d => d.id_pedido === p.id_pedido);
        return {
          id_pedido:     p.id_pedido,
          fecha_pedido:  p.fecha_pedido,
          fecha_entrega: p.fecha_entrega,
          estado:        p.estado,
          items: detalles.map(d => ({
            id_detalle_pedido:    d.id_detalle_pedido,
            id_producto:          d.id_producto,
            producto_descripcion: d.producto?.descripcion || 'Sin producto',
            id_proveedor:         d.id_proveedor,
            proveedor_nombre:     d.proveedor?.nombre    || 'Sin proveedor',
            cantidad:             Number(d.cantidad),
          })),
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
      [p.id_pedido, p.fecha_pedido, p.fecha_entrega, p.estado]
        .some(v => String(v).toLowerCase().includes(q))
    );
  }, [pedidos, search]);

  // ✅ Total estimado del pedido actual
  const totalPedido = useMemo(() =>
    detallePedidos.reduce((acc, item) => {
      const prod = productos.find(p => Number(p.id) === item.id_producto);
      return acc + (Number(prod?.precio_compra ?? prod?.precio_Compra ?? 0) * item.cantidad);
    }, 0),
  [detallePedidos, productos]);

  const resetForms = () => {
    setEditingPedido(null);
    setEditingDetalle(null);
    setDetallePedidos([]);
    setPedidoForm({ ...initialPedidoForm });
    setDetalleForm({ ...initialDetalleForm });
  };

  const editarPedido = pedido => {
    setEditingPedido(pedido);
    setDetallePedidos(
      (pedido.items || []).map(item => ({
        ...item,
        id: item.id_detalle_pedido || Date.now(),
      }))
    );
    setPedidoForm({
      fecha_pedido:  pedido.fecha_pedido?.split('T')[0]  || '',
      fecha_entrega: pedido.fecha_entrega?.split('T')[0] || '',
      estado:        pedido.estado || 'Pendiente',
    });
    setDetalleForm({ ...initialDetalleForm });
    // scroll al formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const agregarItem = e => {
    e.preventDefault();
    if (!detalleForm.id_producto)                          return alert('Seleccione un producto');
    if (!detalleForm.id_proveedor)                         return alert('Seleccione un proveedor');
    if (!detalleForm.cantidad || detalleForm.cantidad < 1) return alert('Cantidad inválida');

    const prod = productos.find(p => Number(p.id) === Number(detalleForm.id_producto));
    const prov = proveedores.find(p => Number(p.id_proveedor ?? p.id) === Number(detalleForm.id_proveedor));

    const itemNuevo = {
      id_detalle_pedido:    editingDetalle?.id_detalle_pedido ?? Date.now(),
      id_producto:          Number(detalleForm.id_producto),
      producto_descripcion: prod?.descripcion || 'Sin producto',
      id_proveedor:         Number(detalleForm.id_proveedor),
      proveedor_nombre:     prov?.nombre      || 'Sin proveedor',
      cantidad:             Number(detalleForm.cantidad),
    };

    setDetallePedidos(prev =>
      editingDetalle
        ? prev.map(it => it.id === editingDetalle.id ? { ...itemNuevo, id: editingDetalle.id } : it)
        : [{ ...itemNuevo, id: Date.now() }, ...prev]
    );

    setEditingDetalle(null);
    setDetalleForm({ ...initialDetalleForm });
  };

  const editarItem = item => {
    setEditingDetalle(item);
    setDetalleForm({
      id_producto:  item.id_producto,
      id_proveedor: item.id_proveedor,
      cantidad:     item.cantidad,
    });
  };

  const eliminarItem = id => {
    setDetallePedidos(prev => prev.filter(it => it.id !== id));
    if (editingDetalle?.id === id) setEditingDetalle(null);
  };

  const handleGuardar = async () => {
    if (detallePedidos.length === 0) return alert('Agrega al menos un detalle');
    if (!pedidoForm.fecha_pedido)    return alert('Falta la fecha del pedido');
    if (!pedidoForm.fecha_entrega)   return alert('Falta la fecha de entrega');
    if (!pedidoForm.estado)          return alert('Falta el estado');

    try {
      const payload = {
        ...pedidoForm,
        detalles: detallePedidos.map(i => ({
          id_producto:  i.id_producto,
          id_proveedor: i.id_proveedor,
          cantidad:     i.cantidad,
        })),
      };

      if (editingPedido) {
        await axios.put(`${API_PEDIDOS}/${editingPedido.id_pedido}`, payload);
      } else {
        await axios.post(API_PEDIDOS, payload);
      }

      await cargarPedidos(); // ✅ recarga primero
      resetForms();          // ✅ limpia después
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
      console.error('Error eliminando:', error);
      alert('No se pudo eliminar');
    }
  };

  const cambiarEstadoPedido = async (id_pedido, nuevoEstado) => {
    try {
      await axios.put(`${API_PEDIDOS}/${id_pedido}`, { estado: nuevoEstado });
      setPedidos(prev =>
        prev.map(p => p.id_pedido === id_pedido ? { ...p, estado: nuevoEstado } : p)
      );
    } catch (error) {
      alert('No se pudo cambiar el estado');
    }
  };

  const exportarExcel = () => {
    const data = pedidosFiltrados.flatMap(pedido =>
      (pedido.items || []).map(item => ({
        ID_Pedido:     pedido.id_pedido,
        Fecha_Pedido:  pedido.fecha_pedido?.split('T')[0] ?? '—',
        Fecha_Entrega: pedido.fecha_entrega?.split('T')[0] ?? '—',
        Estado:        pedido.estado,
        Producto:      item.producto_descripcion,
        Proveedor:     item.proveedor_nombre,
        Cantidad:      item.cantidad,
      }))
    );
    if (data.length === 0) return alert('No hay pedidos para exportar');
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pedidos');
    XLSX.writeFile(wb, `pedidos_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // Helper badge estado
  const badgeEstado = estado => {
    const map = {
      Recibido:  'bg-emerald-50 text-emerald-700 border-emerald-200',
      Pendiente: 'bg-amber-50   text-amber-700   border-amber-200',
      Enviado:   'bg-blue-50    text-blue-700    border-blue-200',
      Cancelado: 'bg-red-50     text-red-700     border-red-200',
    };
    return map[estado] ?? 'bg-slate-100 text-slate-600 border-slate-200';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
        Cargando pedidos...
      </div>
    );
  }

  return (
    <div className="mx-auto">

      {/* TÍTULO */}
      <h1 className="text-4xl font-bold text-slate-800 !px-6 !py-6">Pedidos</h1>

      {/* FORMULARIO PRINCIPAL */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm !p-5 !mb-6">
        <div className="flex justify-between items-center !mb-6">
          <h2 className="text-2xl font-semibold text-slate-800">
            {editingPedido ? 'Editar pedido' : 'Nuevo pedido'}
          </h2>
          {editingPedido && (
            <Button variant="cancel" onClick={resetForms}>
              Cancelar edición
            </Button>
          )}
        </div>

        {/* ✅ FECHAS + ESTADO CON LABELS */}
        <div className="grid grid-cols-1 md:grid-cols-3 !gap-5 !mb-6">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Fecha del pedido
            </label>
            <input
              type="date"
              value={pedidoForm.fecha_pedido}
              onChange={e => setPedidoForm({ ...pedidoForm, fecha_pedido: e.target.value })}
              className="rounded-xl border border-slate-300 !px-4 !py-3"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Fecha de entrega
            </label>
            <input
              type="date"
              value={pedidoForm.fecha_entrega}
              onChange={e => setPedidoForm({ ...pedidoForm, fecha_entrega: e.target.value })}
              className="rounded-xl border border-slate-300 !px-4 !py-3"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Estado
            </label>
            <select
              value={pedidoForm.estado}
              onChange={e => setPedidoForm({ ...pedidoForm, estado: e.target.value })}
              className="rounded-xl border border-slate-300 !px-4 !py-3"
            >
              <option value="Pendiente">Pendiente</option>
              <option value="Enviado">Enviado</option>
              <option value="Recibido">Recibido</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
        </div>

        {/* FORM DETALLE */}
        <form onSubmit={agregarItem}
          className="grid grid-cols-1 md:grid-cols-4 !gap-3 !mb-6">
          <select
            value={detalleForm.id_producto}
            onChange={e => setDetalleForm({ ...detalleForm, id_producto: e.target.value })}
            className="rounded-xl border border-slate-300 !px-4 !py-3"
          >
            <option value="">Seleccionar producto</option>
            {productos.map(p => (
              <option key={p.id} value={p.id}>{p.descripcion}</option>
            ))}
          </select>

          <select
            value={detalleForm.id_proveedor}
            onChange={e => setDetalleForm({ ...detalleForm, id_proveedor: e.target.value })}
            className="rounded-xl border border-slate-300 !px-4 !py-3"
          >
            <option value="">Seleccionar proveedor</option>
            {proveedores.map(p => (
              <option key={p.id_proveedor ?? p.id} value={p.id_proveedor ?? p.id}>
                {p.nombre}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={detalleForm.cantidad}
            onChange={e => setDetalleForm({ ...detalleForm, cantidad: e.target.value })}
            placeholder="Cantidad"
            min="1"
            className="rounded-xl border border-slate-300 !px-4 !py-3"
          />

          <Button type="submit" variant="primary">
            <MdAdd className="text-sm" />
            {editingDetalle ? 'Actualizar ítem' : 'Agregar ítem'}
          </Button>
        </form>

        {/* BOTONES GUARDAR */}
        <div className="flex justify-between items-center !mt-2">
          {/* ✅ Total estimado */}
          <p className="text-sm text-slate-500">
            Total estimado:{' '}
            <span className="font-semibold text-emerald-600">
              ${totalPedido.toLocaleString()}
            </span>
          </p>
          <div className="flex !gap-3">
            <Button variant="cancel" onClick={resetForms}>Limpiar</Button>
            <Button variant="primary" onClick={handleGuardar}>Guardar pedido</Button>
          </div>
        </div>
      </section>

      {/* ÍTEMS DEL PEDIDO ACTUAL */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm !p-5 !mb-6">
        <h2 className="text-xl font-semibold text-slate-800 !mb-4">
          Ítems del pedido
          {detallePedidos.length > 0 && (
            <span className="!ml-2 text-sm font-normal text-slate-400">
              ({detallePedidos.length} ítem{detallePedidos.length !== 1 ? 's' : ''})
            </span>
          )}
        </h2>

        <div className="overflow-x-auto rounded-2xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['Producto', 'Proveedor', 'Cantidad', 'Acciones'].map(h => (
                  <th key={h}
                    className="!px-4 !py-3 text-left text-xs font-medium
                      text-slate-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {detallePedidos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center !py-8 text-slate-400 text-sm">
                    Sin ítems agregados — usa el formulario de arriba
                  </td>
                </tr>
              ) : (
                detallePedidos.map(i => (
                  <tr key={i.id} className="hover:bg-slate-50 transition-colors">
                    <td className="!px-4 !py-3 text-slate-800 font-medium">
                      {i.producto_descripcion}
                    </td>
                    <td className="!px-4 !py-3 text-slate-600">{i.proveedor_nombre}</td>
                    <td className="!px-4 !py-3 text-slate-600">{i.cantidad}</td>
                    <td className="!px-4 !py-3">
                      <div className="flex gap-2">
                        <Button variant="edit" onClick={() => editarItem(i)}>
                          <MdEdit />
                        </Button>
                        <Button variant="delete" onClick={() => eliminarItem(i.id)}>
                          <MdDelete />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* FILTROS */}
      <FilterBar
        search={
          <input
            placeholder="Buscar por ID, fecha o estado..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full outline-none bg-transparent text-slate-700
              text-sm placeholder-slate-400"
          />
        }
      />

      {/* LISTA DE PEDIDOS REGISTRADOS */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm !p-5 !mt-6">
        <div className="flex justify-between items-center !mb-4">
          <h2 className="text-xl font-semibold text-slate-800">
            Pedidos registrados
            <span className="!ml-2 text-sm font-normal text-slate-400">
              ({pedidosFiltrados.length})
            </span>
          </h2>
          <Button variant="primary" onClick={exportarExcel}>
            Exportar Excel
          </Button>
        </div>

        <div className="overflow-x-auto rounded-2xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['', '#', 'Fecha pedido', 'Fecha entrega', 'Estado', 'Ítems', 'Acciones'].map(h => (
                  <th key={h}
                    className="!px-4 !py-3 text-left text-xs font-medium
                      text-slate-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pedidosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center !py-8 text-slate-400 text-sm">
                    No se encontraron pedidos
                  </td>
                </tr>
              ) : (
                pedidosFiltrados.map(p => (
                  <>
                    <tr key={p.id_pedido}
                      className="hover:bg-slate-50 transition-colors border-b border-slate-100">

                      {/* ✅ Botón expandir */}
                      <td className="!px-3 !py-3">
                        <button
                          onClick={() => setExpandido(expandido === p.id_pedido ? null : p.id_pedido)}
                          className="w-6 h-6 flex items-center justify-center
                            rounded-md text-slate-400 hover:bg-slate-100
                            hover:text-slate-600 transition-colors text-xs">
                          {expandido === p.id_pedido ? '▲' : '▼'}
                        </button>
                      </td>

                      <td className="!px-4 !py-3 font-mono text-xs text-slate-500">
                        #{p.id_pedido}
                      </td>
                      <td className="!px-4 !py-3 text-slate-600">
                        {p.fecha_pedido?.split('T')[0] ?? '—'}
                      </td>
                      <td className="!px-4 !py-3 text-slate-600">
                        {p.fecha_entrega?.split('T')[0] ?? '—'}
                      </td>

                      {/* ✅ Cambio de estado rápido */}
                      <td className="!px-4 !py-3">
                        <select
                          value={p.estado}
                          onChange={e => cambiarEstadoPedido(p.id_pedido, e.target.value)}
                          className={`text-xs rounded-lg border !px-2 !py-1 font-medium
                            cursor-pointer transition-colors ${badgeEstado(p.estado)}`}
                        >
                          <option value="Pendiente">Pendiente</option>
                          <option value="Enviado">Enviado</option>
                          <option value="Recibido">Recibido</option>
                          <option value="Cancelado">Cancelado</option>
                        </select>
                      </td>

                      <td className="!px-4 !py-3 text-slate-500 text-xs">
                        {p.items?.length ?? 0} ítem(s)
                      </td>

                      <td className="!px-4 !py-3">
                        <div className="flex gap-2">
                          <Button variant="edit" onClick={() => editarPedido(p)}>
                            <MdEdit />
                          </Button>
                          <Button variant="delete" onClick={() => eliminarPedido(p.id_pedido)}>
                            <MdDelete />
                          </Button>
                        </div>
                      </td>
                    </tr>

                    {/* ✅ Fila expandible con ítems del pedido */}
                    {expandido === p.id_pedido && (
                      <tr key={`${p.id_pedido}-detalle`}>
                        <td colSpan={7} className="!px-6 !py-3 bg-slate-50 border-b border-slate-100">
                          {p.items?.length === 0 ? (
                            <p className="text-xs text-slate-400">Sin ítems registrados</p>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {p.items.map(i => (
                                <span key={i.id_detalle_pedido}
                                  className="inline-flex items-center gap-1 !px-3 !py-1
                                    bg-white border border-slate-200 rounded-lg
                                    text-xs text-slate-600">
                                  <span className="font-medium text-slate-800">
                                    {i.producto_descripcion}
                                  </span>
                                  <span className="text-slate-400">×</span>
                                  <span>{i.cantidad}</span>
                                  <span className="text-slate-400">·</span>
                                  <span className="text-slate-500">{i.proveedor_nombre}</span>
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}