import { WellnessSqliteRepository } from './repositories/wellness-sqlite.repository';
import { WellnessService } from './services/wellness.service';
import { WellnessController } from './controllers/wellness.controller';

// Dependency Injection Container

// Repositories
const databasePath = process.env.DATABASE_PATH || ':memory:';
const wellnessRepository = new WellnessSqliteRepository(databasePath);

// Services
const wellnessService = new WellnessService(wellnessRepository);

// Controllers
export const wellnessController = new WellnessController(wellnessService);
