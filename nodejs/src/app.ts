import express, { Application } from 'express';
import cors from 'cors';
import wellnessRoutes from './routes/wellness.routes';

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/wellness', wellnessRoutes);

// Health check
app.get('/health', (_, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

export default app;
