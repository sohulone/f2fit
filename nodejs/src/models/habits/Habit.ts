export abstract class Habit {
  constructor(
    private _name: string,
    private _completed: boolean,
    private _points: number
  ) {}

  get name(): string {
    return this._name;
  }

  get completed(): boolean {
    return this._completed;
  }

  get points(): number {
    return this._points;
  }

  set completed(value: boolean) {
    this._completed = value;
  }

  abstract calculateImpact(): number;

  abstract getRecommendation(): string;

  toggle(): void {
    this._completed = !this._completed;
  }

  // Serialización para guardar en BD
  toJSON(): { name: string; completed: boolean; points: number } {
    return {
      name: this._name,
      completed: this._completed,
      points: this._points,
    };
  }
}
