import { useState, useMemo, useEffect } from 'react';
import axios from 'axios';

import { MdEdit, MdDelete, MdAdd, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { FilterBar } from '../components/ui/filterBar';
import { Button } from '../components/ui/Button';

const API_URL = 'http://localhost:3000/api/products';

export default function Productos() {
  //ESTAD0
  const [ListaProductos, setListaProductos] = useState([]);
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const productosPorPagina = 5;

  //FILTROS DE BUSQUEDA GENERAL
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [disponibilidadFiltro, setDisponibilidadFiltro] = useState('');

  // RECARGA PRODUCTOS CADA QUE SE RECARGA LA PAGINA
  useEffect(() => {
    cargarProductos(paginaActual);
  }, [paginaActual]);

  // CARGA DE DATOS
  const cargarProductos = async (page = 1) => {
    try {
      const res = await axios.get(`${API_URL}?page=${page}&limit=${productosPorPagina}`);

      // EL BACJEND DEVUELVE NOMBRES EN SNAKE-CASSE Y LOS MAPEAMOS A CAMELCASE
      const productosFormateados = res.data.data.map(p => ({
        id: p.id,
        codigo: p.codigo_barras,
        descripcion: p.descripcion,
        categoria: p.categoria,
        precio_Compra: Number(p.precio_compra),
        porcentaje_ganancia: Number(p.porcentaje_ganancia),
        precio_Venta: Number(p.precio_venta),
        stock_Actual: p.stock_actual,
        stock_Minimo: p.stock_minimo,
        estado: p.estado
      }));

      setListaProductos(productosFormateados);
      setTotalPaginas(res.data.totalPages);
    } catch (error) {
      console.error('No se pudieron cargar productos', error);
    } finally {
      setLoading(false);
    }
  };
  // RETORNA CLASE CSS SEGUN NIVEL DE STOCK
  const getStockClass = (stockActual, stockMinimo = 5) => {
    if (stockActual === 0) return 'agotado';
    if (stockActual <= stockMinimo) return 'bajo';
    return 'disponible';
  };
  // RETORNA
  const getDisponibilidad = (stockActual, stockMinimo = 5) => {
    if (stockActual === 0) return 'Agotado';
    if (stockActual <= stockMinimo) return 'Bajo';
    return 'Disponible';
  };

  // FILTRADO
  // POR BUSQUEDA GENERAL + CATEGORIA + DISPONIBILIDAD
  //USENEMO EVITA RECALCULAR EN CADA RENDER SI LAS DEPENDENCIAS NO CAMBIARON
  const filteredProductos = useMemo(() => {
    const q = search.trim().toLowerCase();

    return ListaProductos.filter(p => {
      const coincideBusqueda =
        !q ||
        [
          p.codigo,
          p.descripcion,
          p.categoria,
          p.precio_Compra,
          p.porcentaje_ganancia,
          p.precio_Venta,
          p.stock_Actual,
          p.stock_Minimo,
          p.estado
        ].some(v => String(v).toLowerCase().includes(q));

      const coincideCategoria = !categoriaFiltro || p.categoria.toLowerCase() === categoriaFiltro.toLowerCase();

      const disponibilidad = getDisponibilidad(p.stock_Actual, p.stock_Minimo);

      const coincideDisponibilidad = !disponibilidadFiltro || disponibilidad === disponibilidadFiltro;

      return coincideBusqueda && coincideCategoria && coincideDisponibilidad;
    });
  }, [ListaProductos, search, categoriaFiltro, disponibilidadFiltro]);

  // CRUD
  // CARGA EL PRODUCTO EN EL FORMULARIO
  const editarProducto = producto => {
    setEditingProduct(producto);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  //ELIMINA DEL ESTADO LOCAL Y CONFIRMA CON EL SERVIDOR
  const eliminarProducto = async id => {
    if (!confirm('¿Deseas eliminar este producto?')) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      setListaProductos(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error(error);
      alert('No se pudo eliminar');
    }
  };

  // CREA O EDITA SEGUN SI EDITINGPRODUCT TIENE VALOR
  const handleGuardar = async e => {
    e.preventDefault();

    const fd = new FormData(e.target);

    const productData = {
      codigo_barras: String(fd.get('codigo')).trim(),
      descripcion: String(fd.get('descripcion')).trim(),
      categoria: String(fd.get('categoria')).trim(),
      precio_compra: Number(fd.get('precio_Compra')),
      porcentaje_ganancia: Number(fd.get('porcentaje_ganancia')),
      precio_venta: Number(fd.get('precio_Venta')),
      stock_actual: Number(fd.get('stock_Actual')),
      stock_minimo: Number(fd.get('stock_Minimo')),
      estado: String(fd.get('estado')).trim(),
      proveedor_id: 1
    };

    try {
      if (editingProduct) {
        await axios.put(`${API_URL}/${editingProduct.id}`, productData);
      } else {
        await axios.post(API_URL, productData);
      }

      await cargarProductos();

      setEditingProduct(null);
      e.target.reset();
    } catch (error) {
      console.error(error);
      alert('No se pudo guardar');
    }
  };

  return (
    <div className="mx-auto">
      {/*TITULO___________*/}
      <h1 className="text-4xl font-bold text-slate-600 px-6 py-6">Productos</h1>

      {/* FORMULARIO CREAR / EDITAR ________ */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm !p-5 !mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-slate-800">
            {editingProduct ? 'Editar producto' : 'Nuevo producto'}
          </h2>

          {/*CANCELA LA EDICION SOLO VISIBLE EN EL ESTE MODO*/}
          {editingProduct && (
            <Button variant="cancel" onClick={() => setEditingProduct(null)}>
              Cancelar edición
            </Button>
          )}
        </div>

        {/* FORMULARIO PARA CREACION DE PRODUCTO___________ */}
        <form onSubmit={handleGuardar}>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Código del producto </label>

              {/*CODIGO ASIGNADO OPCIONAL-CODIGO DE BARRAS  */}
              <input
                name="codigo"
                defaultValue={editingProduct?.codigo}
                placeholder="Código"
                required
                className="rounded-xl border  border-slate-300 px-4 py-3"
              />
            </div>

            {/* CATEGORIAS POR MODULO (PAPELERIA)   */}
            <div className="flex flex-col md:col-span-1 gap-1">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Categorías</label>
              <select
                name="categoria"
                defaultValue={editingProduct?.categoria || ''}
                required
                className="rounded-xl border border-slate-300 px-4 py-3"
              >
                <option value="">Categoría...</option>
                <option value="Material Escolar">Material Escolar</option>
                <option value="Accesorios Escolares">Accesorios Escolares </option>
                <option value="Oficina">Oficina</option>
                <option value="Escritura y dibujo">Escritura y dibujo</option>
                <option value="Artes y manualidades">Artes y manualidades</option>
              </select>
            </div>

            {/* ESTADPO DEL PRODUCTO ACTIVO-INACTIVO */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Estado del producto</label>

              <select
                name="estado"
                defaultValue={editingProduct?.estado ?? 'Activo'}
                className="rounded-xl border border-slate-300 px-4 py-3"
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>

            {/* DESCRIPCION DEL PRODUCTO   */}
            <div className="flex flex-col md:col-span-3 gap-1">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Descripcion</label>
              <input
                name="descripcion"
                defaultValue={editingProduct?.descripcion}
                placeholder="Descripción del producto"
                required
                className="md:col-span-2 rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            {/* PRECIO DE COMPRA  */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Se actualiza automáticamente
              </label>
              <input
                type="number"
                name="precio_Compra"
                Value={editingProduct?.precio_Compra}
                placeholder="Precio compra"
                readOnly
                className="rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            {/* PORCENTAJE DE GANANCIA   */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Porcentaje de ganancia
              </label>
              <input
                type="number"
                name="porcentaje_ganancia"
                defaultValue={editingProduct?.porcentaje_ganancia}
                placeholder="Margen de ganancia (%)"
                className="rounded-xl border  md:col-span-1 border-slate-300 px-4 py-3"
              />
            </div>

            {/* PRECIO DE VENTA  */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Precio de venta</label>
              <input
                type="number"
                name="precio_Venta"
                defaultValue={editingProduct?.precio_Venta}
                placeholder="Precio venta"
                className="rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            {/*STOCK ACTUAL   */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Stock actual</label>
              <input
                type="number"
                name="stock_Actual"
                defaultValue={editingProduct?.stock_Actual}
                placeholder="Stock actual"
                className="rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            {/*STOCK MINIMO  */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Stock minimo </label>
              <input
                type="number"
                name="stock_Minimo"
                defaultValue={editingProduct?.stock_Minimo}
                placeholder="Stock mínimo"
                className="rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>
          </div>

          {/*  UTILIZAMOS COMPONENTE BUTTON */}

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              //VARIANT = TIPO DE FUNCION DEL BOTON
              variant="cancel"
              onClick={() => setEditingProduct(null)}
            >
              Limpiar
            </Button>

            <Button type="submit" variant="primary">
              Guardar producto
            </Button>
          </div>
        </form>
      </section>

      {/* FILTROS_________ */}
      <FilterBar
        // BUSQUEDA POR PRODUCTOS
        search={
          <input
            placeholder="Buscar producto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full outline-none bg-transparent"
          />
        }
        // BUSQUEDA POR CATEGORIAS
        categoria={
          <select
            value={categoriaFiltro}
            onChange={e => setCategoriaFiltro(e.target.value)}
            className="w-full bg-transparent"
          >
            <option value="">Todas las categorías</option>
            <option value="Material Escolar">Material Escolar</option>
            <option value="Accesorios escolares">Accesorios escolares</option>
            <option value="Oficina">Oficina</option>
            <option value="Escritura y dibujo">Escritura y dibujo</option>
            <option value="Artes y manualidades">Artes y manualidades</option>
          </select>
        }
        // BUSQUEDA POR DISPONIBILIDAD
        disponibilidad={
          <select
            value={disponibilidadFiltro}
            onChange={e => setDisponibilidadFiltro(e.target.value)}
            className="w-full bg-transparent"
          >
            <option value="">Toda disponibilidad</option>
            <option value="Disponible">Disponible</option>
            <option value="Bajo">Bajo</option>
            <option value="Agotado">Agotado</option>
          </select>
        }
      />

      {/* TABLA_____ */}
      <div className="mt-6">
        <div className=" overflow-x-auto w-full rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)]  min-w-0 bg-white">
          <table className=" w-full .min-w-[900px] border-collapse overflow-hidden rounded-2xl bg-white">
            {/*HEADER DE LA TABLA CON SUS ITEMS */}
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {[
                  'Código',
                  'Descripción',
                  'Categoría',
                  'Precio Compra',
                  'Precio Venta',
                  'Stock Actual',
                  'Stock Minimo',
                  'Estado',
                  'Acciones'
                ].map(header => (
                  <th
                    key={header}
                    className=" bg-gradient-to-br from-slate-200 to-slate-100 px-4 py-5 text-left text-[0.9rem]  font-semibold uppercase tracking-[0.5px] text-gray-700 border-b-2 border-slate-200  "
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredProductos.map(producto => (
                <tr key={producto.id} className=" hover:bg-blue-500/5  transition-colors ">
                  {/*CODIGO*/}
                  <td className="px-8 py-5 border-b border-slate-100 align-middle">#{producto.codigo}</td>

                  {/*DESCRIPCION*/}
                  <td className="px-8 py-5 border-b border-slate-100 align-middle">{producto.descripcion}</td>

                  {/*CATEGORIA*/}
                  <td className="px-8 py-5 border-b border-slate-100 align-middle">
                    <span className="  inline-flex rounded-full  bg-blue-500/15 !px-3 !py-1.5  text-sm font-semibold text-blue-500 ">
                      {producto.categoria}
                    </span>
                  </td>

                  {/*PRECIO COMPRA*/}
                  <td className="px-8 py-5 border-b border-slate-100 align-middle">
                    ${producto.precio_Compra.toLocaleString()}
                  </td>

                  {/*PRECIO VENTA*/}
                  <td className="px-8 py-5 border-b border-slate-100 align-middle">
                    ${producto.precio_Venta.toLocaleString()}
                  </td>

                  {/*STOCK ACTUAL */}
                  <td className=" px-8 py-5 border-b border-slate-100 align-middle font-semibold text-base  ">
                    <span
                      className={`inline-flex rounded-xl px-3 py-1 text-sm font-semibold
                  ${
                    getDisponibilidad(producto.stock_Actual, producto.stock_Minimo) === 'Disponible'
                      ? 'bg-emerald-500/20 text-emerald-600'
                      : getDisponibilidad(producto.stock_Actual, producto.stock_Minimo) === 'Bajo'
                        ? 'bg-yellow-400/20 text-amber-600'
                        : 'bg-red-500/20 text-red-600'
                  }
                `}
                    >
                      {producto.stock_Actual}
                    </span>
                  </td>

                  {/*STOCK MINIMO */}
                  <td className="px-8 py-5  border-b border-slate-100  align-middle  font-semibold  text-base">
                    <span>{producto.stock_Minimo}</span>
                  </td>

                  <td className="px-8 py-5 border-b border-slate-100 align-middle">
                    <span
                      className={`inline-flex  rounded-full  px-4 py-1.5  text-sm  font-semibold
                  ${
                    producto.estado === 'Activo' ? 'bg-emerald-500/20 text-emerald-600' : 'bg-red-500/20 text-slate-900'
                  }
                `}
                    >
                      {producto.estado}
                    </span>
                  </td>

                  {/*IMPORTAMOS COMPONENTE UI BUTTON */}
                  <td className="px-8 py-5 border-b border-slate-100 align-middle">
                    <div className="flex items-center gap-3">
                      <Button variant="edit" onClick={() => editarProducto(producto)}>
                        <MdEdit />
                      </Button>

                      <Button variant="delete" onClick={() => eliminarProducto(producto.id)}>
                        <MdDelete />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/*PAGINACION*/}
        <div className="pagination mt-4 flex justify-end gap-4   border-slate-100  py-4  text-1xl font-medium text-slate-600    ">
          <button disabled={paginaActual === 1} onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}>
            <MdChevronLeft />
          </button>

          <span>
            Página {paginaActual} de {totalPaginas}
          </span>

          <button
            disabled={paginaActual === totalPaginas}
            onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
          >
            <MdChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}
