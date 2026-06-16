import Problem from '../models/problem.model.js';
import BaseRepository from './crud.repository.js';

class MongoProblemRepository extends BaseRepository {

    constructor(){
        super(Problem)
    }
    
    async createProblem(problemData) {
        const problem = await Problem.create(problemData);
        return problem;
    }
    async getAllProblems(problemData) {
        const problems = await Problem.find();
        return problems;
    }

    async getProblem(problemId) {
        const problem = await Problem.findById(problemId);
        return problem;
    }
    async deleteProblem(problemId) {
        const problem = await Problem.findByIdAndDelete(problemId);
        return problem;
    }
    async deleteProblem(problemId) {
        const problem = await Problem.findByIdAndDelete(problemId);
        return problem;
    }

    async updateProblem({ problemId, data }) {
        console.log(data);
        const updatedProblem = await Problem.findOneAndUpdate(
            { _id: problemId },
            { $set: data },
            { returnDocument: 'after' }, // Use { new: true } for Mongoose
        );
        return updatedProblem;
    }
}

export default MongoProblemRepository;
