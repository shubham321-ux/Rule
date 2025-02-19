import express from 'express';
import { createFavoriteBook, getFavoriteBooks, deleteFavoriteBook } from '../controllers/fevoritebooksController.js';
import { isauthenticatedUser } from '../middleware/auth.js';

const favoriteRouter = express.Router();

favoriteRouter.post('/favorite/new', isauthenticatedUser, createFavoriteBook);
favoriteRouter.get('/favorites/me', isauthenticatedUser, getFavoriteBooks); 
favoriteRouter.delete('/favorite/:id', isauthenticatedUser, deleteFavoriteBook);

export default favoriteRouter;
