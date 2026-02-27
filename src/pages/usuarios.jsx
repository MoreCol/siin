import { useMemo, useState } from "react";
import "../styles/usuarios.css";
import "../styles/shared.css";
import { MdEdit, MdDelete,MdAdd } from "react-icons/md";
export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nombre: "Juan Pérez",
      usuario: "jperez",
      rol: "Admin",
      estado: "Activo",
    },
    {
      id: 2,
      nombre: "Ana Ruiz",
      usuario: "aruiz",
      rol: "Cajero",
      estado: "Activo",
    },
    
  ]);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return usuarios;
    return usuarios.filter((u) =>
      [u.id, u.nombre, u.usuario, u.rol, u.estado].some((v) =>
        String(v).toLowerCase().includes(q),
      ),
    );
  }, [usuarios, search]);

  const abrirNuevo = () => {
    setEditing(null);
    setShowModal(true);
  };
  const abrirEditar = (u) => {
    setEditing(u);
    setShowModal(true);
  };

  const eliminar = (id) => {
    if (confirm("¿Eliminar este usuario?")) {
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    }
  };

  const guardar = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);

    const nuevo = {
      id: editing ? editing.id : Date.now(),
      nombre: fd.get("nombre")?.toString().trim(),
      usuario: fd.get("usuario")?.toString().trim(),
      rol: fd.get("rol")?.toString(),
      estado: fd.get("estado")?.toString(),
    };

    if (!nuevo.nombre || !nuevo.usuario)
      return alert("Nombre y usuario son obligatorios");

    setUsuarios((prev) => {
      if (editing) return prev.map((u) => (u.id === editing.id ? nuevo : u));
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
          <h1 className="usuarios-title">
             Usuarios <span></span>
          </h1>
        </div>
      </div>

      <div className="filtros-bar">
        <div className="filtros-izq">
          <input
            className="filtro-input"
            placeholder="🔍 Buscar por nombre, usuario, rol, estado..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filtros-der">
          <button 
          className="btn-producto btn-nuevo" 
          onClick={abrirNuevo}>
            <MdAdd className="add-icon"/> Agregar usuario
          </button>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2>Lista de usuarios</h2>
        </div>

        <div className="table-responsive">
          <table className="usuarios-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td>
                    <code>{u.id}</code>
                  </td>
                  <td>{u.nombre}</td>
                  <td>{u.usuario}</td>
                  <td>{u.rol}</td>
                  <td>
                    <span
                      className={`usuarios-badge ${u.estado.toLowerCase()}`}
                    >
                      {u.estado}
                    </span>
                  </td>
                  <td className="acciones-cell">
                    <button
                      className="btn-accion editar"
                      onClick={() => abrirEditar(u)}
                      title="Editar"
                    >
                       <MdEdit/> 
                    </button>
                    <button
                      className="btn-accion eliminar"
                      onClick={() => eliminar(u.id)}
                      title="Eliminar"
                    >
                       <MdDelete/> 
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="usuarios-empty">
                    No hay usuarios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <button className="btn-ver" type="button">
            Ver usuarios
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
            <h2>{editing ? "Editar" : "Agregar"} usuario</h2>

            <form onSubmit={guardar}>
              <input
                className="usuarios-modal-input"
                name="nombre"
                placeholder="Nombre"
                defaultValue={editing?.nombre}
                required
              />
              <input
                className="usuarios-modal-input"
                name="usuario"
                placeholder="Usuario"
                defaultValue={editing?.usuario}
                required
              />

              <select
                className="usuarios-modal-input"
                name="rol"
                defaultValue={editing?.rol ?? "Cajero"}
              >
              <div className="select-content"> 
                <option value="Admin">Admin</option>
                <option value="Cajero">Cajero</option>
                <option value="Bodega">Responsable Inventario</option>
                </div>
              </select>

              <select
                className="usuarios-modal-input"
                name="estado"
                defaultValue={editing?.estado ?? "Activo"}
              >
                <div className="select-content"> 
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
                    </div>
              </select>

              <div className="usuarios-modal-actions">
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
