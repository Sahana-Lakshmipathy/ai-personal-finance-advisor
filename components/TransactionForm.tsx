
import React, { useState } from 'react';
import { TransactionType } from '../types';

interface TransactionFormProps {
  onSubmit: (transaction: { description: string; amount: number; type: TransactionType }) => void;
  isLoading: boolean;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, isLoading }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount) {
      setError('Both description and amount are required.');
      return;
    }
    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      setError('Please enter a valid, positive amount.');
      return;
    }
    setError(null);
    onSubmit({ description, amount: amountNumber, type });
    setDescription('');
    setAmount('');
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg h-full">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Add Transaction</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <div className="flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-2 px-4 text-sm font-medium focus:z-10 focus:outline-none transition-colors rounded-l-md ${type === 'expense' ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-2 px-4 text-sm font-medium focus:z-10 focus:outline-none transition-colors rounded-r-md ${type === 'income' ? 'bg-success text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Income
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
            placeholder="e.g., Groceries, Salary"
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 pl-7 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
              placeholder="0.00"
              step="0.01"
            />
          </div>
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-secondary hover:bg-brand-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Categorizing...
            </>
          ) : (
            'Add Transaction'
          )}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
