import express from 'express';

const router = express.Router();

router.get('/home', async (req, res) => {
  try {
    return res.status(404).json({ error: 'User not found 2' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;