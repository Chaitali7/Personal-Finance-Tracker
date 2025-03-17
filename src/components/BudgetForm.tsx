import React, { useState } from 'react';
import { EXPENSE_CATEGORIES } from '@/types/transaction';
import { Budget, NewBudget } from '@/types/budget';
import { format } from 'date-fns';

interface BudgetFormProps {
  onSubmit: (budget: NewBudget) => void;
  initialData?: Budget;
  onCancel?: () => void;
}

export default function BudgetForm({ onSubmit, initialData, onCancel }: BudgetFormProps) {
  const [formData, setFormData] = useState({
    category: initialData?.category || EXPENSE_CATEGORIES[0],
    amount: initialData?.amount?.toString() || '',
    month: initialData?.month || format(new Date(), 'yyyy-MM'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = {
      category: formData.category,
      amount: parseFloat(formData.amount),
      month: formData.month,
    };
    onSubmit(submissionData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          {EXPENSE_CATEGORIES.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Budget Amount (₹)</label>
        <input
          type="number"
          id="amount"
          name="amount"
          step="0.01"
          required
          value={formData.amount}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="month" className="block text-sm font-medium text-gray-700">Month</label>
        <input
          type="month"
          id="month"
          name="month"
          required
          value={formData.month}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {initialData ? 'Update' : 'Add'} Budget
        </button>
      </div>
    </form>
  );
} 