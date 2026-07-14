import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: 'ramping-vus',
      startVUs: 50,
      stages: [
        { duration: '10s', target: 100 },
        { duration: '10s', target: 50 },
      ],
      gracefulRampDown: '0s',
    },

  },
};

export default function () {
  http.get('https://test.k6.io/contacts.php');
  // Injecting sleep
  // Sleep time is 500ms. Total iteration time is sleep + time to finish request.
  sleep(0.5);
}