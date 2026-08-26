import { useEffect, useMemo, useState, Fragment } from 'react';
import axios from 'axios';
import { MdEdit, MdDelete } from 'react-icons/md';
import * as XLSX from 'xlsx';
import { Button } from '../components/ui/Button';
import { FilterBar } from '../components/ui/filterBar';
import Select from 'react-select';

const API_VENTAS = 'http://localhost:3000/api/ventas';
const API_PRODUCTOS = 'http://localhost:3000/api/products';

const initialVenta = {
  id_usuario: '',
  fecha_venta: '',
  metodo_pago: 'Efectivo',
  estado: 'Pagado'
};

const initialItem = { id_producto: '', cantidad: 1 };

export default function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);

  const [ventaForm, setVentaForm] = useState(initialVenta);
  const [itemForm, setItemForm] = useState(initialItem);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingVenta, setEditingVenta] = useState(null);
  const [expandido, setExpandido] = useState(null);

  // ─── carga ────────────────────────────────────────────────
  useEffect(() => {
    cargarVentas();
    cargarProductos();
  }, []);

  const cargarVentas = async () => {
    try {
      const res = await axios.get(API_VENTAS);
      setVentas(res.data);
    } catch (err) {
      console.error('Error cargando ventas:', err);
    } finally {
      setLoading(false);
    }
  };

  const cargarProductos = async () => {
    try {
      const res = await axios.get(API_PRODUCTOS);
      setProductos(res.data.data ?? res.data);
    } catch (err) {
      console.error('Error cargando productos:', err);
    }
  };

  // ─── helpers ──────────────────────────────────────────────
  const totalItems = useMemo(() => items.reduce((acc, it) => acc + it.cantidad * it.precio_venta, 0), [items]);

  const ventasFiltradas = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ventas;
    return ventas.filter(v =>
      [v.id_venta, v.fecha_venta, v.metodo_pago, v.estado].some(x => String(x).toLowerCase().includes(q))
    );
  }, [ventas, search]);

  const badgeEstado = estado => {
    const map = {
      Pagado: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      Pendiente: 'bg-amber-50   text-amber-700   border-amber-200',
      Cancelado: 'bg-red-50     text-red-700     border-red-200'
    };
    return map[estado] ?? 'bg-slate-100 text-slate-600 border-slate-200';
  };

  const resetForm = () => {
    setVentaForm(initialVenta);
    setItemForm(initialItem);
    setItems([]);
    setEditingVenta(null);
  };

  // ─── items ────────────────────────────────────────────────
  const agregarItem = e => {
    e.preventDefault();
    if (!itemForm.id_producto) return alert('Seleccione un producto');
    if (Number(itemForm.cantidad) < 1) return alert('Cantidad inválida');

    const prod = productos.find(p => Number(p.id) === Number(itemForm.id_producto));
    if (!prod) return alert('Producto no válido');
    if (prod.stock <= 0) return alert('Producto agotado');

    const nuevo = {
      id: Date.now(),
      id_producto: prod.id,
      descripcion: prod.descripcion,
      cantidad: Number(itemForm.cantidad),
      precio_venta: Number(prod.precio_venta),
      subtotal: Number(prod.precio_venta) * Number(itemForm.cantidad)
    };

    setItems(prev => [nuevo, ...prev]);
    setItemForm(initialItem);
  };

  const eliminarItem = id => setItems(prev => prev.filter(i => i.id !== id));

  // ─── CRUD ventas ──────────────────────────────────────────
  const handleGuardar = async () => {
    if (items.length === 0) return alert('Agrega al menos un producto');
    if (!ventaForm.fecha_venta) return alert('Falta la fecha');
    if (!ventaForm.estado) return alert('Falta el estado');
    if (!ventaForm.id_usuario) return alert('Falta el usuario');

    try {
      const payload = {
        id_usuario: Number(ventaForm.id_usuario),
        fecha_venta: ventaForm.fecha_venta,
        metodo_pago: ventaForm.metodo_pago,
        estado: ventaForm.estado,
        total: totalItems,
        detalles: items.map(i => ({
          id_producto: i.id_producto,
          cantidad: i.cantidad,
          subtotal: i.subtotal
        }))
      };

      if (editingVenta) {
        await axios.put(`${API_VENTAS}/${editingVenta.id_venta}`, payload);
      } else {
        await axios.post(API_VENTAS, payload);
      }

      // EXACTAMENTE IGUAL A PEDIDOS
      resetForm(); // ← primero limpia

      await cargarVentas();
      resetForm();
    } catch (error) {
  console.error('Error guardando venta:', error);
  console.error('Detalle:', error.response?.data); // ← agrega esta línea
  alert('No se pudo guardar: ' + JSON.stringify(error.response?.data));
    }
  };
  const editarVenta = v => {
    setEditingVenta(v);
    setVentaForm({
      id_usuario: v.id_usuario ?? '',
      fecha_venta: v.fecha_venta?.split('T')[0] || '',
      metodo_pago: v.metodo_pago ?? 'Efectivo',
      estado: v.estado ?? 'Pagado'
    });
    setItems(
      (v.detalles || []).map(d => {
        const cantNum = Number(d.cantidad);
        const subNum = Number(d.subtotal);
        const precioUn = cantNum > 0 ? subNum / cantNum : 0;
        return {
          id: Date.now() + Math.random(),
          id_producto: d.id_producto,
          descripcion: d.producto?.descripcion || 'Sin producto',
          cantidad: cantNum,
          precio_venta: precioUn,
          subtotal: subNum
        };
      })
    );
    setItemForm(initialItem);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const eliminarVenta = async id => {
    if (!confirm('¿Eliminar esta venta?')) return;
    try {
      await axios.delete(`${API_VENTAS}/${id}`);
      setVentas(prev => prev.filter(v => v.id_venta !== id));
    } catch (err) {
      console.error('Error eliminando venta:', err);
      alert('No se pudo eliminar');
    }
  };

  const cambiarEstadoVenta = async (id_venta, nuevoEstado) => {
    try {
      await axios.put(`${API_VENTAS}/${id_venta}`, { estado: nuevoEstado });
      setVentas(prev => prev.map(v => (v.id_venta === id_venta ? { ...v, estado: nuevoEstado } : v)));
    } catch {
      alert('No se pudo cambiar el estado');
    }
  };

  const exportarExcel = () => {
    const data = ventasFiltradas.flatMap(v =>
      (v.detalles || []).map(d => ({
        ID_Venta: v.id_venta,
        Fecha: v.fecha_venta?.split('T')[0] ?? '—',
        Metodo_Pago: v.metodo_pago,
        Estado: v.estado,
        Total: v.total,
        Producto: d.producto?.descripcion || 'Sin producto',
        Cantidad: d.cantidad,
        Subtotal: d.subtotal
      }))
    );
    if (data.length === 0) return alert('No hay ventas para exportar');
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ventas');
    XLSX.writeFile(wb, `ventas_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // ─── render ───────────────────────────────────────────────
  if (loading) {
    return <div className="flex items-center justify-center py-20 text-slate-400 text-sm">Cargando ventas...</div>;
  }

  return (
    <div className="mx-auto">
      {/* TÍTULO */}
      <h1 className="text-4xl font-bold text-slate-800 px-6 py-6">Ventas</h1>

      {/* ── FORMULARIO PRINCIPAL ─────────────────────────────── */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-slate-800">{editingVenta ? 'Editar venta' : 'Nueva venta'}</h2>
          {editingVenta && (
            <Button variant="cancel" onClick={resetForm}>
              Cancelar edición
            </Button>
          )}
        </div>

        {/* FECHA · ID USUARIO · MÉTODO · ESTADO */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Fecha de venta</label>
            <input
              type="date"
              value={ventaForm.fecha_venta}
              onChange={e => setVentaForm({ ...ventaForm, fecha_venta: e.target.value })}
              className="rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">ID Usuario</label>
            <input
              type="number"
              min="1"
              placeholder="Ej: 1"
              value={ventaForm.id_usuario}
              onChange={e => setVentaForm({ ...ventaForm, id_usuario: e.target.value })}
              className="rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Método de pago</label>
            <select
              value={ventaForm.metodo_pago}
              onChange={e => setVentaForm({ ...ventaForm, metodo_pago: e.target.value })}
              className="rounded-xl border border-slate-300 px-4 py-3"
            >
              <option value="Efectivo">Efectivo</option>
              <option value="Nequi">Nequi</option>
              <option value="Transferencia">Transferencia</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Estado</label>
            <select
              value={ventaForm.estado}
              onChange={e => setVentaForm({ ...ventaForm, estado: e.target.value })}
              className="rounded-xl border border-slate-300 px-4 py-3"
            >
              <option value="Pagado">Pagado</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
        </div>

        {/* FORM AGREGAR ÍTEM */}
        <form onSubmit={agregarItem} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          <Select
            options={productos.map(p => ({
              value: p.id,
              label: `${p.descripcion}${p.stock <= 0 ? ' (Agotado)' : ''}`,
              isDisabled: p.stock <= 0
            }))}
            value={
              productos
                .filter(p => Number(p.id) === Number(itemForm.id_producto))
                .map(p => ({
                  value: p.id,
                  label: `${p.descripcion}${p.stock <= 0 ? ' (Agotado)' : ''}`,
                  isDisabled: p.stock <= 0
                }))[0] || null
            }
            onChange={selected => setItemForm({ ...itemForm, id_producto: selected?.value || '' })}
            placeholder="Seleccionar producto"
            isSearchable
            className="md:col-span-3 text-sm"
            styles={{
              control: base => ({
                ...base,
                borderRadius: '12px',
                minHeight: '48px',
                borderColor: '#cbd5e1'
              })
            }}
          />

          <input
            type="number"
            min="1"
            value={itemForm.cantidad}
            onChange={e => setItemForm({ ...itemForm, cantidad: e.target.value })}
            placeholder="Cantidad"
            className="rounded-xl border border-slate-300 px-4 py-3"
          />

          <div className="md:col-span-4 flex justify-end">
            <Button type="submit" variant="primary">
              Agregar ítem
            </Button>
          </div>
        </form>

        <div className="my-4 border-t border-slate-200" />

        {/* TOTAL + GUARDAR */}
        <div className="flex justify-between items-center mt-2">
          <p className="text-sm text-slate-500">
            Total estimado:{' '}
            <span className="font-semibold text-emerald-600">${totalItems.toLocaleString('es-CO')}</span>
          </p>
          <div className="flex gap-3">
            <Button variant="cancel" onClick={resetForm}>
              Limpiar
            </Button>
            <Button variant="primary" onClick={handleGuardar}>
              {editingVenta ? 'Actualizar venta' : 'Guardar venta'}
            </Button>
          </div>
        </div>
      </section>

      {/* ── ÍTEMS DEL FORMULARIO ACTUAL ───────────────────────── */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 mb-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">
          Ítems de la venta
          {items.length > 0 && (
            <span className="ml-2 text-sm font-normal text-slate-400">
              ({items.length} ítem{items.length !== 1 ? 's' : ''})
            </span>
          )}
        </h2>

        <div className="overflow-x-auto rounded-2xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['Producto', 'Cantidad', 'Precio unit.', 'Subtotal', 'Acciones'].map(h => (
                  <th
                    key={h}
                    className=".bg-gradient-to-br from-slate-50 to-slate-100
                      px-4 py-5 text-left font-semibold text-gray-700
                      text-[0.9rem] uppercase tracking-[0.5px]
                      border-b-2 border-slate-200"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400 text-sm">
                    Sin ítems agregados — usa el formulario de arriba
                  </td>
                </tr>
              ) : (
                items.map(i => (
                  <tr key={i.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-800 font-medium">{i.descripcion}</td>
                    <td className="px-4 py-3 text-slate-600">{i.cantidad}</td>
                    <td className="px-4 py-3 text-slate-600">${i.precio_venta.toLocaleString('es-CO')}</td>
                    <td className="px-4 py-3 text-slate-800 font-semibold">${i.subtotal.toLocaleString('es-CO')}</td>
                    <td className="px-4 py-3">
                      <Button variant="delete" onClick={() => eliminarItem(i.id)}>
                        <MdDelete />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── FILTROS ───────────────────────────────────────────── */}
      <FilterBar
        search={
          <input
            placeholder="Buscar por ID, fecha, método o estado..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full outline-none bg-transparent text-slate-700
              text-sm placeholder-slate-400"
          />
        }
      />

      {/* ── LISTA DE VENTAS ───────────────────────────────────── */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-slate-800">
            Ventas registradas
            <span className="ml-2 text-sm font-normal text-slate-400">({ventasFiltradas.length})</span>
          </h2>
          <Button variant="primary" onClick={exportarExcel}>
            Exportar Excel
          </Button>
        </div>

        <div className="overflow-x-auto rounded-2xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['', '#', 'Fecha', 'Método pago', 'Estado', 'Total', 'Ítems', 'Acciones'].map(h => (
                  <th
                    key={h}
                    className=".bg-gradient-to-br from-slate-50 to-slate-100
                      px-4 py-5 text-left font-semibold text-gray-700
                      text-[0.9rem] uppercase tracking-[0.5px]
                      border-b-2 border-slate-200 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ventasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400 text-sm">
                    No se encontraron ventas
                  </td>
                </tr>
              ) : (
                ventasFiltradas.map(v => (
                  // ✅ Fragment con key — evita warning y re-renders incorrectos
                  <Fragment key={v.id_venta}>
                    <tr className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                      {/* Botón expandir */}
                      <td className="px-3 py-3">
                        <button
                          onClick={() => setExpandido(expandido === v.id_venta ? null : v.id_venta)}
                          className="w-6 h-6 flex items-center justify-center rounded-md
                            text-slate-400 hover:bg-slate-100 hover:text-slate-600
                            transition-colors text-xs"
                        >
                          {expandido === v.id_venta ? '▲' : '▼'}
                        </button>
                      </td>

                      <td className="px-4 py-3 font-mono text-xs text-slate-500">#{v.id_venta}</td>
                      <td className="px-4 py-3 text-slate-600">{v.fecha_venta?.split('T')[0] ?? '—'}</td>
                      <td className="px-4 py-3 text-slate-600">{v.metodo_pago}</td>

                      {/* Cambio de estado rápido */}
                      <td className="px-4 py-3">
                        <select
                          value={v.estado}
                          onChange={e => cambiarEstadoVenta(v.id_venta, e.target.value)}
                          className={`text-xs rounded-lg border px-2 py-1 font-medium
                            cursor-pointer transition-colors ${badgeEstado(v.estado)}`}
                        >
                          <option value="Pagado">Pagado</option>
                          <option value="Pendiente">Pendiente</option>
                          <option value="Cancelado">Cancelado</option>
                        </select>
                      </td>

                      <td className="px-4 py-3 text-slate-800 font-semibold">
                        ${Number(v.total).toLocaleString('es-CO')}
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{v.detalles?.length ?? 0} ítem(s)</td>

                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="edit" onClick={() => editarVenta(v)}>
                            <MdEdit />
                          </Button>
                          <Button variant="delete" onClick={() => eliminarVenta(v.id_venta)}>
                            <MdDelete />
                          </Button>
                        </div>
                      </td>
                    </tr>

                    {/* Fila expandible con ítems */}
                    {expandido === v.id_venta && (
                      <tr>
                        <td colSpan={8} className="px-6 py-3 bg-slate-50 border-b border-slate-100">
                          {!v.detalles?.length ? (
                            <p className="text-xs text-slate-400">Sin ítems registrados</p>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {v.detalles.map((d, idx) => (
                                <span
                                  key={d.id ?? idx}
                                  className="inline-flex items-center gap-1 px-3 py-1
                                    bg-white border border-slate-200 rounded-lg
                                    text-xs text-slate-600"
                                >
                                  <span className="font-medium text-slate-800">
                                    {d.producto?.descripcion || 'Sin producto'}
                                  </span>
                                  <span className="text-slate-400">×</span>
                                  <span>{d.cantidad}</span>
                                  <span className="text-slate-400">·</span>
                                  <span className="text-slate-500">${Number(d.subtotal).toLocaleString('es-CO')}</span>
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
