"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/home', async (req, res) => {
    try {
        return res.status(404).json({ error: 'User not found 2' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.default = router;
