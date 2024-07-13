"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_2 = require("@clerk/express");
require("dotenv/config");
const monitor_service_1 = require("../services/monitor.service");
const router = express_1.default.Router();
router.use(express_2.requireAuth);
router.post('/create', async (req, res) => {
    try {
        const { userId } = (0, express_2.getAuth)(req);
        if (!userId) {
            return res.status(403).end();
        }
        const { monitorUrl, alertCondition, email } = req.body;
        if (!monitorUrl || !alertCondition || !email) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const monitor = {
            userId,
            monitorUrl,
            alertCondition,
        };
        const monitorDoc = await (0, monitor_service_1.createNewMonitor)(monitor);
        const output = await (0, monitor_service_1.addContactToMonitor)(monitorDoc.id, email);
        return res.status(200).json(output);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
router.get('/private', async (req, res) => {
    const auth = (0, express_2.getAuth)(req);
    if (!auth.userId) {
        return res.status(403).end();
    }
    else {
        return res.json(auth);
    }
});
exports.default = router;
