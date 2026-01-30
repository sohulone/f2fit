import { Router } from 'express';
import { wellnessController } from '../container';
import { validate } from '../middlewares/validate.middleware';
import { mockAuth } from '../middlewares/auth.middleware';
import { 
  saveWellnessSchema, 
  idParamSchema,
  dateParamSchema
} from '../schemas/wellness.schema';

const router = Router();

// Aplicar autenticación a todas las rutas
router.use(mockAuth);

router.get('/', wellnessController.getAll);
router.get('/:date', validate(dateParamSchema), wellnessController.getByDate);
router.get('/:id/summary', validate(idParamSchema), wellnessController.getHealthSummary);
router.get('/:id/recommendations', validate(idParamSchema), wellnessController.getRecommendations);
router.post('/', validate(saveWellnessSchema), wellnessController.save);

export default router;
