import { useState, useEffect } from 'react';
import axios from 'axios';
import { MdInventory2, MdSell, MdPeople, MdWarning, MdShoppingCart, MdPendingActions } from 'react-icons/md';

const API_STATS = 'http://localhost:3000/api/stats';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarStats();
  }, []);

  const cargarStats = async () => {
    try {
      const res = await axios.get(API_STATS, getHeaders());
      setStats(res.data);
    } catch (err) {
      console.error('Error cargando stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
        Cargando dashboard...
      </div>
    );
  }

  return (
    <div className="px-8 py-8  ">
      <h1 className="text-4xl font-bold text-slate-800 mb-2 ">Dashboard</h1>

      {/* TARJETAS */}
      <div className="grid grid-cols-1 sm:grid-cols-3  gap-6 mb-8">

        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center">
            <MdShoppingCart className="text-blue-500 text-2xl" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide">Total productos</p>
            <p className="text-3xl font-bold text-slate-800">{stats?.totalProductos ?? 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-amber-50 flex items-center justify-center">
            <MdWarning className="text-amber-500 text-2xl" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide">Stock bajo</p>
            <p className="text-3xl font-bold text-amber-500">{stats?.stockBajo ?? 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-emerald-50 flex items-center justify-center">
            <MdSell className="text-emerald-500 text-2xl" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide">Ventas hoy</p>
            <p className="text-3xl font-bold text-slate-800">{stats?.ventasHoy ?? 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-emerald-50 flex items-center justify-center">
            <MdSell className="text-emerald-500 text-2xl" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide">Ingresos hoy</p>
            <p className="text-3xl font-bold text-emerald-600">
              ${Number(stats?.ingresosHoy ?? 0).toLocaleString('es-CO')}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
            <MdPendingActions className="text-red-500 text-2xl" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide">Pedidos pendientes</p>
            <p className="text-3xl font-bold text-red-500">{stats?.pedidosPendientes ?? 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
            <MdPeople className="text-purple-500 text-2xl" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide">Total usuarios</p>
            <p className="text-3xl font-bold text-slate-800">{stats?.totalUsuarios ?? 0}</p>
          </div>
        </div>

      </div>

      {/* ÚLTIMAS VENTAS */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Últimas ventas</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left py-2 px-3 text-slate-400 font-medium text-xs uppercase">#</th>
              <th className="text-left py-2 px-3 text-slate-400 font-medium text-xs uppercase">Fecha</th>
              <th className="text-left py-2 px-3 text-slate-400 font-medium text-xs uppercase">Método</th>
              <th className="text-left py-2 px-3 text-slate-400 font-medium text-xs uppercase">Estado</th>
              <th className="text-left py-2 px-3 text-slate-400 font-medium text-xs uppercase">Total</th>
            </tr>
          </thead>
          <tbody>
            {stats?.ultimasVentas?.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-slate-400 text-sm">
                  No hay ventas registradas
                </td>
              </tr>
            ) : (
              stats?.ultimasVentas?.map(v => (
                <tr key={v.id_venta} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-3 px-3 font-mono text-xs text-slate-400">#{v.id_venta}</td>
                  <td className="py-3 px-3 text-slate-600">{v.fecha_venta?.split('T')[0] ?? '—'}</td>
                  <td className="py-3 px-3 text-slate-600">{v.metodo_pago}</td>
                  <td className="py-3 px-3">
                    <span className={`text-xs px-2 py-1 rounded-lg font-medium
                      ${v.estado === 'Pagado' ? 'bg-emerald-50 text-emerald-700' :
                        v.estado === 'Pendiente' ? 'bg-amber-50 text-amber-700' :
                        'bg-red-50 text-red-700'}`}>
                      {v.estado}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800">
                    ${Number(v.total).toLocaleString('es-CO')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}