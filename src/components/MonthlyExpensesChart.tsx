import { format } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Transaction {
  _id: string;
  amount: number;
  date: string;
  type: 'expense' | 'income';
}

interface MonthlyExpensesChartProps {
  transactions: Transaction[];
}

export function MonthlyExpensesChart({ transactions = [] }: MonthlyExpensesChartProps) {
  // Process transactions to get monthly totals
  const monthlyData = (transactions || []).reduce((acc: any[], transaction) => {
    const date = new Date(transaction.date);
    const monthYear = format(date, 'MMM yyyy');
    
    const existingMonth = acc.find(item => item.month === monthYear);
    
    if (existingMonth) {
      if (transaction.type === 'expense') {
        existingMonth.expenses += Math.abs(transaction.amount);
      } else {
        existingMonth.income += transaction.amount;
      }
    } else {
      acc.push({
        month: monthYear,
        expenses: transaction.type === 'expense' ? Math.abs(transaction.amount) : 0,
        income: transaction.type === 'income' ? transaction.amount : 0,
      });
    }
    
    return acc;
  }, []);

  // Sort data by date
  monthlyData.sort((a, b) => {
    return new Date(a.month).getTime() - new Date(b.month).getTime();
  });

  if (monthlyData.length === 0) {
    return (
      <div className="w-full h-[400px] mt-4 flex items-center justify-center text-muted-foreground">
        No transaction data available
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={monthlyData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
          <Bar dataKey="income" fill="#22c55e" name="Income" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 