import { useMemo, useState } from "react";
import "../styles/shared.css";
import "../styles/proveedores.css";

export default function Proveedores() {
  const [proveedores, setProveedores] = useState([
    {
      id: 1,
      nit: "900123456-7",
      nombre: "Distribuidora Andina",
      telefono: "3105551234",
      email: "contacto@andina.com",
      estado: "Activo",
    },
    {
      id: 2,
      nit: "800987654-1",
      nombre: "TecnoProveedores SAS",
      telefono: "3204448899",
      email: "ventas@tecnopro.com",
      estado: "Activo",
    },
    
  ]);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const filteredProv = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return proveedores;
    return proveedores.filter((p) =>
      [p.nit, p.nombre, p.telefono, p.email, p.estado].some((v) =>
        String(v).toLowerCase().includes(q),
      ),
    );
  }, [proveedores, search]);

  const abrirNuevo = () => {
    setEditing(null);
    setShowModal(true);
  };

  const abrirEditar = (p) => {
    setEditing(p);
    setShowModal(true);
  };

  const eliminar = (id) => {
    if (confirm("¿Eliminar este proveedor?")) {
      setProveedores((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleGuardar = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);

    const nuevo = {
      id: editing ? editing.id : Date.now(),
      nit: fd.get("nit")?.toString().trim(),
      nombre: fd.get("nombre")?.toString().trim(),
      telefono: fd.get("telefono")?.toString().trim(),
      email: fd.get("email")?.toString().trim(),
      estado: fd.get("estado")?.toString().trim() || "Activo",
    };

    setProveedores((prev) => {
      if (editing) return prev.map((p) => (p.id === editing.id ? nuevo : p));
      return [nuevo, ...prev];
    });

    setShowModal(false);
    setEditing(null);
    e.target.reset();
  };

  return (
    <div className="container">
      <div className="header">
        <div className="header-left">
          <h1 className="proveedores-title">
            🏪 Proveedores <span></span>
          </h1>
        </div>
      </div>

      <div className="filtros-bar">
        <div className="filtros-izq">
          <input
            className="filtro-input "
            placeholder="🔍 Buscar por NIT, nombre, teléfono, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filtros-der">
          <button
            className="btn-producto btn-nuevo"
            onClick={abrirNuevo}
          >
            ➕ Agregar proveedor
          </button>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2>Lista de proveedores</h2>
        </div>

        <div className="table-responsive">
          <table className="proveedores-table">
            <thead>
              <tr>
                <th>NIT</th>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filteredProv.map((p) => (
                <tr key={p.id}>
                  <td>
                    <code>{p.nit}</code>
                  </td>
                  <td>{p.nombre}</td>
                  <td>{p.telefono}</td>
                  <td>{p.email}</td>
                  <td>
                    <span
                      className={`proveedores-badge ${p.estado.toLowerCase()}`}
                    >
                      {p.estado}
                    </span>
                  </td>
                  <td className="acciones-cell">
                    <button
                      className="btn-accion editar"
                      onClick={() => abrirEditar(p)}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-accion eliminar"
                      onClick={() => eliminar(p.id)}
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <button className="btn-ver" type="button">
            Ver proveedores
          </button>
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
            <h2>{editing ? "Editar" : "Nuevo"} proveedor</h2>
            <h4 className="proveedores-modal-subtitle">Ingresar Campos</h4>

            <form onSubmit={handleGuardar}>
              <input
                name="nit"
                className="proveedores-modal-input"
                placeholder="NIT"
                defaultValue={editing?.nit}
                required
              />
              <input
                name="nombre"
                className="proveedores-modal-input"
                placeholder="Nombre del proveedor"
                defaultValue={editing?.nombre}
                required
              />
              <input
                name="telefono"
                className="proveedores-modal-input"
                placeholder="Teléfono"
                defaultValue={editing?.telefono}
              />
              <input
                name="email"
                type="email"
                className="proveedores-modal-input"
                placeholder="Email"
                defaultValue={editing?.email}
              />

              <select
                name="estado"
                className="proveedores-modal-input"
                defaultValue={editing?.estado ?? "Activo"}
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>

              <div className="proveedores-modal-actions">
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-guardar"
                >
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
