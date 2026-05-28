import { useState, useMemo, useEffect } from 'react';
import axios from 'axios';

import { MdEdit, MdDelete, MdAdd, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { FilterBar } from '../components/ui/filterBar';
import { Button } from '../components/ui/Button';

const API_URL = 'http://localhost:3000/api/products';

export default function Productos() {
  const [ListaProductos, setListaProductos] = useState([]);
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const productosPorPagina = 5;

  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [disponibilidadFiltro, setDisponibilidadFiltro] = useState('');

  useEffect(() => {
    cargarProductos(paginaActual);
  }, [paginaActual]);

  const cargarProductos = async (page = 1) => {
    try {
      const res = await axios.get(`${API_URL}?page=${page}&limit=${productosPorPagina}`);

      const productosFormateados = res.data.data.map(p => ({
        id: p.id,
        codigo: p.codigo_barras,
        descripcion: p.descripcion,
        categoria: p.categoria,
        precio_Compra: Number(p.precio_compra),
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

  const getStockClass = (stockActual, stockMinimo = 5) => {
    if (stockActual === 0) return 'agotado';
    if (stockActual <= stockMinimo) return 'bajo';
    return 'disponible';
  };

  const getDisponibilidad = (stockActual, stockMinimo = 5) => {
    if (stockActual === 0) return 'Agotado';
    if (stockActual <= stockMinimo) return 'Bajo';
    return 'Disponible';
  };

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

  const editarProducto = producto => {
    setEditingProduct(producto);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

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

  const handleGuardar = async e => {
    e.preventDefault();

    const fd = new FormData(e.target);

    const productData = {
      codigo_barras: String(fd.get('codigo')).trim(),
      descripcion: String(fd.get('descripcion')).trim(),
      categoria: String(fd.get('categoria')).trim(),
      precio_compra: Number(fd.get('precio_Compra')),
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
      <h1 className="text-4xl font-bold text-slate-800 !px-6 !py-6">Productos</h1>

      {/* FORMULARIO */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm !p-5 !mb-6">
        <div className="flex justify-between items-center !mb-6">
          <h2 className="text-2xl font-semibold text-slate-800">
            {editingProduct ? 'Editar producto' : 'Nuevo producto'}
          </h2>

          {editingProduct && (
            <Button variant="cancel" onClick={() => setEditingProduct(null)}>
              Cancelar edición
            </Button>
          )}
        </div>

        <form onSubmit={handleGuardar}>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 !gap-5">
            <input
              name="codigo"
              defaultValue={editingProduct?.codigo}
              placeholder="Código"
              required
              className="rounded-xl border border-slate-300 !px-4 !py-3"
            />

            <select
              name="categoria"
              defaultValue={editingProduct?.categoria || ''}
              required
              className="rounded-xl border border-slate-300 !px-4 !py-3"
            >
              <option value="">Categoría...</option>
              <option value="Material Escolar">Material Escolar</option>
              <option value="Material de Oficina">Material de Oficina</option>
            </select>

            <select
              name="estado"
              defaultValue={editingProduct?.estado ?? 'Activo'}
              className="rounded-xl border border-slate-300 !px-4 !py-3"
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>

            <input
              name="descripcion"
              defaultValue={editingProduct?.descripcion}
              placeholder="Descripción del producto"
              required
              className="md:col-span-2 rounded-xl border border-slate-300 !px-4 !py-3"
            />

            <input
              type="number"
              name="precio_Compra"
              defaultValue={editingProduct?.precio_Compra}
              placeholder="Precio compra"
              className="rounded-xl border border-slate-300 !px-4 !py-3"
            />

            <input
              type="number"
              name="precio_Venta"
              defaultValue={editingProduct?.precio_Venta}
              placeholder="Precio venta"
              className="rounded-xl border border-slate-300 !px-4 !py-3"
            />

            <input
              type="number"
              name="stock_Actual"
              defaultValue={editingProduct?.stock_Actual}
              placeholder="Stock actual"
              className="rounded-xl border border-slate-300 'px-4 !py-3"
            />

            <input
              type="number"
              name="stock_Minimo"
              defaultValue={editingProduct?.stock_Minimo}
              placeholder="Stock mínimo"
              className="rounded-xl border border-slate-300 !px-4 !py-3"
            />
          </div>

          <div className="flex justify-end !gap-3 !mt-6">
            <Button type="button" variant="cancel" onClick={() => setEditingProduct(null)}>
              Limpiar
            </Button>

            <Button type="submit" variant="primary">
              Guardar producto
            </Button>
          </div>
        </form>
      </section>

      {/* FILTROS */}
      <FilterBar
        search={
          <input
            placeholder="Buscar producto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full outline-none bg-transparent"
          />
        }
        categoria={
          <select
            value={categoriaFiltro}
            onChange={e => setCategoriaFiltro(e.target.value)}
            className="w-full bg-transparent"
          >
            <option value="">Todas las categorías</option>
            <option value="Material Escolar">Material Escolar</option>
            <option value="Material de Oficina">Material de Oficina</option>
          </select>
        }
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
        overflow-hidden
        rounded-2xl
        bg-white
      "
          >
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {[
                  'Código',
                  'Descripción',
                  'Categoría',
                  'Precio Compra',
                  'Precio Venta',
                  'Stock',
                  'Estado',
                  'Acciones'
                ].map(header => (
                  <th
                    key={header}
                    className="
                bg-gradient-to-br
                from-slate-50
                to-slate-100
                !px-4
                !py-5
                text-left
                text-[0.9rem]
                font-semibold
                uppercase
                tracking-[0.5px]
                text-gray-700
                border-b-2
                border-slate-200
              "
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredProductos.map(producto => (
                <tr
                  key={producto.id}
                  className="
              hover:bg-blue-500/5
              transition-colors
            "
                >
                  <td className="!px-8 !py-5 border-b border-slate-100 align-middle">#{producto.codigo}</td>

                  <td className="!px-8 !py-5 border-b border-slate-100 align-middle">{producto.descripcion}</td>

                  <td className="!px-8 !py-5 border-b border-slate-100 align-middle">
                    <span
                      className="
                  inline-flex
                  rounded-full
                  bg-blue-500/15
                  !px-3
                  !py-1.5
                  text-sm
                  font-semibold
                  text-blue-500
                "
                    >
                      {producto.categoria}
                    </span>
                  </td>

                  <td className="!px-8 !py-5 border-b border-slate-100 align-middle">
                    ${producto.precio_Compra.toLocaleString()}
                  </td>

                  <td className="!px-8 py-5 border-b border-slate-100 align-middle">
                    ${producto.precio_Venta.toLocaleString()}
                  </td>

                  <td
                    className="
                !px-8 !py-5
                border-b border-slate-100
                align-middle
                font-semibold
                text-base
              "
                  >
                    <span
                      className={`
                  inline-flex
                  rounded-xl
                  !px-3
                  !py-1
                  text-sm
                  font-semibold
                  ${
                    getDisponibilidad(producto.stock_Actual, producto.stock_Minimo) === 'Disponible'
                      ? 'bg-emerald-500/20 text-emerald-600'
                      : getDisponibilidad(producto.stock_Actual, producto.stock_Minimo) === 'Bajo'
                        ? 'bg-yellow-400/20 text-amber-600'
                        : 'bg-red-500/20 text-red-600'
                  }
                `}
                    >
                      {getDisponibilidad(producto.stock_Actual, producto.stock_Minimo)}
                    </span>
                  </td>

                  <td className="!px-8 !py-5 border-b border-slate-100 align-middle">
                    <span
                      className={`
                  inline-flex
                  rounded-full
                  !px-3
                  !py-1.5
                  text-sm
                  font-semibold
                  ${
                    producto.estado === 'Activo' ? 'bg-emerald-500/20 text-emerald-600' : 'bg-red-500/20 text-slate-900'
                  }
                `}
                    >
                      {producto.estado}
                    </span>
                  </td>

                  <td className="!px-8 !py-5 border-b border-slate-100 align-middle">
                    <div className="flex items-center !gap-3">
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
        <div className="pagination mt-4 flex justify-center gap-4">
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
