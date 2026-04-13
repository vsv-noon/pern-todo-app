import cron from 'node-cron';

import { seedMeasurementTypes } from '../seeds/measurementTypes.seed.js';

import { app } from './app.js';
import { ENV } from './config/env.js';
import { testDbConnection } from './config/db.js';
import { cleanupDeletedTodos } from './cron/cleanupDeletedTodos.js';
import { saveDailyMetrics } from './cron/saveDailyMetrics.js';
import { cleanupExpiresTokens } from './cron/cleanupExpiresTokens.js';
// import dotenv from "dotenv";
// dotenv.config();

// const port = process.env.PORT || 5000;

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

await seedMeasurementTypes();

cron.schedule('0 3 * * *', cleanupDeletedTodos);
cron.schedule('5 3 * * *', cleanupExpiresTokens);
cron.schedule('5 0 * * *', saveDailyMetrics);
// cron.schedule('52 3 * * *', saveDailyMetrics);

async function bootstrap() {
  try {
    await testDbConnection();
    console.log(`Database connected: ${ENV.DATABASE_URL}`);

    app.listen(ENV.PORT, () => {
      console.log(`Server listening on port ${ENV.PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

bootstrap();
