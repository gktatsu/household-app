import { Request, Response } from 'express';
import { getExchangeRates } from '../services/exchangeRate';

export const getExchangeRatesController = async (req: Request, res: Response) => {
  try {
    const rates = await getExchangeRates();
    
    res.json({
      base: 'USD',
      rates,
      date: new Date().toISOString().split('T')[0],
    });
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    res.status(500).json({ error: 'Failed to fetch exchange rates' });
  }
};