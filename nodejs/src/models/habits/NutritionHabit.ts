import { Habit } from './Habit';

export class NutritionHabit extends Habit {
  private _meals: number;
  private _healthyMeals: number;
  private _vegetables: boolean;
  private _fruits: boolean;

  constructor(
    completed: boolean,
    meals: number = 0,
    healthyMeals: number = 0,
    vegetables: boolean = false,
    fruits: boolean = false
  ) {
    super('nutrition', completed, 10);
    this._meals = meals;
    this._healthyMeals = healthyMeals;
    this._vegetables = vegetables;
    this._fruits = fruits;
  }

  get meals(): number {
    return this._meals;
  }

  get healthyMeals(): number {
    return this._healthyMeals;
  }

  get vegetables(): boolean {
    return this._vegetables;
  }

  get fruits(): boolean {
    return this._fruits;
  }

  set meals(value: number) {
    if (value < 0) {
      throw new Error('Meals cannot be negative');
    }

    this._meals = value;
  }

  set healthyMeals(value: number) {
    if (value < 0 || value > this._meals) {
      throw new Error('Healthy meals must be between 0 and total meals');
    }

    this._healthyMeals = value;
  }

  set vegetables(value: boolean) {
    this._vegetables = value;
  }

  set fruits(value: boolean) {
    this._fruits = value;
  }

  calculateImpact(): number {
    if (!this.completed) return 0;
    
    const healthyRatio = this._meals > 0 ? this._healthyMeals / this._meals : 0;
    const vegetablesBonus = this._vegetables ? 0.2 : 0;
    const fruitsBonus = this._fruits ? 0.2 : 0;
    
    return this.points * (healthyRatio + vegetablesBonus + fruitsBonus);
  }

  getRecommendation(): string {
    if (this.completed && this._vegetables && this._fruits) {
      return '¡Excelente nutrición! Una dieta balanceada es clave para el bienestar.';
    }
  
    const tips = [];
    if (!this._vegetables){
      tips.push('incluir vegetales');
    }
    if (!this._fruits) {
      tips.push('incluir frutas');
    }
    
    if (tips.length > 0) {
      return `Intenta ${tips.join(' y ')} para mejorar tu nutrición.`;
    }
    return 'Mantén una alimentación balanceada con comidas saludables.';
  }

  toJSON() {
    return {
      ...super.toJSON(),
      meals: this._meals,
      healthyMeals: this._healthyMeals,
      vegetables: this._vegetables,
      fruits: this._fruits,
    };
  }
}
