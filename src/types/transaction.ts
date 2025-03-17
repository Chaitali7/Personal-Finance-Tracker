// Predefined categories
export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Housing',
  'Utilities',
  'Shopping',
  'Entertainment',
  'Healthcare',
  'Education',
  'Personal Care',
  'Other'
] as const;

export const INCOME_CATEGORIES = [
  'Salary',
  'Business',
  'Investments',
  'Freelance',
  'Gifts',
  'Other'
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];
export type IncomeCategory = typeof INCOME_CATEGORIES[number];
export type TransactionCategory = ExpenseCategory | IncomeCategory;

export interface Transaction {
  _id: string;
  amount: number;
  description: string;
  date: string;
  type: 'expense' | 'income';
  category: TransactionCategory;
  createdAt?: string;
  updatedAt?: string;
} 