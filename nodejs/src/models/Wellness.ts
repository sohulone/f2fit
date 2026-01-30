import { Habit } from './habits/Habit';
import { HabitFactory } from './habits/HabitFactory';

export class Wellness {
  private _id: string | undefined;
  private _userId: string;
  private _date: string;
  private _physicalEnergy: number;
  private _emotionalState: number;
  private _notes: string;
  private _habits: Map<string, Habit>; // Composición
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: string | undefined,
    userId: string,
    date: string,
    physicalEnergy: number,
    emotionalState: number,
    notes: string,
    habits: Habit[],
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    this._id = id;
    this._userId = userId;
    this._date = date;
    this._physicalEnergy = physicalEnergy;
    this._emotionalState = emotionalState;
    this._notes = notes;
    this._habits = new Map();
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;

    // Agregar hábitos al mapa
    habits.forEach(habit => this._habits.set(habit.name, habit));
  }

  get id(): string | undefined {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get date(): string {
    return this._date;
  }

  get physicalEnergy(): number {
    return this._physicalEnergy;
  }

  get emotionalState(): number {
    return this._emotionalState;
  }

  get notes(): string {
    return this._notes;
  }

  get habits(): Habit[] {
    return Array.from(this._habits.values());
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  set physicalEnergy(value: number) {
    if (value < 1 || value > 5) {
      throw new Error('Physical energy must be between 1 and 5');
    }
    this._physicalEnergy = value;
    this._updatedAt = new Date();
  }

  set emotionalState(value: number) {
    if (value < 1 || value > 5) {
      throw new Error('Emotional state must be between 1 and 5');
    }
    this._emotionalState = value;
    this._updatedAt = new Date();
  }

  set notes(value: string) {
    this._notes = value;
    this._updatedAt = new Date();
  }

  set date(value: string) {
    this._date = value;
    this._updatedAt = new Date();
  }

  getHabit(name: string): Habit | undefined {
    return this._habits.get(name);
  }

  addHabit(habit: Habit): void {
    this._habits.set(habit.name, habit);
    this._updatedAt = new Date();
  }

  removeHabit(name: string): boolean {
    const result = this._habits.delete(name);
    if (result) this._updatedAt = new Date();
    return result;
  }

  calculateTotalScore(): number {
    let total = 0;
    this._habits.forEach(habit => {
      total += habit.calculateImpact();
    });
  
    return total;
  }

  getRecommendations(): string[] {
    return this.habits.map(habit => habit.getRecommendation());
  }

  getHealthSummary(): {
    score: number;
    completedHabits: number;
    totalHabits: number;
    energyLevel: string;
    emotionalLevel: string;
  } {
    const completedHabits = this.habits.filter(h => h.completed).length;
    const totalHabits = this._habits.size;
    
    const energyLevels = ['Muy bajo', 'Bajo', 'Moderado', 'Alto', 'Muy alto'];
    const emotionalLevels = ['Muy mal', 'Mal', 'Regular', 'Bien', 'Muy bien'];

    return {
      score: this.calculateTotalScore(),
      completedHabits,
      totalHabits,
      energyLevel: energyLevels[this._physicalEnergy - 1],
      emotionalLevel: emotionalLevels[this._emotionalState - 1],
    };
  }

  // Serialización para guardar en BD
  toJSON() {
    const habitsObj: any = {};
    this._habits.forEach((habit, name) => {
      habitsObj[name] = habit.toJSON();
    });

    return {
      id: this._id,
      user_id: this._userId,
      date: this._date,
      physical_energy: this._physicalEnergy,
      emotional_state: this._emotionalState,
      notes: this._notes,
      habits: habitsObj,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  // Factory method estático para crear desde JSON
  static fromJSON(data: any): Wellness {
    const habits: Habit[] = [];
    
    // Si habits es un objeto simple de booleanos (formato antiguo)
    if (data.habits && typeof data.habits === 'object') {
      Object.entries(data.habits).forEach(([name, value]) => {
        if (typeof value === 'boolean') {
          habits.push(HabitFactory.createHabit(name, value));
        } else {
          habits.push(HabitFactory.createFromJSON(value));
        }
      });
    }

    return new Wellness(
      data.id,
      data.user_id,
      data.date,
      data.physical_energy,
      data.emotional_state,
      data.notes,
      habits,
      data.createdAt ? new Date(data.createdAt) : new Date(),
      data.updatedAt ? new Date(data.updatedAt) : new Date()
    );
  }
}
