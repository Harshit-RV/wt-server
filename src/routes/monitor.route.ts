import express from 'express';
import { getAuth, requireAuth } from '@clerk/express';

import "dotenv/config";
import { addContactToMonitor, createNewMonitor } from '../services/monitor.service';
import { MonitorProps } from '../models/Monitor';

const router = express.Router();

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

router.get('/private', async (req, res) => {
  const auth = getAuth(req);
  if (!auth.userId) {
    return res.status(403).end();
  } else {
    return res.json(auth);
  }
});

export default router;