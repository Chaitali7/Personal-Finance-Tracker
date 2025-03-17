import React from 'react';
import { Budget } from '@/types/budget';

interface BudgetListProps {
  budgets: Budget[];
  onEdit?: (budget: Budget) => void;
  onDelete?: (budget: Budget) => void;
}

export default function BudgetList({ budgets, onEdit, onDelete }: BudgetListProps) {
  return (
    <div className="space-y-4">
      {budgets.map((budget) => {
        const percentage = (budget.spent / budget.amount) * 100;
        const isOverBudget = percentage > 100;

        return (
          <div key={budget._id} className="p-4 bg-white rounded-lg shadow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium">{budget.category}</h3>
                <p className="text-sm text-gray-600">{budget.month}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="font-medium">₹{budget.spent.toFixed(2)} / ₹{budget.amount.toFixed(2)}</p>
                  <p className={`text-sm ${isOverBudget ? 'text-red-600' : 'text-gray-600'}`}>
                    {percentage.toFixed(1)}% {isOverBudget ? 'Over Budget!' : 'Used'}
                  </p>
                </div>
                <div className="space-x-2">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(budget)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(budget)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="relative pt-1">
              <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                <div
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                    isOverBudget ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                />
              </div>
            </div>
          </div>
        );
      })}
      {budgets.length === 0 && (
        <p className="text-gray-500 text-center">No budgets set for this month</p>
      )}
    </div>
  );
} 