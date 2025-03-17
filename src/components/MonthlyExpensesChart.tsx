import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Transaction } from '@/types/transaction';

interface MonthlyExpensesChartProps {
  transactions: Transaction[];
}

interface ChartData {
  date: string;
  amount: number;
}

export default function MonthlyExpensesChart({ transactions }: MonthlyExpensesChartProps) {
  const currentDate = new Date();
  const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);

  // Create an array of all days in the current month
  const daysInMonth = eachDayOfInterval({ start, end });

  // Initialize data with 0 for each day
  const initialData: ChartData[] = daysInMonth.map(date => ({
    date: format(date, 'MMM d'),
    amount: 0
  }));

  // Sum transactions by date
  const data = transactions.reduce((acc, transaction) => {
    if (transaction.type === 'expense') {
      const transactionDate = new Date(transaction.date);
      const dateStr = format(transactionDate, 'MMM d');
      const dayData = acc.find(d => d.date === dateStr);
      if (dayData) {
        dayData.amount += transaction.amount;
      }
    }
    return acc;
  }, initialData);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 