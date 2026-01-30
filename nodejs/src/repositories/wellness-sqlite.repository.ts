import Database from 'better-sqlite3';
import { IWellness, ICreateWellnessDTO, IUpdateWellnessDTO } from '../interfaces/wellness.interface';
import { IWellnessRepository } from '../interfaces/repositories/wellness.repository.interface';

export class WellnessSqliteRepository implements IWellnessRepository {
  private db: Database.Database;

  constructor(databasePath: string = ':memory:') {
    this.db = new Database(databasePath);
    this.initializeDatabase();
  }

  private initializeDatabase(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS wellness (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        date TEXT NOT NULL,
        physical_energy INTEGER NOT NULL,
        emotional_state INTEGER NOT NULL,
        notes TEXT NOT NULL,
        habits TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      ) STRICT
    `);
  }

  async findAll(): Promise<IWellness[]> {
    const query = this.db.prepare('SELECT * FROM wellness ORDER BY id DESC');
    const rows = query.all() as any[];
    
    return rows.map(row => this.mapRowToWellness(row));
  }

  async findByUserId(userId: string): Promise<IWellness[]> {
    const query = this.db.prepare('SELECT * FROM wellness WHERE user_id = ? ORDER BY date DESC');
    const rows = query.all(userId) as any[];
    
    return rows.map(row => this.mapRowToWellness(row));
  }

  async findByUserIdAndDate(userId: string, date: string): Promise<IWellness | null> {
    const query = this.db.prepare('SELECT * FROM wellness WHERE user_id = ? AND date = ?');
    const row = query.get(userId, date) as any;
    
    if (!row) return null;
    
    return this.mapRowToWellness(row);
  }

  async findById(id: string): Promise<IWellness | null> {
    const query = this.db.prepare('SELECT * FROM wellness WHERE id = ?');
    const row = query.get(id) as any;
    
    if (!row) return null;
    
    return this.mapRowToWellness(row);
  }

  async create(data: ICreateWellnessDTO): Promise<IWellness> {
    const now = new Date().toISOString();
    const habitsJson = JSON.stringify(data.habits);
    
    const insert = this.db.prepare(
      'INSERT INTO wellness (user_id, date, physical_energy, emotional_state, notes, habits, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );
    
    const result = insert.run(
      data.user_id,
      data.date,
      data.physical_energy,
      data.emotional_state,
      data.notes,
      habitsJson,
      now,
      now
    );
    
    const newWellness: IWellness = {
      id: result.lastInsertRowid.toString(),
      user_id: data.user_id,
      date: data.date,
      physical_energy: data.physical_energy,
      emotional_state: data.emotional_state,
      notes: data.notes,
      habits: data.habits,
      createdAt: new Date(now),
      updatedAt: new Date(now),
    };
    
    return newWellness;
  }

  async update(id: string, data: IUpdateWellnessDTO): Promise<IWellness | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const now = new Date().toISOString();
    const fields: string[] = [];
    const values: any[] = [];

    if (data.user_id !== undefined) {
      fields.push('user_id = ?');
      values.push(data.user_id);
    }
    if (data.date !== undefined) {
      fields.push('date = ?');
      values.push(data.date);
    }
    if (data.physical_energy !== undefined) {
      fields.push('physical_energy = ?');
      values.push(data.physical_energy);
    }
    if (data.emotional_state !== undefined) {
      fields.push('emotional_state = ?');
      values.push(data.emotional_state);
    }
    if (data.notes !== undefined) {
      fields.push('notes = ?');
      values.push(data.notes);
    }
    if (data.habits !== undefined) {
      fields.push('habits = ?');
      values.push(JSON.stringify(data.habits));
    }

    if (fields.length === 0) return existing;

    fields.push('updatedAt = ?');
    values.push(now);
    values.push(id);

    const updateQuery = `UPDATE wellness SET ${fields.join(', ')} WHERE id = ?`;
    const update = this.db.prepare(updateQuery);
    update.run(...values);

    return await this.findById(id);
  }

  private mapRowToWellness(row: any): IWellness {
    return {
      id: row.id.toString(),
      user_id: row.user_id,
      date: row.date,
      physical_energy: row.physical_energy,
      emotional_state: row.emotional_state,
      notes: row.notes,
      habits: JSON.parse(row.habits),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    };
  }

  // Método para cerrar la base de datos si es necesario
  close(): void {
    this.db.close();
  }
}
