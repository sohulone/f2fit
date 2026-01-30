import { Response } from 'express';
import { IWellnessService } from '../interfaces/services/wellness.service.interface';
import { AuthenticatedRequest } from '../types/express';

export class WellnessController {
  constructor(private readonly service: IWellnessService) { }

  getAll = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });

        return;
      }

      const wellness = await this.service.getWellnessByUserId(userId);

      res.status(200).json({
        success: true,
        data: wellness,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  };

  getByDate = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { date } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const wellness = await this.service.getWellnessByDate(date, userId);

      if (!wellness) {
        res.status(404).json({
          success: false,
          message: 'Wellness not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: wellness,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  };

  getHealthSummary = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const summary = await this.service.getHealthSummary(id, userId);

      res.status(200).json({
        success: true,
        data: summary,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Not found',
      });
    }
  };

  getRecommendations = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const recommendations = await this.service.getRecommendations(id, userId);

      res.status(200).json({
        success: true,
        data: recommendations,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Not found',
      });
    }
  };

  save = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const wellness = await this.service.saveWellness({
        ...req.body,
        user_id: userId,
      });

      res.status(201).json({
        success: true,
        data: wellness,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Bad request',
      });
    }
  };
}
