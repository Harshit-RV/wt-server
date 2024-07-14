import cron from 'node-cron';
import axios from 'axios';

// Schedule tasks to be run on the server.
cron.schedule('*/3 * * * *', async () => {
  console.log('Running a task every 3 mins');
  try {
    const response = await axios.get('https://9c9f1t91-3000.inc1.devtunnels.ms/notification/hit');
    console.log(response.data);
  } catch (error) {
    console.error(`Error: ${error}`);
  }
});

cron.schedule('0 0 * * *', () => {
  console.log('Running a task every day at midnight');
  // Add your task logic here
});

console.log('Clock process started');