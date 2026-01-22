import express from 'express';
import cors from 'cors';
import todosRouter from './routes/todos.ts';
import statsRouter from './routes/stats.ts';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/todos', todosRouter);
app.use('/stats', statsRouter);

export default app;
