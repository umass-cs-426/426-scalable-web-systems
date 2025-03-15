import { Router } from 'express';
import { getUsers, getUserById } from './controllers';

export const router = Router();

router.get('/users', getUsers);
router.get('/users/:id', getUserById);
