import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { wellnessService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import StatsCard from '../components/StatsCard';
import ChartCard from '../components/ChartCard';
import WellnessTable from '../components/WellnessTable';

export default function Dashboard({ currentUser }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await wellnessService.getAll();
      
      // Obtener los últimos 7 días
      const last7Days = response.data
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 7)
        .reverse();

      setData(last7Days);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    // Usar la fecha directamente sin conversión de zona horaria
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
  };

  const chartData = data.map(item => ({
    fecha: formatDate(item.date),
    energía: item.physical_energy,
    emoción: item.emotional_state,
  }));

  const habitsData = data.map(item => {
    const habitsCount = Object.values(item.habits).filter(habit => habit.completed === true).length;
    return {
      fecha: formatDate(item.date),
      hábitos: habitsCount,
    };
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        No hay datos registrados. Comienza registrando tu bienestar diario.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-purple-700">Dashboard - Últimos 7 Días</h2>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          label="Promedio Energía"
          value={(data.reduce((sum, item) => sum + item.physical_energy, 0) / data.length).toFixed(1)}
          colorClass="text-blue-600"
        />
        <StatsCard
          label="Promedio Emoción"
          value={(data.reduce((sum, item) => sum + item.emotional_state, 0) / data.length).toFixed(1)}
          colorClass="text-green-600"
        />
        <StatsCard
          label="Días Registrados"
          value={data.length}
          colorClass="text-purple-600"
        />
      </div>

      {/* Gráfico de líneas - Energía y Emoción */}
      <ChartCard title="Energía y Estado Emocional">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis domain={[1, 5]} />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="energía" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ r: 5 }}
            />
            <Line 
              type="monotone" 
              dataKey="emoción" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Gráfico de barras - Hábitos */}
      <ChartCard title="Hábitos Cumplidos por Día">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={habitsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis domain={[0, 4]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="hábitos" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Tabla de registros */}
      <ChartCard title="Detalle de Registros">
        <WellnessTable data={data} />
      </ChartCard>
    </div>
  );
}
