import { Habit } from './Habit';
import { ExerciseHabit } from './ExerciseHabit';
import { HydrationHabit } from './HydrationHabit';
import { SleepHabit } from './SleepHabit';
import { NutritionHabit } from './NutritionHabit';

export class HabitFactory {
  static createHabit(type: string, completed: boolean, data?: any): Habit {
    switch (type.toLowerCase()) {
      case 'exercise':
        return new ExerciseHabit(
          completed,
          data?.duration,
          data?.intensity
        );
      case 'hydration':
        return new HydrationHabit(
          completed,
          data?.glassesOfWater,
          data?.targetGlasses
        );
      case 'sleep':
        return new SleepHabit(
          completed,
          data?.hours,
          data?.quality
        );
      case 'nutrition':
        return new NutritionHabit(
          completed,
          data?.meals,
          data?.healthyMeals,
          data?.vegetables,
          data?.fruits
        );
      default:
        throw new Error(`Unknown habit type: ${type}`);
    }
  }

  static createFromJSON(habitData: any): Habit {
    return this.createHabit(habitData.name, habitData.completed, habitData);
  }
}
