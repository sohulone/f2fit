import { useEffect, useState } from 'react';
import useOnlineStatus from '../hooks/useOnlineStatus';
import { syncPendingOperations } from '../services/api';

export default function OnlineStatusIndicator() {
  const isOnline = useOnlineStatus();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    if (isOnline && !isSyncing) {
      // Sincronizar cuando se recupera la conexión
      const sync = async () => {
        setIsSyncing(true);
        setShowStatus(true);
        const result = await syncPendingOperations();
        setSyncResult(result);
        setIsSyncing(false);
        
        // Ocultar después de 5 segundos si todo está sincronizado
        if (result.synced > 0 || result.failed > 0) {
          setTimeout(() => {
            setShowStatus(false);
            setSyncResult(null);
          }, 5000);
        }
      };
      
      sync();
    }
  }, [isOnline]);

  useEffect(() => {
    // Mostrar indicador cuando cambia el estado de conexión
    setShowStatus(true);
    const timer = setTimeout(() => {
      if (isOnline && !syncResult) {
        setShowStatus(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isOnline]);

  if (!showStatus && isOnline) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slideDown">
      <div className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 ${
        isOnline 
          ? 'bg-green-500 text-white' 
          : 'bg-yellow-500 text-white'
      }`}>
        {!isOnline ? (
          <>
            <span className="text-lg">📡</span>
            <div>
              <p className="font-semibold">Modo Offline</p>
              <p className="text-sm opacity-90">Los cambios se sincronizarán automáticamente</p>
            </div>
          </>
        ) : isSyncing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <div>
              <p className="font-semibold">Sincronizando...</p>
              <p className="text-sm opacity-90">Actualizando datos pendientes</p>
            </div>
          </>
        ) : syncResult && (syncResult.synced > 0 || syncResult.failed > 0) ? (
          <>
            <span className="text-lg">✓</span>
            <div>
              <p className="font-semibold">Sincronización completa</p>
              <p className="text-sm opacity-90">
                {syncResult.synced > 0 && `${syncResult.synced} registro(s) sincronizado(s)`}
                {syncResult.failed > 0 && ` · ${syncResult.failed} error(es)`}
              </p>
            </div>
          </>
        ) : (
          <>
            <span className="text-lg">✓</span>
            <div>
              <p className="font-semibold">Conexión restaurada</p>
              <p className="text-sm opacity-90">Todos los datos están actualizados</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
