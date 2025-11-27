import { useEffect, useState } from 'react';
import api from '../../api/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export default function OrderCharts() {
  const [data, setData] = useState({ monthly: [], daily: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/admin/orders/stats');
        if (!mounted) return;
        setData(res.data || res);
      } catch (err) {
        console.error('Error fetching order stats', err);
        setError(err?.message || 'Error');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchStats();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div style={{ marginTop: 20 }}>Cargando estadísticas...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  // Prepare monthly chart (last N months)
  const monthlyLabels = data.monthly.map(m => `${m.month}/${m.year}`);
  const monthlyCounts = data.monthly.map(m => m.count);
  const monthlyTotals = data.monthly.map(m => m.total);

  const monthlyCountDataset = {
    labels: monthlyLabels,
    datasets: [
      {
        label: 'Órdenes (count)',
        data: monthlyCounts,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        yAxisID: 'y'
      }
    ]
  };

  const monthlyTotalDataset = {
    labels: monthlyLabels,
    datasets: [
      {
        label: 'Ingresos (total)',
        data: monthlyTotals,
        borderColor: 'rgba(53,162,235,1)',
        backgroundColor: 'rgba(53,162,235,0.2)',
        yAxisID: 'y1'
      }
    ]
  };

  // Daily chart for current month
  const dailyLabels = data.daily.map(d => String(d.day));
  const dailyCounts = data.daily.map(d => d.count);

  const dailyDataset = {
    labels: dailyLabels,
    datasets: [
      {
        label: 'Órdenes por día',
        data: dailyCounts,
        backgroundColor: 'rgba(153,102,255,0.6)'
      }
    ]
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Órdenes - últimos meses</h3>
      <div style={{ maxWidth: 900 }}>
        <Line data={monthlyCountDataset} options={{ responsive: true, plugins: { legend: { display: true } } }} />
      </div>

      <h3 style={{ marginTop: 24 }}>Ingresos por mes</h3>
      <div style={{ maxWidth: 900 }}>
        <Bar data={monthlyTotalDataset} options={{ responsive: true, plugins: { legend: { display: true } } }} />
      </div>

      <h3 style={{ marginTop: 24 }}>Órdenes este mes (por día)</h3>
      <div style={{ maxWidth: 900 }}>
        <Bar data={dailyDataset} options={{ responsive: true }} />
      </div>
    </div>
  );
}
