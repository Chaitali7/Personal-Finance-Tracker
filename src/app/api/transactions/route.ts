import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Transaction from '@/models/Transaction';
import { TransactionCategory } from '@/types/transaction';

export async function GET() {
  try {
    await connectDB();
    const transactions = await Transaction.find().sort({ date: -1 }).lean();
    return NextResponse.json(transactions || []);
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    // Return an empty array instead of an error object
    return NextResponse.json([]);
  }
}

interface CreateTransactionBody {
  amount: number;
  description: string;
  date: string;
  type: 'expense' | 'income';
  category: TransactionCategory;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as CreateTransactionBody;

    // Validate required fields
    if (!body.amount || !body.description || !body.date || !body.type || !body.category) {
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

    // Validate date format
    const date = new Date(body.date);
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    // Validate type
    if (!['expense', 'income'].includes(body.type)) {
      return NextResponse.json(
        { error: 'Invalid transaction type' },
        { status: 400 }
      );
    }

    await connectDB();
    const transaction = await Transaction.create({
      ...body,
      date: date,
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error('Failed to create transaction:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
} 