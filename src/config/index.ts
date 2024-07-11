import { configDotenv } from 'dotenv';
configDotenv()

export default {
    mongoURI: process.env.MONGO_URI || ''
};