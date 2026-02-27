import { useMemo, useState } from "react";
import "../styles/shared.css";
import "../styles/inventario.css";
import { MdEdit, MdDelete,MdAdd } from "react-icons/md";

export default function Inventario() {
  const [movimientos, setMovimientos] = useState([
    {
      id: 1,
      codigo: "P001",
      nombre: "Cuaderno espiral",
      categoria: "Papelería",
      cantidad: 10,
      tipo: "Entrada",
      fecha: "2026-02-01",
      usuario: "Juan S.",
    },
    {
      id: 2,
      codigo: "P002",
      nombre: "Lapiceros",
      categoria: "Papelería",
      cantidad: 2,
      tipo: "Salida",
      fecha: "2026-02-08",
      usuario: "Juan S.",
    },
  ]);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const filteredMovimientos = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return movimientos;

    return movimientos.filter((m) =>
      [m.codigo, m.nombre, m.categoria, m.tipo, m.fecha, m.usuario].some((v) =>
        String(v).toLowerCase().includes(q),
      ),
    );
  }, [movimientos, search]);

  const movimientoNuevo = () => {
    setEditing(null);
    setShowModal(true);
  };

  const editarMovimiento = (mov) => {
    setEditing(mov);
    setShowModal(true);
  };

  const eliminarMovimiento = (id) => {
    if (confirm("¿Deseas eliminar este movimiento?")) {
      setMovimientos((liActual) => liActual.filter((m) => m.id !== id));
    }
  };

  const handleGuardar = (e) => {
    e.preventDefault(); //evita sobrecargar
    const fd = new //crea nuevo formato
    FormData(e.target); // e es ele vento cuando
    // hacemos submit y e.preventdefault apunta al formulario

    //formaData es un objeto de JavaScriptque
    // sirve opara leer todos los campos de un formulario. evitamos usar hook
    const nuevo = {
      id: editing ? editing.id : Date.now(), //si el id concide con el id que queremos editar
      //nos crea una nueva fila y limpiamos con trim
      tipo: fd.get("tipo"),
      codigo: fd.get("codigo").trim(),
      nombre: fd.get("nombre").trim(),
      categoria: fd.get("categoria").trim(),
      cantidad: Number(fd.get("cantidad")), //al usar formaData, solo trabajamos con strings

      fecha: fd.get("fecha"),
      usuario: fd.get("usuario").trim(),
    };

    setMovimientos((liActual) => {
      //Si el id coincide con el que estamos editando reemplaza con el objeto nuevo que creaste
      if (editing)
        return liActual.map((m) => (m.id === editing.id ? nuevo : m));
      return [nuevo, ...liActual]; //VISUALZIAMOS EL EVENTO AGREGADO PRIMERO EN LA LISTA
    });

    setShowModal(false);
    setEditing(null);
    e.target.reset();
  };

  return (
    <div className="container">
      <div className="header">
        <div className="header-left">
          <h1 className="inventario-title">Inventario</h1>
        </div>
      </div>

      <div className="filtros-bar">
        <div className="filtros-izq">
          <input
            className="filtro-input search-global"
            placeholder="🔍 Buscar por código, nombre, tipo, fecha, usuario..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filtros-der">
          <button className="btn-producto btn-nuevo" onClick={movimientoNuevo}>
            <MdAdd className="add-icon" />
            Agregar movimiento
          </button>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2>Movimientos</h2>
        </div>
        <div className="table-responsive">
          <table className="inventario-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Cantidad</th>
                <th>Tipo de movimiento</th>
                <th>Fecha de movimiento</th>
                <th>Usuario res</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {filteredMovimientos.map((m) => (
                <tr key={m.id}>
                  <td>
                    <code>#{m.codigo}</code>
                  </td>
                  <td>{m.nombre}</td>
                  <td>{m.categoria}</td>
                  <td>{m.cantidad}</td>
                  <td>
                    <span
                      className={`tipo-badge ${String(m.tipo ?? "").toLowerCase()}`}
                    >
                      {m.tipo}
                    </span>
                  </td>
                  <td>{m.fecha}</td>
                  <td>{m.usuario}</td>
                  <td className="acciones-cell">
                    <button
                      className="btn-accion editar"
                      onClick={() => editarMovimiento(m)}
                      title="Editar"
                    >
                      <MdEdit />
                    </button>
                    <button
                      className="btn-accion eliminar"
                      onClick={() => eliminarMovimiento(m.id)}
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
          <button className="btn-ver">Ver mas</button>
        </div>
      </div>

      {showModal && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div className="modal-content">
            <h2>{editing ? "Editar" : "Nuevo"} movimiento</h2>
            <h4 className="subtitle">Formulario de movimiento</h4>

            <form onSubmit={handleGuardar}>
              <select
                name="tipo"
                defaultValue={editing?.tipo ?? "Entrada"}
                required
              >
                <div className="select-content">
                  <option value="Entrada">Entrada</option>
                  <option value="Salida">Salida</option>
                  <option value="Ajuste">Ajuste</option>
                </div>
              </select>

              <input
                name="codigo"
                placeholder="Código"
                defaultValue={editing?.codigo}
                required
              />
              <input
                name="nombre"
                placeholder="Producto"
                defaultValue={editing?.nombre}
                required
              />
              <input
                name="categoria"
                placeholder="Categoría"
                defaultValue={editing?.categoria}
                required
              />
              <input
                type="number"
                name="cantidad"
                placeholder="Cantidad"
                defaultValue={editing?.cantidad}
                required
              />
              <input
                type="date"
                name="fecha"
                defaultValue={editing?.fecha ?? ""}
                required
              />
              <input
                name="usuario"
                placeholder="Usuario responsable"
                defaultValue={editing?.usuario ?? "Juan S."}
                required
              />

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() => setShowModal(false)}
                >
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
