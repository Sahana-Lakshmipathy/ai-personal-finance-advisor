import React from 'react';
import { Transaction, Category } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const CATEGORY_COLORS: { [key in Category]: string } = {
  'Needs': 'bg-blue-100 text-blue-800',
  'Wants': 'bg-orange-100 text-orange-800',
  'Savings/Investments': 'bg-green-100 text-green-800',
  'Income': 'bg-emerald-100 text-emerald-800',
};

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
    </svg>
);

const TransactionItem: React.FC<{ transaction: Transaction; onDelete: (id: string) => void }> = ({ transaction, onDelete }) => {
  const { id, description, amount, type, category, date } = transaction;

  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  return (
    <li className="flex items-center justify-between p-4 space-x-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-center space-x-4 flex-1">
        <div className={`w-2 h-10 rounded-full ${type === 'income' ? 'bg-success' : 'bg-danger'}`}></div>
        <div className="flex-1">
            <p className="font-semibold text-gray-800">{description}</p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>{formattedDate}</span>
                <span className="text-gray-300">|</span>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${CATEGORY_COLORS[category]}`}>{category}</span>
            </div>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <p className={`font-bold text-lg ${type === 'income' ? 'text-success' : 'text-gray-800'}`}>
          {type === 'income' ? '+' : '-'}{formattedAmount}
        </p>
        <button
          onClick={() => onDelete(id)}
          className="text-gray-400 hover:text-danger focus:outline-none focus:ring-2 focus:ring-danger focus:ring-opacity-50 rounded-full p-1 transition-colors"
          aria-label={`Delete transaction ${description}`}
        >
          <TrashIcon />
        </button>
      </div>
    </li>
  );
};

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Recent Transactions</h3>
      {transactions.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {transactions.map(t => (
            <TransactionItem key={t.id} transaction={t} onDelete={onDelete} />
          ))}
        </ul>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">No transactions yet.</p>
          <p className="text-sm text-gray-400">Add one using the form to get started!</p>
        </div>
      )}
    </div>
  );
};

export default TransactionList;