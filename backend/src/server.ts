// backend/src/server.ts
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import connectDB from './config/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Async function to initialize the server
async function startServer() {
  try {
    // 1. Connect to the database
    await connectDB();
    console.log('✅ Database connected');

    // 2. Setup middleware
    app.use(cors({origin: true, credentials: true}));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // 3. Setup routes
    app.get('/', (req, res) => {
      res.json({ message: 'Hello from ENCIRCLE backend!' });
    });

    app.use('/api/users', userRoutes);

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({ message: 'Not found' });
    });

    // 4. Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();