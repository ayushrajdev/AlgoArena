import { StatusCodes } from 'http-status-codes';
import InternalServerError from '../errors/InternalServerError.js';
import MongoProblemRepository from '../repositories/problem.repository.js';
import MongoProblemService from '../services/problem.service.js';
import { successResponse } from '../utils/response.js';

class ProblemController {
    constructor() {
        const problemRepository = new MongoProblemRepository();
        const problemService = new MongoProblemService(problemRepository);

        this.problemService = problemService;
    }

    addProblem = async (req, res, next) => {
        try {
            const problem = await this.problemService.createProblem(req.body);
            return successResponse(res, {
                statusCode: StatusCodes.OK,
                message: 'problem successfully created',
                data: problem,
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    };

    getProblems = async (req, res, next) => {
        try {
            const problems = await this.problemService.getAllProblems();
            return successResponse(res, {
                data: problems,
                statusCode: StatusCodes.OK,
                message: 'List of all Problems',
            });
        } catch (error) {
            next(error);
            console.log(error);
        }
    };

    getProblem = async (req, res, next) => {
        try {
            console.log(req.params.id);
            const problem = await this.problemService.getProblem(req.params.id);
            return successResponse(res, {
                data: problem,
                statusCode: StatusCodes.OK,
            });
        } catch (error) {
            next(error);
            console.log(error);
        }
    };

    deleteProblem = async (req, res, next) => {
        try {
            const deletedProblem = await this.problemService.deleteProblem(
                req.params.id,
            );
            return successResponse(res, {
                data: deletedProblem,
                statusCode: StatusCodes.OK,
            });
        } catch (error) {
            next(error);
        }
    };

    updateProblem = async (req, res, next) => {
        try {
            console.log(req.body);
            const updatedProblem = await this.problemService.updateProblem({
                data: req.body,
                problemId: req.params.id,
            });
            return successResponse(res, {
                data: updatedProblem,
                statusCode: StatusCodes.OK, 
            });
        } catch (error) {
            next(error);
        }
    };
}

export default ProblemController;
