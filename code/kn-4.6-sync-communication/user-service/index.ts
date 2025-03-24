import 'dotenv/config';
import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

type User = { id: string; name: string };
const users: User[] = [];

app.get('/users/:id', (req: Request, res: Response) => {
    const user = users.find(u => u.id === req.params.id);
    if (!user) res.status(404).json({ error: 'User not found' });
    else res.json(user);
});

app.post('/users', (req: Request, res: Response) => {
    const user: User = req.body;
    users.push(user);
    res.status(201).json(user);
});

app.listen(process.env.USER_PORT, () => {
    console.log(`User Service listening on port ${process.env.USER_PORT}`);
});