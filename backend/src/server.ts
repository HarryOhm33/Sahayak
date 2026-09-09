import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import { recommendRouter } from './routes/recommend.route';

const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'IS Intelligence API', timestamp: new Date().toISOString() });
});

app.use('/api/recommend', recommendRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(config.port, () => {
  console.log(`\nIS Intelligence Backend`);
  console.log(`   Port     : ${config.port}`);
  console.log(`   Expansion: ${config.gemini.expansionModel}`);
  console.log(`   Analysis : ${config.gemini.recommendationModel}`);
  console.log(`   Endpoint : POST http://localhost:${config.port}/api/recommend\n`);
});

export default app;
