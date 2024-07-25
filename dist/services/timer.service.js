"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimer = exports.updateTimer = exports.createTimer = void 0;
const Timer_1 = __importDefault(require("../models/Timer"));
const createTimer = async () => {
    const output = new Timer_1.default({ lastCheck: Date.now() });
    return output.save();
};
exports.createTimer = createTimer;
const updateTimer = async () => {
    const currentTime = Date.now();
    let output = await Timer_1.default.findOneAndUpdate({}, { lastCheck: currentTime }, { new: true }).exec();
    if (!output) {
        output = await (0, exports.createTimer)();
    }
    return output;
};
exports.updateTimer = updateTimer;
const getTimer = async () => {
    const output = await Timer_1.default.findOne().exec();
    if (!output) {
        return (0, exports.createTimer)();
    }
    return output;
};
exports.getTimer = getTimer;
