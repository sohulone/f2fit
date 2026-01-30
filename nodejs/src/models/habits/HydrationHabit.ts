import { Habit } from './Habit';

export class HydrationHabit extends Habit {
  private _glassesOfWater: number;
  private _targetGlasses: number;

  constructor(completed: boolean, glassesOfWater: number = 0, targetGlasses: number = 8) {
    super('hydration', completed, 8);
    this._glassesOfWater = glassesOfWater;
    this._targetGlasses = targetGlasses;
  }

  get glassesOfWater(): number {
    return this._glassesOfWater;
  }

  get targetGlasses(): number {
    return this._targetGlasses;
  }

  set glassesOfWater(value: number) {
    if (value < 0) {
      throw new Error('Glasses cannot be negative');
    }

    this._glassesOfWater = value;
  }

  set targetGlasses(value: number) {
    if (value < 1) {
      throw new Error('Target must be at least 1');
    }

    this._targetGlasses = value;
  }

  calculateImpact(): number {
    if (!this.completed) {
      return 0;
    }
    
    const percentage = Math.min(this._glassesOfWater / this._targetGlasses, 1);

    return this.points * percentage;
  }

  getRecommendation(): string {
    if (this.completed) {
      return '¡Bien hidratado! El agua es esencial para tu bienestar.';
    }

    const remaining = Math.max(this._targetGlasses - this._glassesOfWater, 0);

    return `Te faltan ${remaining} vasos de agua para alcanzar tu meta.`;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      glassesOfWater: this._glassesOfWater,
      targetGlasses: this._targetGlasses,
    };
  }
}
