import express from 'express';
import { getAuth, requireAuth } from '@clerk/express';

import "dotenv/config";
import { addContactToMonitor, createNewMonitor, deleteMonitor, getAllMonitors, getMonitorById, getMonitorsByUserId, updateStatus } from '../services/monitor.service';
import { MonitorProps } from '../models/Monitor';
import { get } from 'http';
import config from '../config';
import { clerkClient, resend } from '..';
import { statusString } from '../utils/statusString';

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
  const { apiKey, monitorId, alertCondition } = req.body;

  if (apiKey !== config.herokuApiKey) {
    return res.status(403).end();
  }

  if (!monitorId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (!alertCondition || !['IS500', 'ISUNAVAILABLE', 'IS404', 'IS501', 'ISNOT200'].includes(alertCondition)) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const monitor = await getMonitorById(monitorId);

  const response = await clerkClient.users.getUser(monitor?.userId!);

  const { data, error } = await resend.emails.send({
    from: "TowerLog <onboarding@resend.dev>",
    to: [monitor?.contacts[0].email!],
    subject: "Urgent: Your Website is Down!",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #d9534f;">Alert: Your Website is Down</h2>
        <p>Dear ${response.firstName},</p>
        <p>We wanted to let you know that your website <a href="${monitor?.monitorUrl}" style="color: #337ab7;">${monitor?.monitorUrl}</a> is currently experiencing downtime. Our monitoring system detected the issue on <strong>${new Date().toLocaleString()}</strong>.</p>
        <p>Here are the details:</p>
        <ul>
          <li><strong>URL:</strong> <a href="${monitor?.monitorUrl}" style="color: #337ab7;">${monitor?.monitorUrl}</a></li>
          <li><strong>Status:</strong> ${statusString(alertCondition)}</li>
          <li><strong>Detected At:</strong> ${new Date().toLocaleString()}</li>
        </ul>

        <p>Check more details at <a href="https://towerlog.vercel.app/" style="color: #337ab7;"> TowerLog dashboard</a>.</p>
        <p>We recommend you to check your server and resolve the issue as soon as possible to minimize the impact on your users.</p>
        <p>If you need further assistance, please do not hesitate to contact our support team.</p>
        <p>Best regards,<br/>
        TowerLog Team</p>
        <hr style="border-top: 1px solid #dcdcdc;"/>
        <p style="font-size: 0.9em; color: #888;">You are receiving this email because you subscribed to TowerLog alerts.</p>
      </div>
    `,
  });

  if (error) {
    return res.status(400).json({ error });
  }

  return res.status(200).json({ data });
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
