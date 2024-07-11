import express, { Application } from 'express';
import mongoose from 'mongoose';
import homeRoutes from './routes/home.route';
import monitorRoutes from './routes/monitor.route';
import config from './config';

const app: Application = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(config.mongoURI);

// Routes
app.use('/', homeRoutes);
app.use('/monitor', monitorRoutes);

// Start the server
app.listen(8080, () => {
  console.log(`Server running on port 8080`);
});