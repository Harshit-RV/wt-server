import express from 'express';

const router = express.Router();

router.get('/ping', async (req, res) => {
  return res.status(200).json({ message: 'Thanks for pingng ' });
});

export default router;