import { useState, useEffect, useRef } from 'react';
import { wellnessService } from '../services/api';
import RangeSlider from '../components/RangeSlider';
import HabitButton from '../components/HabitButton';
import Toast from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';

export default function WellnessForm({ currentUser }) {
  const today = new Date().toISOString().split('T')[0];
  
  const [formData, setFormData] = useState({
    date: today,
    physical_energy: 3,
    emotional_state: 3,
    notes: '',
    habits: {
      exercise: false,
      hydration: false,
      sleep: false,
      nutrition: false,
    },
  });

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const saveTimeoutRef = useRef(null);
  const isInitialLoad = useRef(true);

  // Cargar datos del día actual al montar el componente
  useEffect(() => {
    const loadTodayData = async () => {
      setLoading(true);
      isInitialLoad.current = true;
      
      try {
        const response = await wellnessService.getByDate(today);
        if (response.data) {
          // Transformar hábitos del formato del backend al formato del frontend
          const habits = {
            exercise: response.data.habits.exercise?.completed || false,
            hydration: response.data.habits.hydration?.completed || false,
            sleep: response.data.habits.sleep?.completed || false,
            nutrition: response.data.habits.nutrition?.completed || false,
          };
          
          setFormData({
            date: today,
            physical_energy: response.data.physical_energy,
            emotional_state: response.data.emotional_state,
            notes: response.data.notes,
            habits: habits,
          });
        } else {
          // Resetear a valores por defecto
          setFormData({
            date: today,
            physical_energy: 3,
            emotional_state: 3,
            notes: '',
            habits: {
              exercise: false,
              hydration: false,
              sleep: false,
              nutrition: false,
            },
          });
        }
      } catch (error) {
        // Si no existe registro para hoy, resetear a valores por defecto
        setFormData({
          date: today,
          physical_energy: 3,
          emotional_state: 3,
          notes: '',
          habits: {
            exercise: false,
            hydration: false,
            sleep: false,
            nutrition: false,
          },
        });
      } finally {
        setLoading(false);
        // Marcar que la carga inicial ha terminado
        setTimeout(() => {
          isInitialLoad.current = false;
        }, 100);
      }
    };

    loadTodayData();
  }, [today, currentUser]);

  const autoSave = async (data) => {
    setSaving(true);
    setMessage(null);

    try {
      await wellnessService.save(data);
      setMessage({ type: 'success', text: '✓ Guardado automáticamente' });
      
      setTimeout(() => {
        setMessage(null);
      }, 2000);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Error al guardar' 
      });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    // No guardar durante la carga inicial
    if (isInitialLoad.current || loading) {
      return;
    }

    // Limpiar timeout previo
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Guardar después de 2 segundos de inactividad
    saveTimeoutRef.current = setTimeout(() => {
      autoSave(formData);
    }, 2000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [formData, loading]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'physical_energy' || name === 'emotional_state' 
        ? parseInt(value) 
        : value
    }));
  };

  const handleHabitChange = (habit) => {
    setFormData(prev => ({
      ...prev,
      habits: {
        ...prev.habits,
        [habit]: !prev.habits[habit],
      },
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-purple-700">Registrar Bienestar</h2>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
            {/* Energía Física */}
            <RangeSlider
              label="Energía Física"
              emoji="⚡"
              name="physical_energy"
              value={formData.physical_energy}
              onChange={handleInputChange}
              color="blue"
            />

            {/* Estado Emocional */}
            <RangeSlider
              label="Estado Emocional"
              emoji="💖"
              name="emotional_state"
              value={formData.emotional_state}
              onChange={handleInputChange}
              color="pink"
            />

        {/* Notas */}
        <div>
          <label className="block text-sm font-bold text-purple-700 mb-2">
            📝 Notas
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
            placeholder="¿Cómo te sientes hoy?"
          />
        </div>

        {/* Hábitos */}
        <div>
          <label className="block text-sm font-bold text-purple-700 mb-3">
            🌟 Hábitos Saludables
          </label>
          <div className="grid grid-cols-2 gap-4">
            <HabitButton
              emoji="🏃"
              label="Ejercicio"
              isActive={formData.habits.exercise}
              onClick={() => handleHabitChange('exercise')}
            />
            <HabitButton
              emoji="💧"
              label="Hidratación"
              isActive={formData.habits.hydration}
              onClick={() => handleHabitChange('hydration')}
            />
            <HabitButton
              emoji="😴"
              label="Sueño"
              isActive={formData.habits.sleep}
              onClick={() => handleHabitChange('sleep')}
            />
            <HabitButton
              emoji="🥗"
              label="Nutrición"
              isActive={formData.habits.nutrition}
              onClick={() => handleHabitChange('nutrition')}
            />
          </div>
        </div>
      </div>
        </>
      )}
      
      {/* Notificación toast en la parte inferior */}
      <Toast 
        message={message?.text} 
        type={message?.type} 
      />
    </div>
  );
}
