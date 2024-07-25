"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_2 = require("@clerk/express");
require("dotenv/config");
const timer_service_1 = require("../services/timer.service");
const router = express_1.default.Router();
router.use(express_2.requireAuth);
router.get('/get', async (req, res) => {
    const timer = await (0, timer_service_1.getTimer)();
    return res.json(timer);
});
exports.default = router;
