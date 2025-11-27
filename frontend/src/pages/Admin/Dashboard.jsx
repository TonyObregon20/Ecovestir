import { useEffect, useState } from 'react';
import api from '../../api/api';
import OrderCharts from './OrderCharts';

export default function Dashboard() {
  const [stats, setStats] = useState({
    ventasHoy: 0,
    productosActivos: 0,
    usuarios: 0,
    ventasPagadas: 0,
    ventasHoyCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchStats = async () => {
      try {
        setLoading(true);
  const res = await api.get('/api/admin/dashboard');
        if (!mounted) return;
        const data = res.data || res;
        setStats({
          ventasHoy: data.ventasHoy || 0,
          productosActivos: data.productosActivos || 0,
          usuarios: data.usuarios || 0,
          ventasPagadas: data.ventasPagadas || 0,
          ventasHoyCount: data.ventasHoyCount || 0,
        });
      } catch (err) {
        console.error('Error cargando estadísticas:', err);
        setError(err?.message || 'Error');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchStats();
    return () => { mounted = false; };
  }, []);

  const formatCurrency = (v) => {
    try {
      return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'USD' }).format(v);
    } catch (e) {
      return `$${Number(v).toFixed(2)}`;
    }
  };

  return (
    <>
      <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <div className="card" style={{ flex: '1 1 220px', minWidth: 220, maxWidth: 320 }}>
          <h3>Ventas Hoy</h3>
          <p>{loading ? 'Cargando...' : formatCurrency(stats.ventasHoy)}</p>
          {!loading && <small style={{ color: '#666' }}>{stats.ventasHoyCount} orden(es) hoy</small>}
        </div>
        <div className="card" style={{ flex: '1 1 220px', minWidth: 220, maxWidth: 320 }}>
          <h3>Productos Activos</h3>
          <p>{loading ? 'Cargando...' : stats.productosActivos}</p>
        </div>
        <div className="card" style={{ flex: '1 1 220px', minWidth: 220, maxWidth: 320 }}>
          <h3>Ventas</h3>
          <p>{loading ? 'Cargando...' : stats.ventasPagadas}</p>
        </div>
        <div className="card" style={{ flex: '1 1 220px', minWidth: 220, maxWidth: 320 }}>
          <h3>Usuarios</h3>
          <p>{loading ? 'Cargando...' : stats.usuarios}</p>
        </div>
      </div>
      {error && <div style={{ color: 'red', marginTop: 12 }}>Error: {error}</div>}
      {/* Charts */}
      <OrderCharts />
    </>
  );
}
