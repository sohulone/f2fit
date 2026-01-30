import axios from 'axios';
import { offlineStorage } from './offlineStorage';

const API_URL = 'http://localhost:3000/api/wellness';

// Configurar token de autenticación
let currentUser = 'user1'; // Por defecto

export const setAuthUser = (user) => {
  currentUser = user;
};

export const getAuthUser = () => currentUser;

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${currentUser}`,
    'Content-Type': 'application/json',
  },
});

// Inicializar almacenamiento offline
offlineStorage.init().catch(console.error);

// Función para sincronizar operaciones pendientes
export const syncPendingOperations = async () => {
  if (!navigator.onLine) return { synced: 0, failed: 0 };

  try {
    const pending = await offlineStorage.getPendingOperations();
    let synced = 0;
    let failed = 0;

    for (const operation of pending) {
      try {
        await axios.post(API_URL, operation.data, {
          headers: {
            Authorization: `Bearer ${operation.userId}`,
            'Content-Type': 'application/json',
          },
        });
        await offlineStorage.deletePendingOperation(operation.id);
        synced++;
      } catch (error) {
        console.error('Error syncing operation:', error);
        failed++;
      }
    }

    return { synced, failed };
  } catch (error) {
    console.error('Error syncing:', error);
    return { synced: 0, failed: 0 };
  }
};

export const wellnessService = {
  // Obtener todos los registros del usuario
  getAll: async () => {
    try {
      if (!navigator.onLine) {
        const data = await offlineStorage.getAllWellness(currentUser);
        return { data };
      }

      const response = await axios.get(API_URL, getAuthHeaders());
      
      // Guardar en cache offline
      for (const item of response.data.data) {
        await offlineStorage.saveWellness({ ...item, userId: currentUser });
      }
      
      return response.data;
    } catch (error) {
      // Si falla, intentar cargar desde offline
      if (!navigator.onLine || error.code === 'ERR_NETWORK') {
        const data = await offlineStorage.getAllWellness(currentUser);
        return { data };
      }
      throw error;
    }
  },

  // Obtener registro por fecha
  getByDate: async (date) => {
    try {
      if (!navigator.onLine) {
        const data = await offlineStorage.getWellnessByDate(date, currentUser);
        return { data };
      }

      const response = await axios.get(`${API_URL}/${date}`, getAuthHeaders());
      
      // Guardar en cache offline si existe
      if (response.data.data) {
        await offlineStorage.saveWellness({ ...response.data.data, userId: currentUser });
      }
      
      return response.data;
    } catch (error) {
      // Si falla, intentar cargar desde offline
      if (!navigator.onLine || error.code === 'ERR_NETWORK' || error.response?.status === 404) {
        const data = await offlineStorage.getWellnessByDate(date, currentUser);
        return { data };
      }
      throw error;
    }
  },

  // Guardar o actualizar registro
  save: async (data) => {
    try {
      // Guardar en offline primero
      await offlineStorage.saveWellness({ ...data, userId: currentUser });

      if (!navigator.onLine) {
        // Guardar operación pendiente para sincronizar después
        await offlineStorage.savePendingOperation({
          type: 'save',
          data,
          userId: currentUser,
        });
        return { data: { ...data, offline: true } };
      }

      const response = await axios.post(API_URL, data, getAuthHeaders());
      return response.data;
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        // Guardar operación pendiente
        await offlineStorage.savePendingOperation({
          type: 'save',
          data,
          userId: currentUser,
        });
        return { data: { ...data, offline: true } };
      }
      throw error;
    }
  },

  // Obtener resumen de salud
  getSummary: async (id) => {
    if (!navigator.onLine) {
      throw new Error('Esta función requiere conexión a internet');
    }
    const response = await axios.get(`${API_URL}/${id}/summary`, getAuthHeaders());
    return response.data;
  },

  // Obtener recomendaciones
  getRecommendations: async (id) => {
    if (!navigator.onLine) {
      throw new Error('Esta función requiere conexión a internet');
    }
    const response = await axios.get(`${API_URL}/${id}/recommendations`, getAuthHeaders());
    return response.data;
  },
};
