"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const axios_1 = __importDefault(require("axios"));
// Schedule tasks to be run on the server.
node_cron_1.default.schedule('*/3 * * * *', async () => {
    console.log('Running a task every 3 mins');
    try {
        const response = await axios_1.default.get('https://9c9f1t91-3000.inc1.devtunnels.ms/notification/hit');
        console.log(response.data);
    }
    catch (error) {
        console.error(`Error: ${error}`);
    }
});
node_cron_1.default.schedule('0 0 * * *', () => {
    console.log('Running a task every day at midnight');
    // Add your task logic here
});
console.log('Clock process started');
