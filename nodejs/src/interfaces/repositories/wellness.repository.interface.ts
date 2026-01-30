import { IWellness, ICreateWellnessDTO, IUpdateWellnessDTO } from '../wellness.interface';

export interface IWellnessRepository {
  findAll(): Promise<IWellness[]>;
  findByUserId(userId: string): Promise<IWellness[]>;
  findById(id: string): Promise<IWellness | null>;
  findByUserIdAndDate(userId: string, date: string): Promise<IWellness | null>;
  create(data: ICreateWellnessDTO): Promise<IWellness>;
  update(id: string, data: IUpdateWellnessDTO): Promise<IWellness | null>;
}
