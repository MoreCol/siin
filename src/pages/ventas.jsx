import { useMemo, useState } from "react";
import "../styles/shared.css";
import "../styles/ventas.css"; // opcional (puede estar vacío si no quieres extra)
import { MdAdd} from "react-icons/md";

export default function Ventas() {
  // Catálogo demo (puedes conectarlo con tu módulo Productos)
  const [catalogo] = useState([
    { codigo: "P001", descripcion: "Cuaderno espiral", precio: 4500 },
    { codigo: "P002", descripcion: "Lapicero", precio: 1200 },
    { codigo: "P003", descripcion: "Borrador", precio: 800 },
  ]);

  // Modal
  const [showModal, setShowModal] = useState(false);

  // Venta en edición (factura)
  const [factura, setFactura] = useState({
    cliente: "",
    fecha: new Date().toISOString().slice(0, 10),
    metodoPago: "Efectivo",
  });

  // Item draft (para agregar a factura)
  const [draft, setDraft] = useState({
    codigo: catalogo[0]?.codigo ?? "P001",
    descripcion: "", // editable si quieres
    cantidad: 1,
    precioUnitario: catalogo[0]?.precio ?? 0,
  });

  // Items de la factura actual
  // item: {id, codigo, descripcion, cantidad, precioUnitario}
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  // Ventas creadas
  // venta: {id, cliente, fecha, metodoPago, estado, items, total}
  const [ventas, setVentas] = useState([]);

  // Buscar
  const [search, setSearch] = useState("");

  const productoSeleccionado = useMemo(() => {
    return catalogo.find((p) => p.codigo === draft.codigo) ?? null;
  }, [catalogo, draft.codigo]);

  const onChangeFactura = (e) => {
    const { name, value } = e.target;
    setFactura((prev) => ({ ...prev, [name]: value }));
  };

  const onChangeDraft = (e) => {
    const { name, value } = e.target;

    // Si cambia el código, sugerimos precio y descripción del catálogo (pero quedan editables)
    if (name === "codigo") {
      const prod = catalogo.find((p) => p.codigo === value);
      setDraft((prev) => ({
        ...prev,
        codigo: value,
        precioUnitario: prod?.precio ?? prev.precioUnitario,
        descripcion: prev.descripcion || (prod?.descripcion ?? ""),
      }));
      return;
    }

    setDraft((prev) => ({
      ...prev,
      [name]:
        name === "cantidad" || name === "precioUnitario"
          ? Number(value)
          : value,
    }));
  };

  const abrirCrearVenta = () => {
    setFactura({
      cliente: "",
      fecha: new Date().toISOString().slice(0, 10),
      metodoPago: "Efectivo",
    });
    setDraft({
      codigo: catalogo[0]?.codigo ?? "P001",
      descripcion: "",
      cantidad: 1,
      precioUnitario: catalogo[0]?.precio ?? 0,
    });
    setItems([]);
    setEditingItem(null);
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const agregarItem = (e) => {
    e.preventDefault();

    const cantidad = Number(draft.cantidad);
    if (!cantidad || cantidad < 1) return alert("Cantidad inválida");

    const precioUnitario = Number(draft.precioUnitario);
    if (!precioUnitario || precioUnitario < 0) return alert("Precio inválido");

    // Si no escribieron descripción, usamos la del catálogo si existe
    const descripcionFinal =
      draft.descripcion.trim() || productoSeleccionado?.descripcion || "";

    if (!descripcionFinal) return alert("Falta la descripción");

    const itemNuevo = {
      id: editingItem ? editingItem.id : Date.now(),
      codigo: draft.codigo.trim(),
      descripcion: descripcionFinal,
      cantidad,
      precioUnitario,
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
    setDraft({
      codigo: it.codigo,
      descripcion: it.descripcion,
      cantidad: it.cantidad,
      precioUnitario: it.precioUnitario,
    });
  };

  const eliminarItem = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    if (editingItem?.id === id) setEditingItem(null);
  };

  const subtotal = useMemo(() => {
    return items.reduce((acc, it) => acc + it.cantidad * it.precioUnitario, 0);
  }, [items]);

  const crearVenta = () => {
    if (!factura.cliente.trim()) return alert("Falta el cliente");
    if (!factura.fecha) return alert("Falta la fecha");
    if (items.length === 0) return alert("Agrega al menos un producto");

    const ventaNueva = {
      id: Date.now(),
      cliente: factura.cliente.trim(),
      fecha: factura.fecha,
      metodoPago: factura.metodoPago,
      estado: "Realizada", // o "Pendiente" si quieres
      items: items.map((x) => ({ ...x })),
      total: subtotal,
    };

    setVentas((prev) => [ventaNueva, ...prev]);

    setShowModal(false);
    setItems([]);
    setEditingItem(null);
  };

  const eliminarVenta = (id) => {
    if (confirm("¿Eliminar esta venta?")) {
      setVentas((prev) => prev.filter((v) => v.id !== id));
    }
  };

  const ventasFiltradas = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ventas;

    return ventas.filter((v) =>
      [v.id, v.cliente, v.fecha, v.metodoPago, v.estado].some((x) =>
        String(x).toLowerCase().includes(q),
      ),
    );
  }, [ventas, search]);

  return (
    <div className="container">
      <div className="header">
        <div className="header-left">
          <h1>Ventas</h1>
        </div>
      </div>

      <div className="filtros-bar">
        <div className="filtros-izq">
          <input
            className="filtro-input search-global"
            placeholder="🔍 Buscar ventas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filtros-der">
          <button
            className="btn-producto btn-nuevo"
            type="button"
            onClick={abrirCrearVenta}
          >
           <MdAdd className="add-icon" />Crear venta
          </button>
        </div>
      </div>

      {/* Tabla ventas */}
      <div className="table-container">
        <div className="table-header">
          <h2>Ventas realizadas</h2>
        </div>

        <div className="table-responsive">
          <table className="productos-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Método</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {ventasFiltradas.map((v) => (
                <tr key={v.id}>
                  <td>
                    <code>#{v.id}</code>
                  </td>
                  <td>{v.cliente}</td>
                  <td>{v.fecha}</td>
                  <td>{v.metodoPago}</td>
                  <td>{v.total.toLocaleString("es-CO")}</td>
                  <td className="acciones-cell">
                    <button
                      className="btn-accion eliminar"
                      type="button"
                      title="Eliminar"
                      onClick={() => eliminarVenta(v.id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}

              {ventasFiltradas.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: "1rem", opacity: 0.7 }}>
                    No hay ventas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal factura */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) cerrarModal();
          }}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Nueva venta</h2>
            <h4 className="subtitle"></h4>

            {/* Encabezado factura */}
            <div className="form-row">
              <div className="form-group">
                <label>Cliente</label>
                <input
                  name="cliente"
                  value={factura.cliente}
                  onChange={onChangeFactura}
                  placeholder="Nombre del cliente"
                  required
                />
              </div>

              <div className="form-group">
                <label>Fecha</label>
                <input
                  type="date"
                  name="fecha"
                  value={factura.fecha}
                  onChange={onChangeFactura}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Método de pago</label>
                <select
                  name="metodoPago"
                  value={factura.metodoPago}
                  onChange={onChangeFactura}
                >
                  <option value="Efectivo">Efectivo</option>
                  <option value="Nequi">Nequi</option>
                </select>
              </div>
            </div>

        
            {/* Agregar producto a factura */}
            <form onSubmit={agregarItem}>
              <div className="form-row">
                <div className="form-group">
                  <label>Código</label>
                  <select
                    name="codigo"
                    value={draft.codigo}
                    onChange={onChangeDraft}
                    required
                  >
                    {catalogo.map((p) => (
                      <option key={p.codigo} value={p.codigo}>
                        {p.codigo}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Descripción</label>
                  <input
                    name="descripcion"
                    value={draft.descripcion}
                    onChange={onChangeDraft}
                    placeholder="Descripción del producto"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Cantidad</label>
                  <input
                    type="number"
                    name="cantidad"
                    min={1}
                    value={draft.cantidad}
                    onChange={onChangeDraft}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Precio unitario</label>
                  <input
                    type="number"
                    name="precioUnitario"
                    min={0}
                    value={draft.precioUnitario}
                    onChange={onChangeDraft}
                    required
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={cerrarModal}
                >
                  Cerrar
                </button>

                <button type="submit" className="btn-guardar">
                  {editingItem ? "Guardar item" : "Agregar item"}
                </button>
              </div>
            </form>

            {/* Tabla items de factura */}
            <div style={{ marginTop: 16 }}>
              <div className="table-header">
                <h2>Detalle de factura</h2>
              </div>

              <div className="table-responsive">
                <table className="productos-table">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Descripción</th>
                      <th>Cantidad</th>
                      <th>Precio</th>
                      <th>Subtotal</th>
                      <th>Acción</th>
                    </tr>
                  </thead>

                  <tbody>
                    {items.map((it) => (
                      <tr key={it.id}>
                        <td>
                          <code>#{it.codigo}</code>
                        </td>
                        <td>{it.descripcion}</td>
                        <td>{it.cantidad}</td>
                        <td>{it.precioUnitario.toLocaleString("es-CO")}</td>
                        <td>
                          {(it.cantidad * it.precioUnitario).toLocaleString(
                            "es-CO",
                          )}
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
                        <td
                          colSpan={6}
                          style={{ padding: "1rem", opacity: 0.7 }}
                        >
                          Agrega productos para la factura.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div
                className="table-footer"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div style={{ fontSize: 18, fontWeight: 800 }}>
                  Total: {subtotal.toLocaleString("es-CO")}
                </div>
                <button className="btn-ver" type="button" onClick={crearVenta}>
                  Crear venta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
