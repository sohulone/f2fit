import { IWellness, ICreateWellnessDTO, IUpdateWellnessDTO } from '../wellness.interface';

export interface IWellnessService {
  getAllWellness(): Promise<IWellness[]>;
  getWellnessByUserId(userId: string): Promise<IWellness[]>;
  getWellnessByDate(date: string, userId: string): Promise<IWellness | null>;
  getHealthSummary(id: string, userId: string): Promise<any>;
  getRecommendations(id: string, userId: string): Promise<string[]>;
  saveWellness(data: ICreateWellnessDTO): Promise<IWellness>;
  updateWellness(id: string, userId: string, data: IUpdateWellnessDTO): Promise<IWellness | null>;
}
