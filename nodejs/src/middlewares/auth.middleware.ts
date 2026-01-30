import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/express';

/**
 * Middleware de autenticación simulada
 * En un entorno real, aquí se validaría un token JWT o similar
 */
export const mockAuth = (req: AuthenticatedRequest, _: Response, next: NextFunction) => {
  // Simular que obtenemos el usuario del header Authorization
  const authHeader = req.headers.authorization;
  
  // Si no hay header, usar un usuario por defecto
  if (!authHeader) {
    req.user = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
    };
  } else {
    // Extraer el "token" del header (simulado)
    // En producción, aquí se validaría el token JWT
    const token = authHeader.replace('Bearer ', '');
    
    // Simular diferentes usuarios basados en el "token"
    if (token === 'user1') {
      req.user = {
        id: 'user-1',
        email: 'user1@example.com',
        name: 'Usuario Uno',
      };
    } else if (token === 'user2') {
      req.user = {
        id: 'user-2',
        email: 'user2@example.com',
        name: 'Usuario Dos',
      };
    } else if (token === 'user3') {
      req.user = {
        id: 'user-3',
        email: 'user3@example.com',
        name: 'Usuario Tres',
      };
    } else {
      // Token desconocido, usar usuario por defecto
      req.user = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
      };
    }
  }

  next();
};
