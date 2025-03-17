import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TransactionCategory } from '@/models/Transaction';

interface Transaction {
  _id: string;
  amount: number;
  type: 'expense' | 'income';
  category: TransactionCategory;
}

interface CategoryPieChartProps {
  transactions: Transaction[];
  type: 'expense' | 'income';
}

const COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#f59e0b', // amber
  '#84cc16', // lime
  '#22c55e', // green
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#6366f1', // indigo
  '#a855f7', // purple
  '#ec4899', // pink
];

export function CategoryPieChart({ transactions, type }: CategoryPieChartProps) {
  const categoryData = transactions
    .filter(t => t.type === type)
    .reduce((acc: { [key: string]: number }, transaction) => {
      const { category, amount } = transaction;
      acc[category] = (acc[category] || 0) + Math.abs(amount);
      return acc;
    }, {});

  const data = Object.entries(categoryData)
    .map(([category, amount]) => ({
      category,
      amount,
    }))
    .sort((a, b) => b.amount - a.amount);

  if (data.length === 0) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center text-muted-foreground">
        No {type} data available
      </div>
    );
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ category, percent }) => 
              `${category} (${(percent * 100).toFixed(0)}%)`
            }
            labelLine={true}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => `$${value.toFixed(2)}`}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
} 