import { Router } from 'express';
import ProblemController from '../../controllers/problem.contoller.js';
import { checkProblem } from '../../middlewares/problem.middlware.js';

const router = Router();

const problemContoller = new ProblemController();

router
    .route('/')
    .get(problemContoller.getProblems)
    .post(problemContoller.addProblem);

router
    .route('/:id')
    .get(checkProblem, problemContoller.getProblem)
    .delete(checkProblem, problemContoller.deleteProblem)
    .put(checkProblem, problemContoller.updateProblem);

export default router;
