import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import aiRouter from './routes/aiRouter.js';

const app = express();
const port = process.env.PORT || 4000; 

app.use(cors());
app.use(express.json());


app.use(clerkMiddleware({
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY
}));

app.get('/', (req, res) => {
  res.send('Server is working!');
});

app.use('/api/ai', requireAuth(), aiRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log('Type:', typeof process.env.PORT);  
});

export default app;