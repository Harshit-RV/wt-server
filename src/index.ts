import express, { Application, NextFunction, Request, Response, } from 'express';
import mongoose from 'mongoose';
import homeRoutes from './routes/home.route';
import monitorRoutes from './routes/monitor.route';
import config from './config';
import "dotenv/config"; // To read CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY
import { clerkMiddleware } from '@clerk/express';
import { createClerkClient } from '@clerk/clerk-sdk-node';
import cors from 'cors'; 
import { Resend } from 'resend';

const app: Application = express();
export const resend = new Resend(config.resendApiKey);

// Middleware
app.use(express.json());

app.use(cors());

// Connect to MongoDB
mongoose.connect(config.mongoURI);

export const clerkClient = createClerkClient({ 
  secretKey: config.clerkSecretKey, 
  publishableKey: config.clerkPublishableKey,
});

app.use(clerkMiddleware({ clerkClient }));

// Routes
app.use('/', homeRoutes);
app.use('/monitor', monitorRoutes);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(401).send('Unauthenticated!');
});

// Start the server
app.listen(8080, () => {
  console.log(`Server running on port 8080`);
});