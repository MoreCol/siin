import { useState, useMemo, useEffect } from 'react';
import axios from 'axios';

import { MdEdit, MdDelete, MdAdd } from 'react-icons/md';
import { FilterBar } from '../components/ui/filterBar';
import { Button } from '../components/ui/Button';
import { FilterInvent } from '../components/ui/filterInvent';
import Select from 'react-select';

const API_URL = 'http://localhost:3000/api/inventario'; //url del servidor

export default function Inventario() {
  const [ListaInventarios, setListaInventarios] = useState([]); //
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingInvent, setEditingInvent] = useState(null); //
  const [loading, setLoading] = useState(true);
  const [productos, setProductos] = useState([]);
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const [tipoFiltro, setTipoFiltro] = useState('');

  const [usuarioFiltro, setUsuarioFiltro] = useState('');

  const [fechaFiltro, setFechaFiltro] = useState('');

  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    cargarInventarios();
    cargarProductos();
    cargarUsuarios();
  }, []);

  const cargarInventarios = async () => {
    console.log(' Cargando inventarios...');
    try {
      const res = await axios.get(API_URL);
      console.log(' Respuesta inventarios', res.data);

      const inventariosFormateados = res.data.map(i => ({
        id_movimiento: i.id_movimiento,
        id_producto: i.id_producto,
        producto_descripcion: i.producto?.descripcion || 'Sin producto',
        usuario_nombre: i.usuario ? `${i.usuario.nombre} ${i.usuario.apellido}` : 'Sin usuario',
        id_usuario: i.id_usuario,
        tipo_movimiento: i.tipo_movimiento,
        cantidad: Number(i.cantidad),
        fecha_movimiento: i.fecha_movimiento || i.fecha_movimiento,
        descripcion: i.descripcion || ''
      }));
      setListaInventarios(inventariosFormateados);
    } catch (error) {
      console.error(' Error cargando inventarios:');
    } finally {
      setLoading(false);
    }
  };

  const cargarProductos = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/products/all');
      setProductos(res.data);
    } catch (error) {
      console.error('Error productos:');
    }
  };

  const filteredInventarios = useMemo(() => {
    const q = search.trim().toLowerCase();

    return ListaInventarios.filter(i => {
      // búsqueda global
      const coincideBusqueda =
        !q ||
        [i.producto_descripcion, i.usuario_nombre, i.tipo_movimiento, i.cantidad, i.descripcion].some(v =>
          String(v).toLowerCase().includes(q)
        );

      // filtro movimiento
      const coincideMovimiento = !tipoFiltro || i.tipo_movimiento === tipoFiltro;

      // filtro usuario
      const coincideUsuario = !usuarioFiltro || i.usuario_nombre.toLowerCase().includes(usuarioFiltro.toLowerCase());

      // filtro fecha
      const fechaMovimiento = new Date(i.fecha_movimiento).toISOString().split('T')[0];

      const coincideFecha = !fechaFiltro || fechaMovimiento === fechaFiltro;

      return coincideBusqueda && coincideMovimiento && coincideUsuario && coincideFecha;
    });
  }, [ListaInventarios, search, tipoFiltro, usuarioFiltro, fechaFiltro]);

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
      await cargarInventarios();
    }
  };

  const handleGuardar = async e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    console.log('formData');

    const inventData = {
      id_producto: Number(fd.get('id_producto')),
      id_usuario: storedUser.id_usuario,
      tipo_movimiento: String(fd.get('tipo_movimiento')).trim(),
      cantidad: Number(fd.get('cantidad')),
      fecha_movimiento: fd.get('fecha_movimiento'),
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

    try {
      if (editingInvent) {
        await axios.put(`${API_URL}/${editingInvent.id_movimiento}`, inventData);
        console.log(' Inventario actualizado');
      } else {
        await axios.post(API_URL, inventData);
      }

      await cargarInventarios();
      setEditingInvent(null);
      setShowModal(false);
      e.target.reset();
    } catch (error) {
      console.error('Error al guardar', error);
      const mensaje =  error.response?.data?.message || 'No se pudo guardar';

      alert(mensaje);
    }
  };

  return (
    <div className=" mx-auto ">
      <h1 className="text-4xl font-bold text-slate-800 !px-6 !py-6">Inventario</h1>

      {/* FORMULARIO */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm !p-5 !mb-6">
        <div className="flex justify-between items-center !mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">
              {editingInvent ? 'Editar movimiento' : 'Nuevo movimiento'}
            </h2>

            <p className="text-sm text-slate-500 !mt-1">Registro de entradas, salidas y ajustes de inventario</p>
          </div>

          {editingInvent && (
            <Button variant="cancel" onClick={() => setEditingInvent(null)}>
              Cancelar edición
            </Button>
          )}
        </div>

        {/* Usuario actual */}
        <div className="bg-slate-100 border border-slate-200 rounded-2xl !px-4 !py-3 !mb-5">
          <span className="text-sm text-slate-500">Movimiento realizado por:</span>

          <span className="font-semibold text-slate-800 !ml-2">
            {storedUser.nombre} {storedUser.apellido}
          </span>
        </div>

        <form onSubmit={handleGuardar}>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 !gap-5">
            {/* PRODUCTO */}
            <Select
              options={productos.map(p => ({
                value: p.id,
                label: `${p.codigo_barras} - ${p.descripcion}`
              }))}
              defaultValue={productos
                .map(p => ({
                  value: p.id,
                  label: `${p.codigo_barras} - ${p.descripcion}`
                }))
                .find(option => option.value === editingInvent?.id_producto)}
              onChange={selected => {
                const hiddenInput = document.getElementById('id_producto_hidden');
                if (hiddenInput) {
                  hiddenInput.value = selected?.value || '';
                }
              }}
              placeholder="Buscar producto..."
              isSearchable
              className="text-sm"
              styles={{
                control: base => ({
                  ...base,
                  borderRadius: '12px',
                  minHeight: '48px',
                  borderColor: '#cbd5e1'
                })
              }}
            />

            {/* input oculto para FormData */}
            <input
              type="hidden"
              id="id_producto_hidden"
              name="id_producto"
              defaultValue={editingInvent?.id_producto || ''}
            />
            {/* TIPO */}
            <select
              name="tipo_movimiento"
              defaultValue={editingInvent?.tipo_movimiento ?? 'entrada'}
              className="rounded-xl border border-slate-300 !px-4 !py-3"
            >
              <option value="entrada">Entrada</option>

              <option value="salida">Salida</option>

              <option value="ajuste">Ajuste</option>
            </select>

            {/* CANTIDAD */}
            <input
              type="number"
              name="cantidad"
              placeholder="Cantidad"
              min="1"
              step="1"
              defaultValue={editingInvent?.cantidad || ''}
              required
              className="rounded-xl border border-slate-300 !px-4 !py-3"
            />

            {/* FECHA */}
            <input
              type="date"
              name="fecha_movimiento"
              defaultValue={
                editingInvent?.fecha_movimiento
                  ? new Date(editingInvent.fecha_movimiento).toISOString().split('T')[0]
                  : ''
              }
              required
              className="rounded-xl border border-slate-300 !px-4 !py-3"
            />

            {/* DESCRIPCION */}
            <input
              type="text"
              name="descripcion"
              placeholder="Descripción"
              defaultValue={editingInvent?.descripcion ?? ''}
              required
              className="md:col-span-2 rounded-xl border border-slate-300 !px-4 !py-3"
            />
          </div>

          <div className="flex justify-end gap-3 !mt-6">
            <Button type="button" variant="cancel" onClick={() => setEditingInvent(null)}>
              Limpiar
            </Button>

            <Button type="submit" variant="primary">
              {editingInvent ? 'Actualizar movimiento' : 'Guardar movimiento'}
            </Button>
          </div>
        </form>
      </section>

      {/* FILTROS */}
      <FilterInvent
        search={
          <input
            placeholder="Buscar producto, usuario..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-transparent outline-none"
          />
        }
        movimiento={
          <select
            value={tipoFiltro}
            onChange={e => setTipoFiltro(e.target.value)}
            className="w-full bg-transparent outline-none"
          >
            <option value="">Todos los movimientos</option>
            <option value="entrada">Entrada</option>
            <option value="salida">Salida</option>
            <option value="ajuste">Ajuste</option>
          </select>
        }
        usuario={
          <select
            value={usuarioFiltro}
            onChange={e => setUsuarioFiltro(e.target.value)}
            className="w-full bg-transparent outline-none"
          >
            <option value="">Todos los usuarios</option>

            {usuarios.map(user => (
              <option key={user.id_usuario} value={user.nombre}>
                {user.nombre}
              </option>
            ))}
          </select>
        }
        fecha={
          <input
            type="date"
            value={fechaFiltro}
            onChange={e => setFechaFiltro(e.target.value)}
            className="w-full bg-transparent outline-none"
          />
        }
      />

      {/* TABLA */}
      <div className="mt-6">
        <div
          className="
      overflow-x-auto
      w-full
      rounded-2xl
      shadow-[0_4px_20px_rgba(0,0,0,0.08)]
      min-w-0
      bg-white
    "
        >
          <table
            className="
        w-full
        min-w-[900px]
        border-collapse
        bg-white
      "
          >
            <thead>
              <tr>
                {['Producto', 'Usuario', 'Movimiento', 'Cantidad', 'Fecha', 'Descripción', 'Acciones'].map(col => (
                  <th
                    key={col}
                    className="
                bg-gradient-to-br
                from-slate-50
                to-slate-100
                !px-4
                !py-5
                text-left
                font-semibold
                text-gray-700
                text-[0.9rem]
                uppercase
                tracking-[0.5px]
                border-b-2
                border-slate-200
              "
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredInventarios.map(m => (
                <tr
                  key={m.id_movimiento}
                  className="
              border-b
              border-slate-100
              hover:bg-blue-50/40
              transition-colors
              duration-200
            "
                >
                  {/* Producto */}
                  <td className="!px-6 !py-5 text-slate-700">{m.producto_descripcion}</td>

                  {/* Usuario */}
                  <td className="!px-6 !py-5">
                    <span
                      className="
                  inline-flex
                  items-center
                  rounded-full
                  bg-slate-100
                  !px-3
                  !py-1
                  text-sm
                  font-medium
                  text-slate-700
                "
                    >
                      {m.usuario_nombre}
                    </span>
                  </td>

                  {/* Tipo movimiento */}
                  <td className="!px-6 !py-5">
                    <span
                      className={`
                  inline-flex
                  items-center
                  rounded-full
                  !px-3
                  !py-1
                  text-sm
                  font-semibold
                  ${
                    m.tipo_movimiento === 'entrada'
                      ? 'bg-emerald-100 text-emerald-700'
                      : m.tipo_movimiento === 'salida'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-sky-100 text-sky-700'
                  }
                `}
                    >
                      {m.tipo_movimiento}
                    </span>
                  </td>

                  {/* Cantidad */}
                  <td className="!px-6 !py-5 font-semibold text-slate-800">{m.cantidad}</td>

                  {/* Fecha */}
                  <td className="!px-6 !py-5 text-slate-600">{new Date(m.fecha_movimiento).toLocaleDateString()}</td>

                  {/* Descripción */}
                  <td className="!px-6 !py-5 text-slate-600">{m.descripcion}</td>

                  {/* Acciones */}
                  <td className="!px-6 !py-5">
                    <div className="flex gap-2">
                      <Button variant="edit" onClick={() => editarInvent(m)}>
                        <MdEdit />
                      </Button>

                      <Button variant="delete" onClick={() => eliminarInvent(m.id_movimiento)}>
                        <MdDelete />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
