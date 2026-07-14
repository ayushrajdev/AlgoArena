import http from 'k6/http';
import { sleep } from 'k6';
import { Rate } from 'k6/metrics';

export let errorRate = new Rate("error")

export const options = {
    vus: 300,
    duration:"5s",
    // threshold:{
    //   "errors":["rate<0.01"],//error less than 1%
    //   "http_req_duration":["p(95)<500"] // 95% of request should complete within 500ms
    // }
};

export default function () {
    const response = http.get('http://localhost:8080/api/v1/ping');
    const success = response.status ==200
    errorRate.add(!success)
    // sleep(1/100)
}
