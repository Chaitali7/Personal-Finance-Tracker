import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Budget from '@/models/Budget';
import Transaction from '@/models/Transaction';
import { startOfMonth, endOfMonth, parseISO } from 'date-fns';

interface UpdateBudgetBody {
  category: string;
  amount: number;
  month: string;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<Response> {
  try {
    const body = await request.json() as UpdateBudgetBody;
    await connectDB();

    // Check if another budget exists for this category and month
    const existingBudget = await Budget.findOne({
      _id: { $ne: params.id },
      category: body.category,
      month: body.month,
    });

    if (existingBudget) {
      return NextResponse.json(
        { error: 'Budget already exists for this category and month' },
        { status: 400 }
      );
    }

    // Calculate spent amount for this category in the given month
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

    const budget = await Budget.findByIdAndUpdate(
      params.id,
      {
        ...body,
        spent: spent[0]?.total || 0,
      },
      { new: true }
    );

    if (!budget) {
      return NextResponse.json(
        { error: 'Budget not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(budget);
  } catch (error) {
    console.error('Failed to update budget:', error);
    return NextResponse.json(
      { error: 'Failed to update budget' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<Response> {
  try {
    await connectDB();
    const budget = await Budget.findByIdAndDelete(params.id);

    if (!budget) {
      return NextResponse.json(
        { error: 'Budget not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    console.error('Failed to delete budget:', error);
    return NextResponse.json(
      { error: 'Failed to delete budget' },
      { status: 500 }
    );
  }
}
