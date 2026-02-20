import { useMemo, useState } from "react";
import "../styles/shared.css";
import "../styles/pedidos.css";

export default function Pedidos() {
 
  const [catalogo] = useState([
    { codigo: "P001", descripcion: "Cuaderno espiral" },
    { codigo: "P002", descripcion: "Lapicero" },
    { codigo: "P003", descripcion: "Borrador" },
    { codigo: "P004", descripcion: "Plastilina" },
  ]);

 
  const [proveedores] = useState([
    { id: "escobar", nombre: "Escobar" },
    { id: "grafitos", nombre: "Grafitos" },
    { id: "d1", nombre: "D1" },
  ]);

 
  const [showModal, setShowModal] = useState(false);
//datos temporales 
  const [draft, setDraft] = useState({
    codigo: catalogo[0]?.codigo ?? "",
    descripcion: "", 
    cantidad: 1,
    proveedorId: proveedores[0]?.id ?? "escobar",
  });

  const [items, setItems] = useState([]);//productos agregados  
  const [editingItem, setEditingItem] = useState(null); 
  const [pedidos, setPedidos] = useState([]); //se guarda el pedido agrupado por proveedor
  const [search, setSearch] = useState("");

  const proveedorSeleccionado = useMemo(() => {
    return proveedores.find((p) => p.id === draft.proveedorId) ?? null;
  }, [proveedores, draft.proveedorId]);

  const onChangeDraft = (e) => {
    const { name, value } = e.target;

    // Si cambia el código, opcionalmente sugerimos descripción del catálogo
    if (name === "") {
      const prod = catalogo.find((p) => p.codigo === value);
      setDraft((prev) => ({
        ...prev,
        codigo: value,
        // si el usuario no ha escrito nada, sugerimos la del catálogo
        descripcion: prev.descripcion ? prev.descripcion : (prod?.descripcion ?? ""),
      }));
      return;
    }

    setDraft((prev) => ({
      ...prev,
      [name]: name === "cantidad" ? Number(value) : value,
    }));
  };

  const abrirModal = () => {
    setShowModal(true);
    setEditingItem(null);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setDraft((prev) => ({ ...prev, cantidad: 1 }));
  };

  const agregarALaLista = (e) => {
    e.preventDefault();

    const cantidad = Number(draft.cantidad);
    if (!cantidad || cantidad < 1) return alert("Cantidad inválida");
    if (!draft.codigo.trim()) return alert("Falta el código");
    if (!draft.descripcion.trim()) return alert("Falta la descripción");
    if (!draft.proveedorId) return alert("Falta el proveedor");

    const itemNuevo = {
      id: editingItem ? editingItem.id : Date.now(),
      codigo: draft.codigo.trim(),
      descripcion: draft.descripcion.trim(),
      cantidad,
      proveedorId: draft.proveedorId,
    };

    setItems((prev) => {
      if (editingItem) {
        return prev.map((it) => (it.id === editingItem.id ? itemNuevo : it));
      }
      return [itemNuevo, ...prev];
    });

    setEditingItem(null);
    setDraft((prev) => ({ ...prev, cantidad: 1, descripcion: "" }));
  };

  const editarItem = (it) => {
    setEditingItem(it);
    setShowModal(true);
    setDraft({
      codigo: it.codigo,
      descripcion: it.descripcion,
      cantidad: it.cantidad,
      proveedorId: it.proveedorId,
    });
  };

  const cancelarEdicionItem = () => {
    setEditingItem(null);
    setDraft((prev) => ({ ...prev, cantidad: 1 }));
  };

  const eliminarItem = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    if (editingItem?.id === id) setEditingItem(null);
  };

  
  const crearPedidosPorProveedor = () => {
    if (items.length === 0) return alert("Agrega al menos un producto");


    const grupos = items.reduce((acc, it) => {
      const key = it.proveedorId ?? "sin_proveedor";
      acc[key] = acc[key] || [];
      acc[key].push(it);
      return acc;
    }, {});

    const fecha = new Date().toISOString().slice(0, 10);

    const nuevos = Object.entries(grupos).map(([proveedorId, itemsProv]) => {
      const prov = proveedores.find((p) => p.id === proveedorId);
      return {
        id: Date.now() + Math.floor(Math.random() * 10000),
        proveedorId,
        proveedorNombre: prov?.nombre ?? "Sin proveedor",
        fecha,
        estado: "Pendiente", // Pendiente | Realizado
        items: itemsProv.map((x) => ({ ...x })),
      };
    });

    setPedidos((prev) => [...nuevos, ...prev]);

    // limpiar lista
    setItems([]);
    setEditingItem(null);
    setDraft((prev) => ({ ...prev, cantidad: 1, descripcion: "" }));
    setShowModal(false);
  };

  const cambiarEstadoPedido = (id, estado) => {
    setPedidos((prev) => prev.map((p) => (p.id === id ? { ...p, estado } : p)));
  };

  const eliminarPedido = (id) => {
    if (confirm("¿Eliminar este pedido?")) {
      setPedidos((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // Editar pedido: lo cargamos de vuelta a items (y eliminamos el pedido)
  const editarPedido = (pedido) => {
    setItems(pedido.items.map((x) => ({ ...x })));
    setPedidos((prev) => prev.filter((p) => p.id !== pedido.id));
    setShowModal(true);
    setEditingItem(null);
  };

  const pedidosFiltrados = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return pedidos;

    return pedidos.filter((p) =>
      [p.id, p.proveedorNombre, p.fecha, p.estado].some((v) =>
        String(v).toLowerCase().includes(q)
      )
    );
  }, [pedidos, search]);

  return (
    <div className="container">
      <div className="header">
        <div className="header-left">
          <h1 className="pedidos-title">🧾 Pedidos</h1>
        </div>
      </div>

      <div className="filtros-bar">
        <div className="filtros-izq">
          <input
            className="filtro-input search-global"
            placeholder="🔍 Buscar pedidos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filtros-der">
          <button className="btn-producto btn-nuevo" type="button" onClick={abrirModal}>
            ➕ Agregar producto
          </button>
          <button
            className="btn-producto btn-nuevo"
            type="button"
            onClick={crearPedidosPorProveedor}
          >
            ✅ Crear pedidos
          </button>
        </div>
      </div>

      {/* Tabla: Items agregados */}
      <div className="table-container">
        <div className="table-header">
          <h2>Productos agregados</h2>
        </div>

        <div className="table-responsive">
          <table className="productos-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Proveedor</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {items.map((it) => (
                <tr key={it.id}>
                  <td><code>#{it.codigo}</code></td>
                  <td>{it.descripcion}</td>
                  <td>{it.cantidad}</td>
                  <td>
                    {proveedores.find((p) => p.id === it.proveedorId)?.nombre ?? "—"}
                  </td>
                  <td className="acciones-cell">
                    <button
                      className="btn-accion editar"
                      type="button"
                      title="Editar"
                      onClick={() => editarItem(it)}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-accion eliminar"
                      type="button"
                      title="Eliminar"
                      onClick={() => eliminarItem(it.id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: "1rem", opacity: 0.7 }}>
                    No hay productos agregados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabla: Pedidos creados */}
      <div className="table-container">
        <div className="table-header">
          <h2>Pedidos por proveedor</h2>
        </div>

        <div className="table-responsive">
          <table className="productos-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Proveedor</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Items</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {pedidosFiltrados.map((p) => (
                <tr key={p.id}>
                  <td><code>#{p.id}</code></td>
                  <td>{p.proveedorNombre}</td>
                  <td>{p.fecha}</td>
                  <td>
                    <span className={`estado-badge ${p.estado === "Pendiente" ? "bajo" : "activo"}`}>
                      {p.estado}
                    </span>
                  </td>
                  <td>{p.items.length}</td>
                  <td className="acciones-cell">
                    <button
                      className="btn-accion editar"
                      type="button"
                      title="Pendiente"
                      onClick={() => cambiarEstadoPedido(p.id, "Pendiente")}
                    >
                      P
                    </button>
                    <button
                      className="btn-accion editar"
                      type="button"
                      title="Realizado"
                      onClick={() => cambiarEstadoPedido(p.id, "Realizado")}
                    >
                      R
                    </button>
                    <button
                      className="btn-accion editar"
                      type="button"
                      title="Editar pedido"
                      onClick={() => editarPedido(p)}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-accion eliminar"
                      type="button"
                      title="Eliminar"
                      onClick={() => eliminarPedido(p.id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}

              {pedidosFiltrados.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: "1rem", opacity: 0.7 }}>
                    No hay pedidos creados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: agregar/editar item */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) cerrarModal();
          }}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingItem ? "Editar producto" : "Agregar producto"}</h2>
            <h4 className="subtitle">Código, descripción, proveedor y cantidad</h4>

            <form onSubmit={agregarALaLista}>
              <label>Código</label>
              <select name="codigo" value={draft.codigo} onChange={onChangeDraft} required>
                {catalogo.map((p) => (
                  <option key={p.codigo} value={p.codigo}>
                    {p.codigo}
                  </option>
                ))}
              </select>

              <label>Descripción</label>
              <input
                name="descripcion"
                value={draft.descripcion}
                onChange={onChangeDraft}
                placeholder="Escribe la descripción..."
                required
              />

              <label>Proveedor</label>
              <select
                name="proveedorId"
                value={draft.proveedorId}
                onChange={onChangeDraft}
                required
              >
                {proveedores.map((pr) => (
                  <option key={pr.id} value={pr.id}>
                    {pr.nombre}
                  </option>
                ))}
              </select>

              <label>Cantidad</label>
              <input
                type="number"
                name="cantidad"
                min={1}
                value={draft.cantidad}
                onChange={onChangeDraft}
                placeholder="Cantidad"
                required
              />

              <div className="pedidos-preview">
                <p><strong>Proveedor:</strong> {proveedorSeleccionado?.nombre ?? "—"}</p>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() => {
                    cerrarModal();
                    cancelarEdicionItem();
                  }}
                >
                  Cerrar
                </button>

                <button type="submit" className="btn-guardar">
                  {editingItem ? "Guardar cambios" : "Agregar"}
                </button>

                {editingItem && (
                  <button
                    type="button"
                    className="btn-cancelar"
                    onClick={cancelarEdicionItem}
                  >
                    Cancelar edición
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
