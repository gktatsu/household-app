import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { supabase } from '../utils/supabase';

export const getCategories = async (req: AuthRequest, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .or(`is_system.eq.true,user_id.eq.${req.userId}`)
      .order('type')
      .order('name');

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};