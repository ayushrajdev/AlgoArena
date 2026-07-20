import { Job, Worker } from 'bullmq';
import serverConfig, {
    Queue_Jobs,
    Server_Queue,
} from '../config/server.config.js';
import EvaluationResponseJob from '../jobs/evaluationResponseQueueJob.js';

async function EvaluationResponseWorker({
    queueName = Server_Queue.EvaluationResponse,
}: { queueName?: string } = {}) {
    new Worker(
        queueName,
        async function (job: Job) {
            if (job.name == Queue_Jobs.EvaluationResponse) {
                console.log(`handling the job `,job.data);

                const res = await fetch("http://localhost:9000/api/v1/evaluation-response",{
                    body:JSON.stringify({...job.data}),
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    }
                })

                const payload = await res.json()
                console.log(payload);
                


       
                
                await EvaluationResponseJob.handle(job)

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
