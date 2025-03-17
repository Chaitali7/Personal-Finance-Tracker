import mongoose from 'mongoose';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, ExpenseCategory, IncomeCategory } from '@/types/transaction';

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now,
  },
  type: {
    type: String,
    enum: ['expense', 'income'],
    required: [true, 'Transaction type is required'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    validate: {
      validator: function(this: { type: 'expense' | 'income' }, v: string) {
        if (this.type === 'expense') {
          return EXPENSE_CATEGORIES.includes(v as ExpenseCategory);
        } else {
          return INCOME_CATEGORIES.includes(v as IncomeCategory);
        }
      },
      message: 'Invalid category for transaction type'
    }
  }
}, {
  timestamps: true,
});

const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);

export default Transaction; 