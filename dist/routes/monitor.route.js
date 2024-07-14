"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_2 = require("@clerk/express");
require("dotenv/config");
const monitor_service_1 = require("../services/monitor.service");
const config_1 = __importDefault(require("../config"));
const router = express_1.default.Router();
router.get('/list/all', async (req, res) => {
    const { apiKey } = req.query;
    if (apiKey !== config_1.default.herokuApiKey) {
        return res.status(403).end();
    }
    const monitors = await (0, monitor_service_1.getAllMonitors)();
    return res.json(monitors);
});
router.post('/status/change', async (req, res) => {
    const { apiKey, monitorId, status } = req.body;
    if (apiKey !== config_1.default.herokuApiKey) {
        return res.status(403).end();
    }
    if (!monitorId) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    if (typeof status !== 'boolean') {
        return res.status(400).json({ message: 'Invalid status' });
    }
    const output = await (0, monitor_service_1.updateStatus)(monitorId, status);
    return res.json(output);
});
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
router.get('/list', async (req, res) => {
    const { userId } = (0, express_2.getAuth)(req);
    if (!userId) {
        return res.status(403).end();
    }
    const monitors = await (0, monitor_service_1.getMonitorsByUserId)(userId);
    return res.json(monitors);
});
router.post('/delete', async (req, res) => {
    const { userId } = (0, express_2.getAuth)(req);
    if (!userId) {
        return res.status(403).end();
    }
    const { monitorId } = req.body;
    if (!monitorId) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    const monitor = await (0, monitor_service_1.getMonitorById)(monitorId);
    if (!monitor) {
        return res.status(400).json({ message: 'No monitor found' });
    }
    if (monitor.userId !== userId) {
        return res.status(403).end();
    }
    await (0, monitor_service_1.deleteMonitor)(monitorId);
    res.status(200).end();
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
