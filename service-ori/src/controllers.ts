import { Request, Response } from 'express';
import { findUserById, findAllUsers } from './db';

export const getUsers = (req: Request, res: Response) => {
    res.status(200).json(findAllUsers());
};

export const getUserById = (req: Request, res: Response) => {
    const user = findUserById(parseInt(req.params.id));
    findUserById(parseInt(req.params.id)) 
      ? res.status(200).json(user) 
      : res.status(404).send('User not found');
};
