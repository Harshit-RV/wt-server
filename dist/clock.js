"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("./config"));
const BASE_URL = 'https://wt-server.onrender.com';
const getURLs = async () => {
    try {
        const output = await axios_1.default.get(`${BASE_URL}/clock/list/all?apiKey=${config_1.default.herokuApiKey}`);
        return output.data;
    }
    catch (e) {
        if (axios_1.default.isAxiosError(e) && e.response) {
            console.log('Could not get URLs because: ', e.response.status);
        }
        return null;
    }
};
const changeStatus = async (monitor, status) => {
    try {
        if (monitor.status === status)
            return;
        await axios_1.default.post(`${BASE_URL}/clock/status/change`, {
            apiKey: config_1.default.herokuApiKey,
            monitorId: monitor._id,
            status: status
        });
    }
    catch (e) {
        if (axios_1.default.isAxiosError(e) && e.response) {
            console.log('Could not update status because: ', e.response.status);
        }
    }
};
const pingBackend = async () => {
    try {
        const response = await axios_1.default.get(`${BASE_URL}/ping`);
        console.log(response.data);
    }
    catch (e) {
        if (axios_1.default.isAxiosError(e) && e.response) {
            console.log('Could not ping backend because: ', e.response.status);
        }
    }
};
async function getStatusCode(endpoint) {
    try {
        const response = await axios_1.default.get(endpoint);
        return response.status;
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error) && error.response) {
            return error.response.status;
        }
        else {
            // Return a custom status code for non-HTTP errors, e.g., 0
            return 0;
        }
    }
}
const alertMonitor = async (monitor, alertCondition) => {
    try {
        const res = await axios_1.default.post(`${BASE_URL}/clock/alert`, {
            apiKey: config_1.default.herokuApiKey,
            monitorId: monitor._id,
            alertCondition: alertCondition
        });
        console.log({ data: res.data });
    }
    catch (e) {
        if (axios_1.default.isAxiosError(e) && e.response) {
            console.log('Could not alert because: ', e.response.status);
        }
    }
};
const sendNotification = async (monitor, statusCode, alertCondition) => {
    if (monitor.status === false)
        return;
    await changeStatus(monitor, false);
    console.log(`Sending notification for ${monitor.monitorUrl} with status code ${statusCode}`);
    await alertMonitor(monitor, alertCondition);
};
const main = async () => {
    const startingTime = new Date();
    const data = await getURLs();
    data?.map(async (monitor) => {
        const statusCode = await getStatusCode(monitor.monitorUrl);
        if (monitor.alertCondition == 'ISNOT200' && statusCode !== 200) {
            await sendNotification(monitor, statusCode, 'ISNOT200');
        }
        else if (monitor.alertCondition == 'IS500' && statusCode == 500) {
            await sendNotification(monitor, statusCode, 'IS500');
        }
        else if (monitor.alertCondition == 'IS404' && statusCode == 404) {
            await sendNotification(monitor, statusCode, 'IS404');
        }
        else if (monitor.alertCondition == 'IS501' && statusCode == 501) {
            await sendNotification(monitor, statusCode, 'IS501');
        }
        else if (monitor.alertCondition == 'ISUNAVAILABLE' && (statusCode == 503 || statusCode == 504 || statusCode == 502)) {
            await sendNotification(monitor, statusCode, 'ISUNAVAILABLE');
        }
        else {
            await changeStatus(monitor, true);
        }
    });
    await pingBackend();
    const endingTime = new Date();
    console.log(`Time taken: ${endingTime.getTime() - startingTime.getTime()} ms`);
};
node_cron_1.default.schedule('*/3 * * * *', async () => {
    console.log('Running a task every 3 mins');
    main();
});
console.log('Clock process started');
