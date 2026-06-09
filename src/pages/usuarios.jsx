import { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import { MdEdit, MdDelete } from 'react-icons/md';
import { Button } from '../components/ui/Button';
import { FilterBar } from '../components/ui/filterBar';

const API_URL = 'http://localhost:3000/api/usuarios';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    password: '',
    id_rol: 1,
    estado: 'Activo'
  });

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);

      const data = res.data.map(u => ({
        id_usuario: u.id_usuario,
        nombre: u.nombre,
        apellido: u.apellido,
        correo: u.correo,
        password: u.password,
        id_rol: u.id_rol,
        estado: u.estado ? 'Activo' : 'Inactivo'
      }));

      setUsuarios(data);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return usuarios;

    return usuarios.filter(u =>
      [u.nombre, u.apellido, u.correo, u.estado]
        .some(v => String(v).toLowerCase().includes(q))
    );
  }, [usuarios, search]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const editar = u => {
    setEditing(u);
    setForm({
      nombre: u.nombre,
      apellido: u.apellido,
      correo: u.correo,
      password: u.password,
      id_rol: u.id_rol,
      estado: u.estado
    });
  };

  const limpiar = () => {
    setEditing(null);
    setForm({
      nombre: '',
      apellido: '',
      correo: '',
      password: '',
      id_rol: 1,
      estado: 'Activo'
    });
  };

  const guardar = async e => {
    e.preventDefault();

    const payload = {
      nombre: form.nombre,
      apellido: form.apellido,
      correo: form.correo,
      password: form.password,
      id_rol: Number(form.id_rol),
      estado: form.estado === 'Activo'
    };

    if (editing) {
      await axios.put(`${API_URL}/${editing.id_usuario}`, payload);
    } else {
      await axios.post(API_URL, payload);
    }

    await cargarUsuarios();
    limpiar();
  };

  const eliminar = async id => {
    if (!confirm('¿Eliminar usuario?')) return;

    await axios.delete(`${API_URL}/${id}`);
    setUsuarios(prev => prev.filter(u => u.id_usuario !== id));
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400">Cargando usuarios...</div>;
  }

  return (
    <div className="mx-auto">

      {/* HEADER */}
      <h1 className="text-4xl font-bold text-slate-800 px-6 py-6">
        Usuarios
      </h1>

      {/* FORM */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 mb-6">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-slate-800">
            {editing ? 'Editar usuario' : 'Nuevo usuario'}
          </h2>

          {editing && (
            <Button variant="cancel" type="button" onClick={limpiar}>
              Cancelar edición
            </Button>
          )}
        </div>

        <form onSubmit={guardar}>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

            <input name="nombre" value={form.nombre} onChange={handleChange}
              placeholder="Nombre"
              className="rounded-xl border border-slate-300 px-4 py-3" />

            <input name="apellido" value={form.apellido} onChange={handleChange}
              placeholder="Apellido"
              className="rounded-xl border border-slate-300 px-4 py-3" />

            <input name="correo" value={form.correo} onChange={handleChange}
              placeholder="Correo"
              className="rounded-xl border border-slate-300 px-4 py-3" />

            <input name="password" value={form.password} onChange={handleChange}
              placeholder="Contraseña"
              type="password"
              className="rounded-xl border border-slate-300 px-4 py-3" />

            <select name="id_rol" value={form.id_rol} onChange={handleChange}
              className="rounded-xl border border-slate-300 px-4 py-3">
              <option value={1}>Admin</option>
              <option value={2}>Cajero</option>
              <option value={3}>Inventario</option>
            </select>

            <select name="estado" value={form.estado} onChange={handleChange}
              className="rounded-xl border border-slate-300 px-4 py-3">
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>

          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="cancel" onClick={limpiar}>
              Limpiar
            </Button>

            <Button type="submit" variant="primary">
              Guardar
            </Button>
          </div>
        </form>
      </section>

      {/* TABLE */}
      <div className="overflow-x-auto
      w-full
      rounded-2xl
      shadow-[0_4px_20px_rgba(0,0,0,0.08)]
      min-w-0
      bg-white">

        <table className="w-full
        .min-w-[900px]
        border-collapse
        overflow-hidden
        rounded-2xl
        bg-white">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['Nombre', 'Apellido', 'Correo', 'Rol', 'Estado', 'Acciones']
                .map(h => (
                  <th key={h} className="  .bg-gradient-to-br
                from-slate-50
                to-slate-100
                px-4
                py-5
                text-left
                text-[0.9rem]
                font-semibold
                uppercase
                tracking-[0.5px]
                text-gray-700
                border-b-2
                border-slate-200">
                    {h}
                  </th>
                ))}
            </tr>
          </thead>

          <tbody>
            {filtered.map(u => (
              <tr key={u.id_usuario} className=" hover:bg-blue-500/5
              transition-colors">

                <td className="px-4 py-3 border-b border-slate-100 align-middle">{u.nombre}</td>
                <td className="px-4 py-5 border-b border-slate-100 align-middle">{u.apellido}</td>
                <td className="px-4 py-5 border-b border-slate-100 align-middle">{u.correo}</td>
                <td className="px-4 py-5 border-b border-slate-100 align-middle">{u.id_rol}</td>

                <td className="px-8 py-5 border-b border-slate-100 align-middle">
                  <span className={`px-2 py-1 rounded-full text-xs
                    ${u.estado === 'Activo'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-slate-100 text-slate-500'}`}>
                    {u.estado}
                  </span>
                </td>

                <td className="px-8 py-5 border-b border-slate-100 align-middle">
                  <Button variant="edit" onClick={() => editar(u)}>
                    <MdEdit />
                  </Button>

                  <Button variant="delete" onClick={() => eliminar(u.id_usuario)}>
                    <MdDelete />
                  </Button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}