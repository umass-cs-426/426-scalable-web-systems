import express from 'express';
import morgan from 'morgan';
import { router } from './routes';

const app = express();
const port = 3000;

export const getApp = () => app;

// Middleware to parse JSON bodies
app.use(express.json());

// Morgan middleware to log HTTP requests
app.use(morgan('dev'));

// Routes
app.use(router);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
