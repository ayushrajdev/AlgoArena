import axios from "axios";
import serverConfig from "./server.config";

const problemAdminApi = axios.create({
    baseURL: `${serverConfig.PROBLEM_ADMIN_SERVICE_URL}/api/v1`,
    timeout: 10000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export default problemAdminApi;