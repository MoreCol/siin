import { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import '../styles/inventario.css';
import '../styles/productos.css';
import { MdEdit, MdDelete, MdAdd } from 'react-icons/md';

const API_URL = 'http://localhost:3000/api/products';

export default function Productos() {
  const [ListaProductos, setListaProductos] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    console.log('cargando productos');
    try {
      const res = await axios.get(API_URL);
      console.log('respuesta!');

      const productosFormateados = res.data.map(p => ({
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
    } catch (error) {
      console.log('no se pudieron cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const filteredProductos = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ListaProductos;

    return ListaProductos.filter(p =>
      [
        p.codigo,
        p.descripcion,
        p.categoria,
        p.precio_Compra,
        p.precio_Venta,
        p.stock_Actual,
        p.stock_Minimo,
        p.estado
      ].some(v => String(v).toLowerCase().includes(q))
    );
  }, [ListaProductos, search]);

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

  const editarProducto = producto => {
    setEditingProduct(producto);
    setShowModal(true);
  };

  const eliminarProducto = async id => {
    if (!confirm('¿Deseas eliminar este producto permanentemente?')) return;

    try {
      // 1. Llamar al backend
      await axios.delete(`${API_URL}/${id}`);
      console.log(' Producto eliminado del servidor');

      // 2. Actualizar frontend
      setListaProductos(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error(' Error eliminando:', error.response?.data || error.message);
      alert('No se pudo eliminar el producto');

      // Si falla, recargar desde servidor
      await cargarProductos();
    }
  };

  const handleGuardar = async e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    console.log('formData');

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
        console.log('producto actualizado');
      } else {
        await axios.post(API_URL, productData);
        console.log('producto creado');
      }

      await cargarProductos();
      setEditingProduct(null);
      setShowModal(false);
      e.target.reset();

      // Actualiza el estado local
      /*setListaProductos(prev => {
        if (editingProduct) {
          return prev.map(p => (p.id === editingProduct.id ? productData : p));
        }
        return [productData, ...prev];
      });*/

      // Vuelve a cargar desde el backend para tener el estado fresco
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('No se pudo guardar');
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="header-left">
          <h1 className="productos-title">Productos</h1>
        </div>
      </div>

      <div className="filtros-bar">
        <div className="filtros-izq">
          <input
            className="filtro-input search-global"
            placeholder="🔍 Buscar por descripción/código..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="filtros-der">
          <button
            className="btn-producto btn-nuevo"
            onClick={() => {
              setEditingProduct(null);
              setShowModal(true);
            }}
          >
            <MdAdd className="add-icon" />
            Nuevo Producto
          </button>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2>Lista de productos</h2>
        </div>

        <div className="table-responsive">
          <table className="productos-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Descripción</th>
                <th>Categoría</th>
                <th>Precio Compra</th>
                <th>Precio Venta</th>
                <th>Stock Actual</th>
                <th>Stock Mínimo</th>
                <th>Disponibilidad</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filteredProductos.map(producto => (
                <tr key={producto.id} className={getStockClass(producto.stock_Actual, producto.stock_Minimo)}>
                  <td>
                    <code>#{producto.codigo}</code>
                  </td>
                  <td>{producto.descripcion}</td>
                  <td>{producto.categoria}</td>
                  <td>${Number(producto.precio_Compra).toLocaleString()}</td>
                  <td>${Number(producto.precio_Venta).toLocaleString()}</td>
                  <td>{producto.stock_Actual}</td>
                  <td>{producto.stock_Minimo}</td>
                  <td className="stock-cell">
                    <span className={`stock-indicator ${getStockClass(producto.stock_Actual, producto.stock_Minimo)}`}>
                      {getDisponibilidad(producto.stock_Actual, producto.stock_Minimo)}
                    </span>
                  </td>
                  <td>
                    <span className={`estado-badge ${producto.estado.toLowerCase()}`}>{producto.estado}</span>
                  </td>
                  <td className="acciones-cell">
                    <button className="btn-accion editar" onClick={() => editarProducto(producto)} title="Editar">
                      <MdEdit />
                    </button>
                    <button
                      className="btn-accion eliminar"
                      onClick={() => eliminarProducto(producto.id)}
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
          <button className="btn-ver">Ver productos</button>
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
            <h2>{editingProduct ? 'Editar' : 'Nuevo'} producto</h2>

            <form onSubmit={handleGuardar}>
              <div className="form-group">
                <input name="codigo" defaultValue={editingProduct?.codigo} placeholder="Código" required />
              </div>

              <div className="form-group">
                <input
                  name="descripcion"
                  defaultValue={editingProduct?.descripcion}
                  placeholder="Descripción del producto"
                  required
                />
              </div>

              <div className="form-group">
                <select name="categoria" defaultValue={editingProduct?.categoria || ''} onChange={e => {}} required>
                  <option value="">Categoría...</option>
                  <option value="papeleria">Papelería</option>
                </select>
              </div>

              <div className="form-group">
                <input
                  type="number"
                  name="precio_Compra"
                  defaultValue={editingProduct?.precio_Compra}
                  min="0"
                  step="0.01"
                  placeholder="Precio de compra"
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="number"
                  name="precio_Venta"
                  defaultValue={editingProduct?.precio_Venta}
                  min="0"
                  step="0.01"
                  placeholder="Precio de venta"
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="number"
                  name="stock_Actual"
                  defaultValue={editingProduct?.stock_Actual}
                  min="0"
                  placeholder="Stock actual"
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="number"
                  name="stock_Minimo"
                  defaultValue={editingProduct?.stock_Minimo}
                  min="0"
                  placeholder="Stock mínimo"
                  required
                />
              </div>

              <div className="form-group">
                <select name="estado" defaultValue={editingProduct?.estado ?? ''} required>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>

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
