// const serverConfig = {
//     PORT: Number(process.env.PORT) || 8080,
//     REDIS_HOST: process.env.REDIS_HOST,
//     REDIS_PORT: Number(process.env.REDIS_PORT),
//     REDIS_USERNAME: process.env.REDIS_USERNAME,
//     REDIS_PASSWORD: process.env.REDIS_PASSWORD,
//     PROBLEM_ADMIN_SERVICE_URL: process.env.PROBLEM_ADMIN_SERVICE_URL,
//     MY_SERVICE_NAME: process.env.MY_SERVICE_NAME,
//     HOST: process.env.HOST,
// };

const serverConfigOptions = {
    production: {
        PORT: Number(process.env.PORT) || 8080,
        REDIS_HOST: process.env.REDIS_HOST,
        REDIS_PORT: Number(process.env.REDIS_PORT),
        REDIS_USERNAME: process.env.REDIS_USERNAME,
        REDIS_PASSWORD: process.env.REDIS_PASSWORD,
        PROBLEM_ADMIN_SERVICE_URL: process.env.PROBLEM_ADMIN_SERVICE_URL,
        MY_SERVICE_NAME: process.env.MY_SERVICE_NAME,
        HOST: process.env.HOST,
    },
    development: {
        PORT: Number(process.env.PORT) || 8080,
        REDIS_HOST: 'localhost',
        REDIS_PORT: 6379,
        REDIS_USERNAME: 'default',
        REDIS_PASSWORD: '',
        PROBLEM_ADMIN_SERVICE_URL: process.env.PROBLEM_ADMIN_SERVICE_URL,
        MY_SERVICE_NAME: process.env.MY_SERVICE_NAME,
        HOST: process.env.HOST,
    },
};

// const serverConfig = {
//     PORT: Number(process.env.PORT) || 8080,
//     REDIS_HOST: process.env.REDIS_HOST,
//     REDIS_PORT: Number(process.env.REDIS_PORT),
//     REDIS_USERNAME: process.env.REDIS_USERNAME,
//     REDIS_PASSWORD: process.env.REDIS_PASSWORD,
// };

const serverConfig = serverConfigOptions['development'];

export enum Server_Queue {
    Submission = 'SubmissionQueue',
    Sample = 'SampleQueue',
    EvaluationResponse = 'EvaluationResponseQueue',
}
export enum Queue_Jobs {
    Submission = 'SubmissionJob',
    Sample = 'SampleJob',
    EvaluationResponse = 'EvaluationResponseJob',
}

export default serverConfig;
