import { z } from 'zod';

// Schema para los hábitos
const habitsSchema = z.object({
  exercise: z.boolean({ message: 'Exercise habit is required and must be a boolean' }),
  hydration: z.boolean({ message: 'Hydration habit is required and must be a boolean' }),
  sleep: z.boolean({ message: 'Sleep habit is required and must be a boolean' }),
  nutrition: z.boolean({ message: 'Nutrition habit is required and must be a boolean' }),
});

// Schema para crear un wellness record (sin user_id porque viene de la autenticación)
export const saveWellnessSchema = z.object({
  body: z.object({
    date: z.string({ message: 'Date is required' })
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in format YYYY-MM-DD'),
    
    physical_energy: z.number({ message: 'Physical energy is required and must be a number' })
      .min(0, 'Physical energy must be at least 0')
      .max(10, 'Physical energy must be at most 10'),
    
    emotional_state: z.number({ message: 'Emotional state is required and must be a number' })
      .min(0, 'Emotional state must be at least 0')
      .max(10, 'Emotional state must be at most 10'),
    
    notes: z.string({ message: 'Notes are required' })
      .max(1000, 'Notes must be at most 1000 characters'),
    
    habits: habitsSchema,
  }),
});

// Schema para validar parámetros de ID
export const idParamSchema = z.object({
  params: z.object({
    id: z.string({ message: 'Wellness ID is required' })
      .min(1, 'Wellness ID cannot be empty'),
  }),
});

// Schema para validar parámetro de fecha
export const dateParamSchema = z.object({
  params: z.object({
    date: z.string({ message: 'Date is required' })
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in format YYYY-MM-DD'),
  }),
});

// Tipos TypeScript inferidos de los schemas
export type SaveWellnessInput = z.infer<typeof saveWellnessSchema>;
export type IdParamInput = z.infer<typeof idParamSchema>;
export type DateParamInput = z.infer<typeof dateParamSchema>;
