import express from 'express';
import { getAuth, requireAuth } from '@clerk/express';

import "dotenv/config";
import { addContactToMonitor, createNewMonitor, deleteMonitor, getAllMonitors, getMonitorById, getMonitorsByUserId, updateStatus } from '../services/monitor.service';
import { MonitorProps } from '../models/Monitor';
import { get } from 'http';
import config from '../config';

const router = express.Router();

router.get('/list/all', async (req, res) => {
  const { apiKey } = req.query;

  if (apiKey !== config.herokuApiKey) {
    return res.status(403).end();
  }

  const monitors = await getAllMonitors();

  return res.json(monitors);
});

router.post('/status/change', async (req, res) => {
  const { apiKey, monitorId, status } = req.body;

  if (apiKey !== config.herokuApiKey) {
    return res.status(403).end();
  }

  if (!monitorId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (typeof status !== 'boolean') {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const output = await updateStatus(monitorId, status);

  return res.json(output);
});

router.post('/alert', async (req, res) => {
  const { apiKey, monitorId, statusCode } = req.body;

  if (apiKey !== config.herokuApiKey) {
    return res.status(403).end();
  }

  if (!monitorId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (!statusCode) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // const output = await updateStatus(monitorId, status);

  return res.json({ message: 'Alert sent. we will send the email' });
});

router.use(requireAuth);

router.post('/create', async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(403).end();
    }

    const { monitorUrl, alertCondition, email } = req.body;

    if (!monitorUrl || !alertCondition || !email) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const monitor : MonitorProps = {
      userId,
      monitorUrl,
      alertCondition,
    }

    const monitorDoc = await createNewMonitor(monitor);

    const output =  await addContactToMonitor(monitorDoc.id, email);

    return res.status(200).json(output);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/list', async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(403).end();
  }

  const monitors = await getMonitorsByUserId(userId);

  return res.json(monitors);
});



router.post('/delete', async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(403).end();
  }

  const { monitorId } = req.body;

  if (!monitorId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const monitor = await getMonitorById(monitorId);
  if (!monitor) {
    return res.status(400).json({ message: 'No monitor found' });
  }

  if (monitor.userId !== userId) {
    return res.status(403).end();
  }

  await deleteMonitor(monitorId);

  res.status(200).end();

});

router.get('/private', async (req, res) => {
  const auth = getAuth(req);
  if (!auth.userId) {
    return res.status(403).end();
  } else {
    return res.json(auth);
  }
});

export default router;