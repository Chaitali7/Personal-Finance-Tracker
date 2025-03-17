import React from 'react';
import { Transaction } from '@/types/transaction';
import { format } from 'date-fns';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
}

export default function TransactionList({ transactions, onEdit, onDelete }: TransactionListProps) {
  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div
          key={transaction._id}
          className={`p-4 rounded-lg shadow ${
            transaction.type === 'expense' ? 'bg-red-50' : 'bg-green-50'
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{transaction.description}</h3>
              <p className="text-sm text-gray-600">
                {format(new Date(transaction.date), 'MMM d, yyyy')}
              </p>
              <p className="text-sm text-gray-600">{transaction.category}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`font-medium ${
                transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'
              }`}>
                {transaction.type === 'expense' ? '-' : '+'}₹{transaction.amount.toFixed(2)}
              </span>
              <div className="space-x-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(transaction)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(transaction)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 