import express from 'express';
import { getAuth, requireAuth } from '@clerk/express';

import "dotenv/config";

const router = express.Router();

router.use(requireAuth);

router.post('/create', async (req, res) => {
  try {
    const { userId, name, url, interval } = req.body;

    return res.status(404).json({ error: 'creating' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
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