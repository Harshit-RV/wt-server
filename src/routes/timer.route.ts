import express from 'express';
import { getAuth, requireAuth } from '@clerk/express';
import "dotenv/config";
import { getTimer } from '../services/timer.service';

const router = express.Router();

router.use(requireAuth);

router.get('/get', async (req, res) => {
  const timer = await getTimer();

  return res.json(timer);
});


export default router;
