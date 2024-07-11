import express from 'express';

const router = express.Router();

router.get('/create', async (req, res) => {
  try {
    return res.status(404).json({ error: 'creating' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;