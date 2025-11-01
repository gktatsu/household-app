import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authenticateUser } from './middleware/auth';
import * as transactionsController from './controllers/transactions';
import * as categoriesController from './controllers/categories';
import * as exchangeRatesController from './controllers/exchangeRates';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/transactions', authenticateUser, transactionsController.getTransactions);
app.post('/api/transactions', authenticateUser, transactionsController.createTransaction);
app.put('/api/transactions/:id', authenticateUser, transactionsController.updateTransaction);
app.delete('/api/transactions/:id', authenticateUser, transactionsController.deleteTransaction);

app.get('/api/categories', authenticateUser, categoriesController.getCategories);
app.get('/api/exchange-rates', exchangeRatesController.getExchangeRatesController);

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;