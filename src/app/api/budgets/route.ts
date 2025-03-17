import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Budget from '@/models/Budget';
import Transaction from '@/models/Transaction';
import { format, startOfMonth, endOfMonth, parseISO } from 'date-fns';

export async function GET() {
  try {
    await connectDB();
    const currentMonth = format(new Date(), 'yyyy-MM');
    const budgets = await Budget.find({ month: currentMonth });

    // Update spent amounts for all budgets
    for (const budget of budgets) {
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

      budget.spent = spent[0]?.total || 0;
      await budget.save();
    }

    return NextResponse.json(budgets);
  } catch (error) {
    console.error('Failed to fetch budgets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch budgets' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      category: string;
      amount: number;
      month: string;
    };
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
    return NextResponse.json(
      { error: 'Failed to create budget' },
      { status: 500 }
    );
  }
} 