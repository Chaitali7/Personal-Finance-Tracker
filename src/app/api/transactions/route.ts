import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Transaction from '@/models/Transaction';
import { Transaction as TransactionType } from '@/types/transaction';

export async function GET() {
  try {
    await connectDB();
    const transactions = await Transaction.find().sort({ date: -1 });
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as Omit<TransactionType, '_id' | 'createdAt' | 'updatedAt'>;
    console.log('Received transaction data:', body);
    
    await connectDB();
    console.log('Connected to database');
    
    const transaction = await Transaction.create(body);
    console.log('Created transaction:', transaction);
    
    return NextResponse.json(transaction, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create transaction:', error);
    const errorMessage = error.message || 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to create transaction', details: errorMessage },
      { status: 500 }
    );
  }
} 