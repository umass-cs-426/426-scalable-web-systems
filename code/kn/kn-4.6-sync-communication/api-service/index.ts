import 'dotenv/config';
import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

const USER_SERVICE_URL = `http://localhost:${process.env.USER_PORT}`;
const PRODUCT_SERVICE_URL = `http://localhost:${process.env.PRODUCT_PORT}`;

app.get('/summary/:userId', async (req: Request, res: Response) => {
    const userId = req.params.userId;

    try {
        const userRes = await fetch(`${USER_SERVICE_URL}/users/${userId}`);
        const user = await userRes.json();

        const productsRes = await fetch(`${PRODUCT_SERVICE_URL}/products`);
        const products = await productsRes.json();

        res.json({ user, products });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch data from services' });
    }
});

app.post('/add', async (req: Request, res: Response) => {
    const { user, product } = req.body;

    try {
        const userRes = await fetch(`${USER_SERVICE_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        });

        const productRes = await fetch(`${PRODUCT_SERVICE_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product),
        });

        res.status(201).json({
            user: await userRes.json(),
            product: await productRes.json(),
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add data to services' });
    }
});

app.listen(process.env.API_PORT, () => {
    console.log(`API Service listening on port ${process.env.API_PORT}`);
});