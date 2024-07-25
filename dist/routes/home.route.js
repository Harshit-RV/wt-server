"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const __1 = require("..");
const express_2 = require("@clerk/express");
const timer_service_1 = require("../services/timer.service");
const router = express_1.default.Router();
router.get('/ping', async (req, res) => {
    await (0, timer_service_1.updateTimer)();
    return res.status(200).json({ message: 'Thanks for pingng ' });
});
router.use(express_2.requireAuth);
router.post('/feedback', async (req, res) => {
    const { feedback, rating } = req.body;
    const { userId } = (0, express_2.getAuth)(req);
    if (!userId) {
        return res.status(403).end();
    }
    const user = await __1.clerkClient.users.getUser(userId);
    const { data, error } = await __1.resend.emails.send({
        from: "System <vigil@plutofy.live>",
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
  
        <p>${user.firstName} gave this feedback from their <a href="https://towerlog.vercel.app/" style="color: #337ab7;">Vigil dashboard</a>.</p>
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
exports.default = router;
