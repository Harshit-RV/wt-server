"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMonitorById = exports.getMonitorsByUserId = exports.createNewMonitor = void 0;
exports.addContactToMonitor = addContactToMonitor;
const Monitor_1 = __importDefault(require("../models/Monitor"));
const createNewMonitor = async (args) => {
    const output = new Monitor_1.default(args);
    return output.save();
};
exports.createNewMonitor = createNewMonitor;
const getMonitorsByUserId = async (id) => {
    return Monitor_1.default.find({ userId: id });
};
exports.getMonitorsByUserId = getMonitorsByUserId;
const getMonitorById = async (id) => {
    return Monitor_1.default.findById(id);
};
exports.getMonitorById = getMonitorById;
async function addContactToMonitor(monitorId, email) {
    try {
        const monitor = await Monitor_1.default.findById(monitorId);
        if (!monitor) {
            throw new Error('Monitor not found');
        }
        const newContact = {
            email,
            priorityOrder: monitor.contacts.length + 1,
        };
        monitor.contacts.push(newContact);
        await monitor.save();
        return monitor;
    }
    catch (error) {
        console.error('Error adding contact to monitor:', error);
        throw error;
    }
}
