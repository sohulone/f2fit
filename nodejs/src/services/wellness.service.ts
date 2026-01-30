import { IWellnessRepository } from '../interfaces/repositories/wellness.repository.interface';
import { IWellnessService } from '../interfaces/services/wellness.service.interface';
import { IWellness, ICreateWellnessDTO, IUpdateWellnessDTO } from '../interfaces/wellness.interface';
import { Wellness } from '../models/Wellness';
import { Habit } from '../models/habits/Habit';
import { HabitFactory } from '../models/habits/HabitFactory';

export class WellnessService implements IWellnessService {
  constructor(private readonly repository: IWellnessRepository) {}

  async getAllWellness(): Promise<IWellness[]> {
    return await this.repository.findAll();
  }

  async getWellnessByUserId(userId: string): Promise<IWellness[]> {
    return await this.repository.findByUserId(userId);
  }

  async getWellnessByDate(date: string, userId: string): Promise<IWellness | null> {
    return await this.repository.findByUserIdAndDate(userId, date);
  }

  async getWellnessModelById(id: string, userId: string): Promise<Wellness | null> {
    const data = await this.repository.findById(id);
    if (!data) return null;
    
    // Verificar que el wellness pertenezca al usuario
    if (data.user_id !== userId) {
      return null;
    }

    return Wellness.fromJSON(data);
  }

  async getHealthSummary(id: string, userId: string) {
    const wellness = await this.getWellnessModelById(id, userId);

    if (!wellness) {
      throw new Error('Wellness not found');
    }

    return wellness.getHealthSummary();
  }

  async getRecommendations(id: string, userId: string): Promise<string[]> {
    const wellness = await this.getWellnessModelById(id, userId);

    if (!wellness) {
      throw new Error('Wellness not found');
    }

    return wellness.getRecommendations();
  }

  async saveWellness(data: ICreateWellnessDTO): Promise<IWellness> {
    const existingWellness = await this.repository.findByUserIdAndDate(data.user_id, data.date);

    if (existingWellness) {
      // Actualizar el registro existente llamando a updateWellness
      return await this.updateWellness(existingWellness.id, data.user_id, {
        physical_energy: data.physical_energy,
        emotional_state: data.emotional_state,
        notes: data.notes,
        habits: data.habits,
      }) as IWellness;
    }
    
    // Crear un nuevo registro
    const habits = this.createHabitsFromDTO(data.habits);
    const wellness = new Wellness(
      undefined,
      data.user_id,
      data.date,
      data.physical_energy,
      data.emotional_state,
      data.notes,
      habits
    );

    this.validateWellnessModel(wellness);

    const dataToSave = this.convertWellnessToDTOForDB(wellness);
    const saved = await this.repository.create(dataToSave);

    return saved;
  }

  async updateWellness(id: string, userId: string, data: IUpdateWellnessDTO): Promise<IWellness | null> {
    const existingWellness = await this.getWellnessModelById(id, userId);

    if (!existingWellness) {
      throw new Error('Wellness not found');
    }

    if (data.physical_energy !== undefined) {
      existingWellness.physicalEnergy = data.physical_energy;
    }
    if (data.emotional_state !== undefined) {
      existingWellness.emotionalState = data.emotional_state;
    }
    if (data.notes !== undefined) {
      existingWellness.notes = data.notes;
    }
    if (data.date !== undefined) {
      existingWellness.date = data.date;
    }

    if (data.habits !== undefined) {
      const newHabits = this.createHabitsFromDTO(data.habits);

      existingWellness.habits.forEach(habit => {
        existingWellness.removeHabit(habit.name);
      });

      newHabits.forEach(habit => {
        existingWellness.addHabit(habit);
      });
    }

    this.validateWellnessModel(existingWellness);

    const dataToUpdate = this.convertWellnessToDTOForDB(existingWellness);
  
    return await this.repository.update(id, dataToUpdate);
  }

  private createHabitsFromDTO(habitsData: any): Habit[] {
    const habits: Habit[] = [];
    
    Object.entries(habitsData).forEach(([name, value]) => {
      if (typeof value === 'boolean') {
        habits.push(HabitFactory.createHabit(name, value));
      } else if (typeof value === 'object') {
        habits.push(HabitFactory.createFromJSON({ name, ...value }));
      }
    });

    return habits;
  }

  private validateWellnessModel(wellness: Wellness): void {    
    const score = wellness.calculateTotalScore();

    if (score < 0) {
      throw new Error('Invalid habits configuration: negative score');
    }
  }

  private convertWellnessToDTOForDB(wellness: Wellness): ICreateWellnessDTO {
    const json = wellness.toJSON();

    const habitsForDB: any = {};
    wellness.habits.forEach(habit => {
      habitsForDB[habit.name] = habit.toJSON();
    });

    return {
      user_id: json.user_id,
      date: json.date,
      physical_energy: json.physical_energy,
      emotional_state: json.emotional_state,
      notes: json.notes,
      habits: habitsForDB,
    };
  }
}
