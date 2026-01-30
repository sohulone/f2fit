import { Habit } from './Habit';

enum Intensity {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export class ExerciseHabit extends Habit {
  private _duration: number;
  private _intensity: Intensity;

  constructor(completed: boolean, duration: number = 0, intensity: Intensity = Intensity.Medium) {
    super('exercise', completed, 10);
    this._duration = duration;
    this._intensity = intensity;
  }

  get duration(): number {
    return this._duration;
  }

  get intensity(): Intensity {
    return this._intensity;
  }

  set duration(value: number) {
    if (value < 0) {
      throw new Error('Duration cannot be negative');
    }

    this._duration = value;
  }

  set intensity(value: Intensity) {
    this._intensity = value;
  }

  calculateImpact(): number {
    if (!this.completed) return 0;
    
    const baseImpact = this.points;
    const intensityMultiplier = {
      [Intensity.Low]: 1,
      [Intensity.Medium]: 1.5,
      [Intensity.High]: 2,
    };
    
    return baseImpact * intensityMultiplier[this._intensity];
  }

  getRecommendation(): string {
    if (this.completed) {
      return '¡Excelente trabajo! El ejercicio mejora tu energía física.';
    }

    return 'Intenta realizar al menos 30 minutos de ejercicio hoy.';
  }

  toJSON() {
    return {
      ...super.toJSON(),
      duration: this._duration,
      intensity: this._intensity,
    };
  }
}
