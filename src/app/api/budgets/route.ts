import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Budget from '@/models/Budget';
import Transaction from '@/models/Transaction';
import { format, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { TransactionCategory } from '@/types/transaction';

interface CreateBudgetBody {
  category: TransactionCategory;
  amount: number;
  month: string;
}

export async function GET() {
  try {
    await connectDB();
    const currentMonth = format(new Date(), 'yyyy-MM');
    const budgets = await Budget.find({ month: currentMonth }).lean();

    // Update spent amounts for all budgets
    const updatedBudgets = await Promise.all(budgets.map(async (budget) => {
      const monthDate = parseISO(budget.month + '-01');
      const start = startOfMonth(monthDate);
      const end = endOfMonth(monthDate);

      const spent = await Transaction.aggregate([
        {
          $match: {
            category: budget.category,
            type: 'expense',
            date: {
              $gte: start,
              $lte: end,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' },
          },
        },
      ]);

      return {
        ...budget,
        spent: spent[0]?.total || 0,
      };
    }));

    return NextResponse.json(updatedBudgets);
  } catch (error) {
    console.error('Failed to fetch budgets:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to fetch budgets' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as CreateBudgetBody;
    
    // Validate required fields
    if (!body.category || !body.amount || !body.month) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate amount
    if (typeof body.amount !== 'number' || body.amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number' },
        { status: 400 }
      );
    }

    // Validate month format
    if (!/^\d{4}-\d{2}$/.test(body.month)) {
      return NextResponse.json(
        { error: 'Month must be in YYYY-MM format' },
        { status: 400 }
      );
    }

    await connectDB();

    const existingBudget = await Budget.findOne({
      category: body.category,
      month: body.month,
    });

    if (existingBudget) {
      return NextResponse.json(
        { error: 'Budget already exists for this category and month' },
        { status: 400 }
      );
    }

    const monthDate = parseISO(body.month + '-01');
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);

    const spent = await Transaction.aggregate([
      {
        $match: {
          category: body.category,
          type: 'expense',
          date: {
            $gte: start,
            $lte: end,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    const budget = await Budget.create({
      ...body,
      spent: spent[0]?.total || 0,
    });

    return NextResponse.json(budget, { status: 201 });
  } catch (error) {
    console.error('Failed to create budget:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create budget' },
      { status: 500 }
    );
  }
} 