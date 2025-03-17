import { ExpenseCategory } from './transaction';

export interface Budget {
  _id: string;
  category: ExpenseCategory;
  amount: number;
  month: string; // Format: 'YYYY-MM'
  spent: number;
  createdAt?: string;
  updatedAt?: string;
}

export type NewBudget = Omit<Budget, '_id' | 'spent' | 'createdAt' | 'updatedAt'>; 