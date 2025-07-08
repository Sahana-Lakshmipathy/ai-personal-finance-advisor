
import React from 'react';
import MetricCard from './MetricCard';
import ExpensePieChart from './ExpensePieChart';
import { Category } from '../types';

interface DashboardProps {
  summary: {
    totalIncome: number;
    totalExpenses: number;
    netCashFlow: number;
  };
  expenseByCategory: {
    [key in Category]?: number;
  };
  onGenerateReport: () => void;
  isReportLoading: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ summary, expenseByCategory, onGenerateReport, isReportLoading }) => {
  const { totalIncome, totalExpenses, netCashFlow } = summary;

  const chartData = [
    { name: 'Needs', value: expenseByCategory['Needs'] || 0 },
    { name: 'Wants', value: expenseByCategory['Wants'] || 0 },
    { name: 'Savings/Investments', value: expenseByCategory['Savings/Investments'] || 0 },
  ].filter(item => item.value > 0);

  const flaggedCategories = Object.entries(expenseByCategory)
    .filter(([_, amount]) => totalExpenses > 0 && (amount / totalExpenses) > 0.3)
    .map(([category]) => category);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Financial Overview</h2>
        <button
          onClick={onGenerateReport}
          disabled={isReportLoading}
          className="w-full sm:w-auto flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-secondary hover:bg-brand-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isReportLoading ? (
             <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : 'Generate Weekly Report'}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <MetricCard title="Total Income" amount={totalIncome} type="income" />
        <MetricCard title="Total Expenses" amount={totalExpenses} type="expense" />
        <MetricCard title="Net Cash Flow" amount={netCashFlow} type="net" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Expense Breakdown</h3>
          <p className="text-gray-500 mb-4">A look at where your money is going.</p>
          <ExpensePieChart data={chartData} />
        </div>
        <div>
          {flaggedCategories.length > 0 && (
            <div className="bg-red-50 border-l-4 border-danger p-4 rounded-r-lg">
              <div className="flex">
                <div className="py-1">
                  <svg className="h-6 w-6 text-danger mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-danger">Spending Alert</p>
                  <p className="text-sm text-red-700">
                    The following categories exceed 30% of your total spending: <span className="font-semibold">{flaggedCategories.join(', ')}</span>. Consider reviewing these areas.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
