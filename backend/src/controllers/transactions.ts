import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { supabase } from '../utils/supabase';
import { Transaction } from '../types';

export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const { startDate, endDate, type, category, currency } = req.query;
    
    let query = supabase
      .from('transactions')
      .select('*, categories(*)')
      .eq('user_id', req.userId!)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });

    if (startDate) query = query.gte('date', startDate as string);
    if (endDate) query = query.lte('date', endDate as string);
    if (type) query = query.eq('type', type as string);
    if (category) query = query.eq('category_id', category as string);
    if (currency) query = query.eq('currency', currency as string);

    const { data, error } = await query;

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

export const createTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { type, amount, currency, category_id, description, date } = req.body;

    // バリデーション
    if (!type || !amount || !currency || !category_id || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be positive' });
    }

    if (amount > 999999999) {
      return res.status(400).json({ error: 'Amount too large' });
    }

    if (description && description.length > 100) {
      return res.status(400).json({ error: 'Description too long' });
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: req.userId!,
        type,
        amount,
        currency,
        category_id,
        description,
        date,
      })
      .select('*, categories(*)')
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
};

export const updateTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { type, amount, currency, category_id, description, date } = req.body;

    // バリデーション
    if (amount !== undefined && amount <= 0) {
      return res.status(400).json({ error: 'Amount must be positive' });
    }

    const { data, error } = await supabase
      .from('transactions')
      .update({
        type,
        amount,
        currency,
        category_id,
        description,
        date,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', req.userId!)
      .select('*, categories(*)')
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
};

export const deleteTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', req.userId!);

    if (error) throw error;

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
};