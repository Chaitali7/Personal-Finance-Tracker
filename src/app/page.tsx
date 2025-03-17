'use client';

import { useState, useEffect } from 'react';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import Dashboard from '@/components/Dashboard';
import BudgetForm from '@/components/BudgetForm';
import BudgetList from '@/components/BudgetList';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { Transaction } from '@/types/transaction';
import { Budget, NewBudget } from '@/types/budget';

type TransactionFormData = Omit<Transaction, '_id' | 'createdAt' | 'updatedAt'>;

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions');
      const data = await response.json();
      setTransactions(data);
    } catch {
      toast.error('Failed to fetch transactions');
    }
  };

  const fetchBudgets = async () => {
    try {
      const response = await fetch('/api/budgets');
      const data = await response.json();
      setBudgets(data);
    } catch {
      toast.error('Failed to fetch budgets');
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchBudgets();
  }, []);

  const handleAddTransaction = async (data: TransactionFormData) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add transaction');
      }
      
      await fetchTransactions();
      await fetchBudgets();
      setIsAddTransactionOpen(false);
      toast.success('Transaction added successfully');
    } catch {
      toast.error('Failed to add transaction');
    }
  };

  const handleEditTransaction = async (data: TransactionFormData) => {
    if (!editingTransaction) return;
    
    try {
      const response = await fetch(`/api/transactions/${editingTransaction._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update transaction');
      }
      
      await fetchTransactions();
      await fetchBudgets();
      setEditingTransaction(null);
      toast.success('Transaction updated successfully');
    } catch {
      toast.error('Failed to update transaction');
    }
  };

  const handleDeleteTransaction = async (transaction: Transaction) => {
    try {
      const response = await fetch(`/api/transactions/${transaction._id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete transaction');
      }
      
      await fetchTransactions();
      await fetchBudgets();
      toast.success('Transaction deleted successfully');
    } catch {
      toast.error('Failed to delete transaction');
    }
  };

  const handleAddBudget = async (data: NewBudget) => {
    try {
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add budget');
      }
      
      await fetchBudgets();
      setIsAddBudgetOpen(false);
      toast.success('Budget added successfully');
    } catch {
      toast.error('Failed to add budget');
    }
  };

  const handleEditBudget = async (data: NewBudget) => {
    if (!editingBudget) return;
    
    try {
      const response = await fetch(`/api/budgets/${editingBudget._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update budget');
      }
      
      await fetchBudgets();
      setEditingBudget(null);
      toast.success('Budget updated successfully');
    } catch {
      toast.error('Failed to update budget');
    }
  };

  const handleDeleteBudget = async (budget: Budget) => {
    try {
      const response = await fetch(`/api/budgets/${budget._id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete budget');
      }
      
      await fetchBudgets();
      toast.success('Budget deleted successfully');
    } catch {
      toast.error('Failed to delete budget');
    }
  };

  return (
    <main className="container mx-auto py-8 px-4">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Personal Finance Tracker</h1>
        <div className="space-x-4">
          <Dialog open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Transaction</DialogTitle>
              </DialogHeader>
              <TransactionForm onSubmit={handleAddTransaction} />
            </DialogContent>
          </Dialog>

          <Dialog open={isAddBudgetOpen} onOpenChange={setIsAddBudgetOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Set Budget
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Set New Budget</DialogTitle>
              </DialogHeader>
              <BudgetForm onSubmit={handleAddBudget} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Dashboard transactions={transactions} />

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Monthly Budgets</h2>
          <BudgetList
            budgets={budgets}
            onEdit={setEditingBudget}
            onDelete={handleDeleteBudget}
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          <TransactionList
            transactions={transactions}
            onEdit={setEditingTransaction}
            onDelete={handleDeleteTransaction}
          />
        </div>
      </div>

      {editingTransaction && (
        <Dialog open={!!editingTransaction} onOpenChange={() => setEditingTransaction(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Transaction</DialogTitle>
            </DialogHeader>
            <TransactionForm
              initialData={editingTransaction}
              onSubmit={handleEditTransaction}
              onCancel={() => setEditingTransaction(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {editingBudget && (
        <Dialog open={!!editingBudget} onOpenChange={() => setEditingBudget(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Budget</DialogTitle>
            </DialogHeader>
            <BudgetForm
              initialData={editingBudget}
              onSubmit={handleEditBudget}
              onCancel={() => setEditingBudget(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}
