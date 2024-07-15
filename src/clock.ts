import cron from 'node-cron';
import axios from 'axios';
import { AlertCondition, MonitorDoc } from './models/Monitor';
import config from './config';

const BASE_URL = 'https://wt-server.onrender.com';

const getURLs = async () : Promise<MonitorDoc[] | null> => {
  try {
    const output = await axios.get(`${BASE_URL}/monitor/list/all?apiKey=${config.herokuApiKey}`);
    return output.data as MonitorDoc[];
  } catch (e) {
    console.log(e);
    return null;
  }
}

const changeStatus = async ( monitor: MonitorDoc, status: Boolean ) : Promise<void> => {
  try {
    if (monitor.status === status) return;

    await axios.post(`${BASE_URL}/monitor/status/change`, {
      apiKey: config.herokuApiKey,
      monitorId: monitor._id,
      status: status
     });
  } catch (e) {
    console.log(e);
  }
}

const pingBackend = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/ping`);
    console.log(response.data);
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

async function getStatusCode(endpoint: string): Promise<number> {
  try {
    const response = await axios.get(endpoint);
    return response.status;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.status;
    } else {
      // Return a custom status code for non-HTTP errors, e.g., 0
      return 0;
    }
  }
}

const alertMonitor = async (monitor: MonitorDoc, alertCondition: AlertCondition) => {
  try {
    const res = await axios.post(`${BASE_URL}/monitor/alert`, {
      apiKey: config.herokuApiKey,
      monitorId: monitor._id,
      alertCondition: alertCondition
     });
     console.log({data: res.data});
  } catch (e) {
    console.log(e);
  }
}

const sendNotification = async (monitor: MonitorDoc, statusCode: number, alertCondition: AlertCondition) => {
  if (monitor.status === false) return;
  await changeStatus(monitor, false);
  console.log(`Sending notification for ${monitor.monitorUrl} with status code ${statusCode}`);
  await alertMonitor(monitor, alertCondition);
}


const main = async () => {
  const startingTime = new Date();
  const data = await getURLs();

  data?.map(async (monitor) => {
    const statusCode = await getStatusCode(monitor.monitorUrl);

    if ( monitor.alertCondition == 'ISNOT200' && statusCode !== 200) {
      await sendNotification(monitor, statusCode, 'ISNOT200');
    } else if ( monitor.alertCondition == 'IS500' && statusCode == 500) {
      await sendNotification(monitor, statusCode, 'IS500');
    } else if ( monitor.alertCondition == 'IS404' && statusCode == 404) {
      await sendNotification(monitor, statusCode, 'IS404');
    } else if ( monitor.alertCondition == 'IS501' && statusCode == 501) {
      await sendNotification(monitor, statusCode, 'IS501');
    } else if ( monitor.alertCondition == 'ISUNAVAILABLE' && ( statusCode == 503 || statusCode == 504 || statusCode == 502)) {
      await sendNotification(monitor, statusCode, 'ISUNAVAILABLE');
    } else {
      await changeStatus(monitor, true);
    }
  });

  await pingBackend();
  const endingTime = new Date();
  console.log(`Time taken: ${endingTime.getTime() - startingTime.getTime()} ms`);
}

cron.schedule('*/30 * * * * *', async () => {
  console.log('Running a task every 30 seconds');
  main();
});

// Schedule tasks to be run on the server.

// cron.schedule('*/3 * * * *', async () => {
//   console.log('Running a task every 3 mins');
//   try {
//     const response = await axios.get('https://9c9f1t91-3000.inc1.devtunnels.ms/notification/hit');
//     console.log(response.data);
//   } catch (error) {
//     console.error(`Error: ${error}`);
//   }

//   main();
// });

console.log('Clock process started');