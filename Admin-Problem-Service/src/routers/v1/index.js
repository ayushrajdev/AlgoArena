import { Router } from 'express';
import problemRouter from './problem.route.js';

const v1Router = Router();

v1Router.use('/problems', problemRouter);

export default v1Router;
