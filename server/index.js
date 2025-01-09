import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './mongodb/connect.js';
import postRoutes from './routes/postRoutes.js';
import dalleRoutes from './routes/dalleRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Adding in the post routes and dalle routes
app.use('/api/v1/post', postRoutes);
app.use('/api/v1/dalle', dalleRoutes);

// Rout to verify application is functional
app.get('/', async (req, res) => {
  res.send('Hello From Wall-E');
})

// Start the server
const startServer = async () => {
    try {
        // Connect to the MongoDB database
        connectDB(process.env.MONGODB_URL);
        app.listen(8080, () => 
            console.log('Server has started on port http://localhost:8080'))
    } catch (error) {
        console.log(error);
    }
}

startServer();