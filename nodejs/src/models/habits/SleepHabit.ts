import { Habit } from './Habit';

enum SleepQuality {
  Poor = 'poor',
  Fair = 'fair',
  Good = 'good',
  Excellent = 'excellent',
}

export class SleepHabit extends Habit {
  private _hours: number;
  private _quality: SleepQuality;

  constructor(completed: boolean, hours: number = 0, quality: SleepQuality = SleepQuality.Fair) {
    super('sleep', completed, 12);
    this._hours = hours;
    this._quality = quality;
  }

  get hours(): number {
    return this._hours;
  }

  get quality(): SleepQuality {
    return this._quality;
  }

  set hours(value: number) {
    if (value < 0 || value > 24) {
      throw new Error('Hours must be between 0 and 24');
    }

    this._hours = value;
  }

  set quality(value: SleepQuality) {
    this._quality = value;
  }

  calculateImpact(): number {
    if (!this.completed) return 0;
    
    const qualityMultiplier = {
      [SleepQuality.Poor]: 0.5,
      [SleepQuality.Fair]: 0.75,
      [SleepQuality.Good]: 1,
      [SleepQuality.Excellent]: 1.25,
    };
    
    // Dormir 7-9 horas es óptimo
    const hoursMultiplier = this._hours >= 7 && this._hours <= 9 ? 1 : 0.7;
    
    return this.points * qualityMultiplier[this._quality] * hoursMultiplier;
  }

  getRecommendation(): string {
    if (this.completed && this._hours >= 7 && this._hours <= 9) {
      return '¡Excelente descanso! Dormir bien es fundamental para la salud.';
    }
    if (this._hours < 7) {
      return 'Intenta dormir entre 7-9 horas para una mejor recuperación.';
    }
    return 'Establece una rutina de sueño regular para mejorar tu bienestar.';
  }

  toJSON() {
    return {
      ...super.toJSON(),
      hours: this._hours,
      quality: this._quality,
    };
  }
}
