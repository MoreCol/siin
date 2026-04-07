import { useMemo } from "react";
import "../styles/shared.css";
import "../styles/dashboard.css"; // 

export default function Dashboard() {
 
  const productos = [
    
  ];

  const pedidos = [
    { id: 101, fecha: "2026-02-18", proveedor: "Escobar", estado: "Pendiente", items: 3 },
  ]

  const ventas = [
    { id: 501, fecha: "2026-02-18", total: 35000, cliente: "Juan S." },
    
  ];


  const totalProductos = useMemo(() => productos.length, [productos]);

  const bajoStock = useMemo(() => {
    return productos.filter(p => p.stock <= p.stockMin);
  }, [productos]);

 
  const productosPorCategoria = useMemo(() => {
    const map = new Map();
    for (const p of productos) {
      map.set(p.categoria, (map.get(p.categoria) ?? 0) + 1);
    }
    return Array.from(map.entries()).map(([categoria, total]) => ({ categoria, total }));
  }, [productos]);

  return (
    <div className="container">
      <div className="header">
        <div className="header-left">
         
          <h1> Dashboard</h1>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 24 }}>
        <div className="table-container" style={{ marginBottom: 0 }}>
          <div className="table-header">
            <h2>Total de productos</h2>
          </div>
          <div style={{ fontSize: 42, fontWeight: 800, paddingTop: 8 }}>
            {totalProductos}
          </div>
          <div style={{ opacity: 0.7, marginTop: 8 }}>
            Cantidad de productos registrados.
          </div>
        </div>

        <div className="table-container" style={{ marginBottom: 0 }}>
          <div className="table-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
            <h2>Bajo stock</h2>
            <button className="btn-producto btn-nuevo" type="button">
              Ver inventario
            </button>
          </div>

          <div style={{ fontSize: 42, fontWeight: 800, paddingTop: 8 }}>
            {bajoStock.length}
          </div>
          <div style={{ opacity: 0.7, marginTop: 8 }}>
            Productos con stock menor o igual al mínimo.
          </div>
        </div>
      </div>

      {/* Pedidos recientes */}
      <div className="table-container">
        <div className="table-header">
          <h2>Pedidos recientes</h2>
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
              </tr>
            </thead>
            <tbody>
              {pedidos.slice(0, 5).map(p => (
                <tr key={p.id}>
                  <td><code>#{p.id}</code></td>
                  <td>{p.proveedor}</td>
                  <td>{p.fecha}</td>
                  <td>
                    <span className={`estado-badge ${p.estado === "Pendiente" ? "bajo" : "activo"}`}>
                      {p.estado}
                    </span>
                  </td>
                  <td>{p.items}</td>
                </tr>
              ))}
              {pedidos.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: "1rem", opacity: 0.7 }}>
                    No hay pedidos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ventas recientes */}
      <div className="table-container">
        <div className="table-header">
          <h2>Ventas recientes</h2>
        </div>

        <div className="table-responsive">
          <table className="productos-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {ventas.slice(0, 5).map(v => (
                <tr key={v.id}>
                  <td><code>#{v.id}</code></td>
                  <td>{v.cliente}</td>
                  <td>{v.fecha}</td>
                  <td>{v.total.toLocaleString("es-CO")}</td>
                </tr>
              ))}
              {ventas.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: "1rem", opacity: 0.7 }}>
                    No hay ventas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Productos por categoría (sencillo y explicable) */}
      <div className="table-container">
        <div className="table-header">
          <h2>Productos por categoría</h2>
        </div>

        <div className="table-responsive">
          <table className="productos-table">
            <thead>
              <tr>
                <th>Categoría</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {productosPorCategoria.map(row => (
                <tr key={row.categoria}>
                  <td>{row.categoria}</td>
                  <td>{row.total}</td>
                </tr>
              ))}
              {productosPorCategoria.length === 0 && (
                <tr>
                  <td colSpan={2} style={{ padding: "1rem", opacity: 0.7 }}>
                    Sin datos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <button className="btn-ver" type="button">
            Ver más
          </button>
        </div>
      </div>
    </div>
  );
}
