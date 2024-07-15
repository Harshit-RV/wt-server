import express from 'express';
import { clerkClient, resend } from '..';
import { getAuth, requireAuth } from '@clerk/express';

const router = express.Router();

router.get('/ping', async (req, res) => {
  return res.status(200).json({ message: 'Thanks for pingng ' });
});

router.use(requireAuth);

router.post('/feedback', async (req, res) => {
  const { feedback, rating } = req.body;

  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(403).end();
  }

  const user = await clerkClient.users.getUser(userId!);

  const { data, error } = await resend.emails.send({
    from: "TowerLog <onboarding@resend.dev>",
    to: ['harshit.rai.verma@gmail.com'],
    subject: "You got feedback!",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #4CAF50;">New Feedback Received</h2>
        <p>Dear Harshit,</p>
        <p>You have received new feedback from ${user.firstName} ${user.lastName}.</p>
        <p>Here are the details:</p>
        <ul>
          <li><strong>Rating:</strong> ${rating} out of 5</li>
          <li><strong>Feedback:</strong> ${feedback}</li>
          <li><strong>User Email:</strong> <a style="color: #337ab7;">${user.primaryEmailAddress?.emailAddress}</a></li>
        </ul>
  
        <p>${user.firstName} gave this feedback from their <a href="https://towerlog.vercel.app/" style="color: #337ab7;">TowerLog dashboard</a>.</p>
        <p>We appreciate your dedication to providing excellent service. Reviewing this feedback can help you continue to improve.</p>
        <p>If you have any questions or need further assistance, please do not hesitate to contact our support team.</p>
        <p>Best regards,<br/>
        TowerLog Team</p>
        <hr style="border-top: 1px solid #dcdcdc;"/>
        <p style="font-size: 0.9em; color: #888;">You are receiving this email because you subscribed to TowerLog notifications.</p>
      </div>
    `,
  });

  if (error) {
    return res.status(400).json({ error });
  }

  return res.status(200).json({ data });
});

export default router;