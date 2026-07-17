import axios from 'axios';
import problemAdminApi from '../config/axios.config';

async function fetchProblem(problemId:string) {
        return (await problemAdminApi.get(`/problems/${problemId}`)).data?.data;
}

const ProblemAdminServiceApi = {
    fetchProblem
}

export default ProblemAdminServiceApi
