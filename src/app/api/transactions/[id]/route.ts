import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Transaction from '@/models/Transaction';

interface UpdateTransactionBody {
  amount: number;
  description: string;
  date: string;
  type: 'expense' | 'income';
  category: string;
}

type Props = {
  params: { id: string }
}

export async function PUT(
  req: NextRequest,
  { params }: Props
) {
  try {
    const body = await req.json() as UpdateTransactionBody;
    await connectDB();
    
    const transaction = await Transaction.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    );

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Failed to update transaction:', error);
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: Props
) {
  try {
    await connectDB();
    const transaction = await Transaction.findByIdAndDelete(params.id);

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Failed to delete transaction:', error);
    return NextResponse.json(
      { error: 'Failed to delete transaction' },
      { status: 500 }
    );
  }
} 