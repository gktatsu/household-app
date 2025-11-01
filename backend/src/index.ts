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

// CORS設定
const allowedOrigins = [
  'http://localhost:5173',                    // ローカル開発用（Vite）
  'http://localhost:3000',                    // ローカル開発用（別ポート）
  process.env.FRONTEND_URL,                   // 環境変数から取得（推奨）
];

// Vercel URLが環境変数にない場合は、すべてのVercelドメインを許可
if (process.env.FRONTEND_URL) {
  // 本番環境のVercel URLが設定されている場合
  allowedOrigins.push(process.env.FRONTEND_URL);
  // プレビュー環境用（例: https://your-app-git-branch.vercel.app）
  allowedOrigins.push(`${process.env.FRONTEND_URL.replace('https://', 'https://*.')}`);
} else {
  // 環境変数がない場合は一時的にすべて許可（開発段階のみ）
  console.warn('FRONTEND_URL not set, allowing all origins');
}

app.use(cors({
  origin: (origin, callback) => {
    // originがundefined（同一オリジン）または許可リストにある場合
    if (!origin || allowedOrigins.some(allowed => {
      if (allowed && allowed.includes('*')) {
        // ワイルドカードマッチング
        const pattern = allowed.replace(/\*/g, '.*');
        return new RegExp(pattern).test(origin);
      }
      return allowed === origin;
    })) {
      callback(null, true);
    } else {
      console.warn(`Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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