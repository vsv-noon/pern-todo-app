// import dotenv from "dotenv";
import app from './app.ts';
import cron from 'node-cron';
import { cleanupDeletedTodos } from './cron/cleanupDeletedTodos.ts';
import { saveDailyMetrics } from './cron/saveDailyMetrics.ts';
// dotenv.config();

const PORT = process.env.PORT || 5000;

cron.schedule('0 3 * * *', cleanupDeletedTodos);
cron.schedule('5 0 * * *', saveDailyMetrics);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
