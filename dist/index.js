"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clerkClient = exports.resend = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const home_route_1 = __importDefault(require("./routes/home.route"));
const monitor_route_1 = __importDefault(require("./routes/monitor.route"));
const timer_route_1 = __importDefault(require("./routes/timer.route"));
const clock_route_1 = __importDefault(require("./routes/clock.route"));
const config_1 = __importDefault(require("./config"));
require("dotenv/config"); // To read CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY
const express_2 = require("@clerk/express");
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
const cors_1 = __importDefault(require("cors"));
const resend_1 = require("resend");
const app = (0, express_1.default)();
exports.resend = new resend_1.Resend(config_1.default.resendApiKey);
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Connect to MongoDB
mongoose_1.default.connect(config_1.default.mongoURI);
exports.clerkClient = (0, clerk_sdk_node_1.createClerkClient)({
    secretKey: config_1.default.clerkSecretKey,
    publishableKey: config_1.default.clerkPublishableKey,
});
app.use('/clock', clock_route_1.default);
app.use((0, express_2.clerkMiddleware)({ clerkClient: exports.clerkClient }));
// Routes
app.use('/', home_route_1.default);
app.use('/monitor', monitor_route_1.default);
app.use('/timer', timer_route_1.default);
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(401).send('Unauthenticated!');
});
// Start the server
app.listen(8080, () => {
    console.log(`Server running on port 8080`);
});
