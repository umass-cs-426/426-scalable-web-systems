import 'dotenv/config';
import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

type Product = { id: string; name: string };
const products: Product[] = [];

app.get('/products', (_req: Request, res: Response) => {
    res.json(products);
});

app.post('/products', (req: Request, res: Response) => {
    const product: Product = req.body;
    products.push(product);
    res.status(201).json(product);
});

app.listen(process.env.PRODUCT_PORT, () => {
    console.log(`Product Service listening on port ${process.env.PRODUCT_PORT}`);
});