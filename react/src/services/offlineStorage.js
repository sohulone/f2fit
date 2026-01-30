// Gestión de almacenamiento local para datos offline
const DB_NAME = 'f2fit-offline';
const WELLNESS_STORE = 'wellness';
const PENDING_STORE = 'pending';

class OfflineStorage {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Store para datos de wellness
        if (!db.objectStoreNames.contains(WELLNESS_STORE)) {
          const wellnessStore = db.createObjectStore(WELLNESS_STORE, { keyPath: 'id', autoIncrement: true });
          wellnessStore.createIndex('date', 'date', { unique: false });
          wellnessStore.createIndex('userId', 'userId', { unique: false });
        }

        // Store para operaciones pendientes
        if (!db.objectStoreNames.contains(PENDING_STORE)) {
          db.createObjectStore(PENDING_STORE, { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }

  async saveWellness(data) {
    const transaction = this.db.transaction([WELLNESS_STORE], 'readwrite');
    const store = transaction.objectStore(WELLNESS_STORE);
    
    // Buscar si ya existe un registro para esa fecha y usuario
    const index = store.index('date');
    const request = index.getAll(data.date);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const existing = request.result.find(item => item.userId === data.userId);
        if (existing) {
          // Actualizar existente
          const updateRequest = store.put({ ...data, id: existing.id });
          updateRequest.onsuccess = () => resolve({ ...data, id: existing.id });
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          // Crear nuevo
          const addRequest = store.add(data);
          addRequest.onsuccess = () => resolve({ ...data, id: addRequest.result });
          addRequest.onerror = () => reject(addRequest.error);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getWellnessByDate(date, userId) {
    const transaction = this.db.transaction([WELLNESS_STORE], 'readonly');
    const store = transaction.objectStore(WELLNESS_STORE);
    const index = store.index('date');
    const request = index.getAll(date);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const result = request.result.find(item => item.userId === userId);
        resolve(result || null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getAllWellness(userId) {
    const transaction = this.db.transaction([WELLNESS_STORE], 'readonly');
    const store = transaction.objectStore(WELLNESS_STORE);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const results = request.result.filter(item => item.userId === userId);
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async savePendingOperation(operation) {
    const transaction = this.db.transaction([PENDING_STORE], 'readwrite');
    const store = transaction.objectStore(PENDING_STORE);
    const request = store.add({
      ...operation,
      timestamp: Date.now()
    });

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getPendingOperations() {
    const transaction = this.db.transaction([PENDING_STORE], 'readonly');
    const store = transaction.objectStore(PENDING_STORE);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async deletePendingOperation(id) {
    const transaction = this.db.transaction([PENDING_STORE], 'readwrite');
    const store = transaction.objectStore(PENDING_STORE);
    const request = store.delete(id);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clearAllData() {
    const transaction = this.db.transaction([WELLNESS_STORE, PENDING_STORE], 'readwrite');
    await transaction.objectStore(WELLNESS_STORE).clear();
    await transaction.objectStore(PENDING_STORE).clear();
  }
}

export const offlineStorage = new OfflineStorage();
