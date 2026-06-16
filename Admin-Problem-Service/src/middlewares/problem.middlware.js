import NotFoundError from '../errors/NotFoundError.js';
import Problem from '../models/problem.model.js';

export async function checkProblem(req, res, next) {
    const problemId = req.params.id;
    if (!problemId) {
        throw new NotFoundError('problem id is not sent');
    }
    
    const problem = await Problem.findById(problemId).lean();

    if (Object.keys(problem).length == 0) {
        throw new NotFoundError('problem do not exists');
    }
    next();
}
