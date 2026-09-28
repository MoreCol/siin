import { useState, useEffect } from 'react';
import axios from 'axios';
import { MdInventory2, MdSell, MdPeople, MdWarning, MdShoppingCart, MdPendingActions } from 'react-icons/md';

const API_STATS = '/api/stats';

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
    return <div className="flex items-center justify-center py-20 text-slate-400 text-sm">Cargando dashboard...</div>;
  }

  return (
    <div className="px-8 py-8  ">
      <h1 className="text-4xl font-bold text-slate-600 px-6 py-6">Dashboard</h1>

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
    </div>
  );
}
