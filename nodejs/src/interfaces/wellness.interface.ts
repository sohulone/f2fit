export interface IHabits {
  exercise: boolean;
  hydration: boolean;
  sleep: boolean;
  nutrition: boolean;
}

export interface IWellness {
  id: string;
  user_id: string;
  date: string;
  physical_energy: number;
  emotional_state: number;
  notes: string;
  habits: IHabits;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateWellnessDTO {
  user_id: string;
  date: string;
  physical_energy: number;
  emotional_state: number;
  notes: string;
  habits: IHabits;
}

export interface IUpdateWellnessDTO {
  user_id?: string;
  date?: string;
  physical_energy?: number;
  emotional_state?: number;
  notes?: string;
  habits?: IHabits;
}
