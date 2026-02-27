import { useState, useMemo } from 'react';
import '../styles/inventario.css';
import '../styles/productos.css';
import { MdEdit, MdDelete, MdAdd } from 'react-icons/md';
import ProductoModal from '../components/ProductoModal';

export default function Productos() {
  const [ListaProductos, setProductos] = useState([
    {
      id: 1,
      codigo: 'P001',
      categoria: 'Papelería',
      precio: 4500,
      stock: 25,
      estado: 'Activo',
      descripcion: 'Cuaderno Espiral',
      imagen: 'https://via.placeholder.com/300x200/667eea/ffffff?text=Cuaderno'
    },
    {
      id: 2,
      codigo: 'P002',
      descripcion: 'Lapiceros',
      categoria: 'Papelería',
      precio: 900,
      stock: 3,
      estado: 'Bajo',
      imagen: 'https://via.placeholder.com/300x200/764ba2/ffffff?text=iPhone'
    }
  ]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const filteredProductos = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ListaProductos;

    return ListaProductos.filter(p =>
      [p.codigo, p.descripcion, p.categoria, p.precio, p.stock, p.estado].some(v => String(v).toLowerCase().includes(q))
    );
  }, [ListaProductos, search]);

  const getStockClass = stock => {
    //recibe el parametro stock
    if (stock === 0) return 'agotado'; //condicional específico
    if (stock < 5) return 'bajo'; // condicionales generales
    return 'disponible';
  };

  const editarProducto = producto => {
    // recibe parametro producto
    setEditingProduct(producto); //se va a guardar el estado del producto que vamos a editar por eso usamos useState
    setShowModal(true); //abre el modal
  };

  const eliminarProducto = id => {
    if (confirm('¿Deseas eliminar este producto?')) {
      setProductos(ListaProductos.filter(p => p.id !== id)); // !p.id (es diferente) si es el mismo da false y elimina
      //quedate con el producto que el id sea estrictamente diferente al id que quiero eliminar
    }
  };

  const handleGuardar = e => {
    e.preventDefault();
    const fd = new FormData(e.target);

    const nuevo = {
      id: editingProduct ? editingProduct.id : Date.now(),
      codigo: String(fd.get('codigo')).trim(),
      descripcion: String(fd.get('descripcion')).trim(),
      categoria: String(fd.get('categoria')).trim(),
      precio: Number(fd.get('precio')),
      stock: Number(fd.get('stock')),
      estado: String(fd.get('estado')).trim()
    };

    setProductos(prev => {
      if (editingProduct) {
        return prev.map(p => (p.id === editingProduct.id ? nuevo : p));
      }
      return [nuevo, ...prev]; // agrega al inicio
    });

    setEditingProduct(null); //no edita
    setShowModal(false); //cierra modal
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
            onChange={(
              e //evento
            ) => setSearch(e.target.value)} //el texto que hay dentro del input, se giuarda en el estado
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
                <th>Precio Unitario</th>
                <th>Stock Inicial</th>
                <th>Disponible</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filteredProductos.map(
                (
                  producto //eventoque se usa en arrays recorre una lista y trasforma los elementos en algo nuevo
                ) => (
                  //por cada producto crea una fila
                  //key = llave unica
                  <tr key={producto.id} className={getStockClass(producto.stock)}>
                    <td>
                      <code>#{producto.codigo}</code>
                    </td>

                    <td>{producto.descripcion}</td>

                    <td>
                      <span className="">{producto.categoria}</span>
                    </td>

                    <td>{producto.precio.toLocaleString()}</td>

                    <td className="stock-cell">
                      <span className={`stock-indicator ${getStockClass(producto.stock)}`}>
                        {producto.stock === 0 ? '0' : producto.stock < 5 ? `${producto.stock} ` : `${producto.stock} `}
                      </span>
                    </td>

                    <td>{producto.stock}</td>

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
                )
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <button className="btn-ver">Ver productos</button>
        </div>
      </div>

      <ProductoModal
        open={showModal}
        editingProduct={editingProduct}
        onGuardar={data => {
          const nuevo = {
            id: editingProduct ? editingProduct.id : Date.now(),
            ...data, // {codigo, descripcion, categoria, precio, stock, estado}
            imagen: editingProduct?.imagen ?? 'https://via.placeholder.com/300x200/667eea/ffffff?text=Producto'
          };

          setProductos(prev => {
            if (editingProduct) {
              return prev.map(p => (p.id === editingProduct.id ? nuevo : p));
            }
            return [nuevo, ...prev];
          });

          setEditingProduct(null);
          setShowModal(false);
        }}
        onClose={() => {
          setShowModal(false);
          setEditingProduct(null);
        }}
      />
    </div>
  );
}
