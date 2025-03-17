import mongoose from 'mongoose';
import { EXPENSE_CATEGORIES } from '@/types/transaction';

const budgetSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: EXPENSE_CATEGORIES,
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be positive'],
  },
  month: {
    type: String,
    required: [true, 'Month is required'],
    validate: {
      validator: function(v: string) {
        return /^\d{4}-(?:0[1-9]|1[0-2])$/.test(v);
      },
      message: 'Month must be in YYYY-MM format'
    }
  },
  spent: {
    type: Number,
    default: 0,
    min: [0, 'Spent amount must be positive'],
  }
}, {
  timestamps: true,
});

// Add a compound index on category and month to ensure uniqueness
budgetSchema.index({ category: 1, month: 1 }, { unique: true });

const Budget = mongoose.models.Budget || mongoose.model('Budget', budgetSchema);

export default Budget; 