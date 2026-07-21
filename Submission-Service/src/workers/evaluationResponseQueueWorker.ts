import { Job, Worker } from 'bullmq';
import serverConfig, {
    Queue_Jobs,
    Server_Queue,
} from '../config/server.config.js';
import EvaluationResponseJob from '../jobs/evaluationResponseQueueJob.js';
import Submission from '../modules/submissions/schemas/submission.schema.js';

async function EvaluationResponseWorker({
    queueName = Server_Queue.EvaluationResponse,
}: { queueName?: string } = {}) {
    new Worker(
        queueName,
        async function (job: Job) {
            if (job.name == Queue_Jobs.EvaluationResponse) {
                console.log(`handling the job `, job.data);

                const { submissionId, userId, problemId, error, data } =
                    job.data;
                console.log(
                    '{ submissionId, userId, problemId, error, data }:',
                    { submissionId, userId, problemId, error, data },
                );

                const res = await fetch(
                    'http://localhost:9000/api/v1/evaluation-response',
                    {
                        body: JSON.stringify({ ...job.data }),
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    },
                );

                if (job.data.error) {
                    await Submission.findByIdAndUpdate(submissionId, {
                        $set: {
                            status: 'error',
                        },
                    });
                } else {
                    await Submission.findByIdAndUpdate(submissionId, {
                        $set: {
                            status: 'success',
                        },
                    });
                }

                const payload = await res.json();

                await EvaluationResponseJob.handle(job);
            }
        },
        {
            connection: {
                host: serverConfig.REDIS_HOST,
                port: serverConfig.REDIS_PORT,
                username: serverConfig.REDIS_USERNAME,
                password: serverConfig.REDIS_PASSWORD,
            },
        },
    );
}

export default EvaluationResponseWorker;
