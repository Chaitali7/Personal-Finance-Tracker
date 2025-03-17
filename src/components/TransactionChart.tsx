import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Transaction } from '@/types/transaction';

ChartJS.register(ArcElement, Tooltip, Legend);

interface TransactionChartProps {
  transactions: Transaction[];
  type: 'expense' | 'income';
}

export default function TransactionChart({ transactions, type }: TransactionChartProps) {
  const filteredTransactions = transactions.filter(t => t.type === type);
  
  // Group transactions by category and sum amounts
  const categoryTotals = filteredTransactions.reduce((acc, transaction) => {
    const { category, amount } = transaction;
    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {} as Record<string, number>);

  const categories = Object.keys(categoryTotals);
  const amounts = Object.values(categoryTotals);

  const data = {
    labels: categories,
    datasets: [
      {
        data: amounts,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
        ],
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: `${type.charAt(0).toUpperCase() + type.slice(1)} Distribution by Category`,
      },
    },
  };

  return (
    <div className="w-full h-[400px] flex items-center justify-center">
      {amounts.length > 0 ? (
        <Pie data={data} options={options} />
      ) : (
        <p className="text-gray-500">No {type} data available</p>
      )}
    </div>
  );
} 