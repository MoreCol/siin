import { useMemo, useState, useEffect } from 'react';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';
import axios from 'axios';
import { Button } from '../components/ui/Button';
import { FilterBar } from '../components/ui/filterBar';

const API_URL = 'http://localhost:3000/api/proveedores';

export default function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    nit: '',
    nombre: '',
    telefono: '',
    email: '',
    direccion: ''
  });

  useEffect(() => {
    cargarProveedores();
  }, []);

  const cargarProveedores = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);

      const formateados = res.data.map(p => ({
        id_proveedor: p.id_proveedor,
        nit: p.nit || '',
        nombre: p.nombre || '',
        telefono: p.telefono || '',
        email: p.correo || '',
        direccion: p.direccion || ''
      }));

      setProveedores(formateados);
    } finally {
      setLoading(false);
    }
  };

  const filteredProv = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return proveedores;

    return proveedores.filter(p =>
      [p.nit, p.nombre, p.telefono, p.email].some(v => String(v).toLowerCase().includes(q))
    );
  }, [proveedores, search]);

  const editarProveedor = p => {
    setEditing(p);
    setForm({
      nit: p.nit,
      nombre: p.nombre,
      telefono: p.telefono,
      email: p.email,
      direccion: p.direccion
    });
  };

  const limpiar = () => {
    setEditing(null);
    setForm({
      nit: '',
      nombre: '',
      telefono: '',
      email: '',
      direccion: ''
    });
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGuardar = async e => {
    e.preventDefault();

    const payload = {
      nit: Number(form.nit),
      nombre: form.nombre,
      telefono: Number(form.telefono),
      correo: form.email,
      direccion: form.direccion
    };

    if (editing) {
      await axios.put(`${API_URL}/${editing.id_proveedor}`, payload);
    } else {
      await axios.post(API_URL, payload);
    }

    await cargarProveedores();
    limpiar();
  };

  const eliminarProveedor = async id => {
    if (!confirm('¿Eliminar proveedor?')) return;

    await axios.delete(`${API_URL}/${id}`);
    setProveedores(prev => prev.filter(p => p.id_proveedor !== id));
  };

  if (loading) {
    return <div className="flex justify-center py-20 text-slate-400">Cargando proveedores...</div>;
  }

  return (
    <div className="mx-auto">
      {/* HEADER */}
      <h1 className="text-4xl font-bold text-slate-800 !px-6 !py-6">Proveedores</h1>

      {/* FORM (SIN MODAL) */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm !p-5 !mb-6">
        <div className="flex justify-between items-center !mb-6">
          <h2 className="text-2xl font-semibold text-slate-800">{editing ? 'Editar proveedor' : 'Nuevo proveedor'}</h2>

          {editing && <Button onClick={() => setEditing(null)}>Cancelar edición</Button>}
        </div>

        <form onSubmit={handleGuardar}>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 !gap-5">
            <input
              name="nit"
              value={form.nit}
              onChange={handleChange}
              placeholder="NIT"
              className="rounded-xl border border-slate-300 !px-4 !py-3"
            />

            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre"
              className="rounded-xl border border-slate-300 !px-4 !py-3"
            />

            <input
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              placeholder="Teléfono"
              className="rounded-xl border border-slate-300 !px-4 !py-3"
            />

            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="rounded-xl border border-slate-300 !px-4 !py-3"
            />

            <input
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              placeholder="Dirección"
              className="rounded-xl border border-slate-300 !px-4 !py-3"
            />
          </div>

          <div className="flex justify-end !gap-3 !mt-6">
            <Button variant="cancel" type="button" onClick={limpiar}>
              Limpiar
            </Button>

            <Button type="submit" variant="primary">
              Guardar
            </Button>
          </div>
        </form>
      </section>

      {/* FILTER */}
      <FilterBar
        search={
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar proveedores..."
            className="w-full bg-transparent outline-none"
          />
        }
      />

      {/* TABLE */}
      <div className="mt-6">
        <div
          className=" overflow-x-auto
      w-full
      rounded-2xl
      shadow-[0_4px_20px_rgba(0,0,0,0.08)]
      min-w-0
      bg-white"
        >
          <table
            className=" w-full
        min-w-[900px]
        border-collapse
        overflow-hidden
        rounded-2xl
        bg-white"
          >
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['Nit', 'Nombre', 'Teléfono', 'Email', 'Direccion', 'Acciones'].map(header => (
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
              {filteredProv.map(p => (
                <tr
                  key={p.id_proveedor}
                  className="  hover:bg-blue-500/5
              transition-colors"
                >
                  <td className="!px-8 !py-5 border-b border-slate-100 align-middle">{p.nit}</td>
                  <td className="!px-8 !py-5 border-b border-slate-100 align-middle">{p.nombre}</td>

                  <td className="!px-8 !py-5 border-b border-slate-100 align-middle">{p.telefono}</td>
                  <td className="!px-8 !py-5 border-b border-slate-100 align-middle">{p.email}</td>
                  <td className="!px-8 !py-5 border-b border-slate-100 align-middle">{p.direccion}</td>

                  <td className="!px-8 !py-5 border-b border-slate-100 align-middle">
                    <div className="flex items-center !gap-3">
                      <Button variant="edit" onClick={() => editarProveedor(p)}>
                        <MdEdit />
                      </Button>
                      <Button variant="delete" onClick={() => eliminarProveedor(p.id_proveedor)}>
                        <MdDelete />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
