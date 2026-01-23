import express from 'express';
import cors from 'cors';
import { errorMiddleware } from './middleware/error.middleware.js';

import routes from './routes/index.js';

export const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.use(errorMiddleware);
