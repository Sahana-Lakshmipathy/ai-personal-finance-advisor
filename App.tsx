
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Transaction, Category, WeeklyReport } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { categorizeExpense, generateWeeklyReport, getFinancialAdvice } from './services/geminiService';
import { getWeekStartAndEnd } from './utils/dateUtils';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import WeeklyReportModal from './components/WeeklyReportModal';
import FinancialAdviceCard from './components/FinancialAdviceCard';

const App: React.FC = () => {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', []);
  const [isCategorizing, setIsCategorizing] = useState<boolean>(false);
  const [isReportLoading, setIsReportLoading] = useState<boolean>(false);
  const [isAdviceLoading, setIsAdviceLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [adviceError, setAdviceError] = useState<string | null>(null);
  const [weeklyReport, setWeeklyReport] = useLocalStorage<WeeklyReport | null>('weeklyReport', null);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [hasNewReport, setHasNewReport] = useState<boolean>(false);
  const [financialAdvice, setFinancialAdvice] = useState<string | null>(null);

  const handleAddTransaction = async (transaction: Omit<Transaction, 'id' | 'category' | 'date'>) => {
    setIsCategorizing(true);
    setError(null);
    try {
      let category: Category = 'Income';
      if (transaction.type === 'expense') {
        category = await categorizeExpense(transaction.description);
      }
      const newTransaction: Transaction = {
        ...transaction,
        id: Date.now().toString(),
        date: new Date().toISOString(),
        category,
      };
      setTransactions(prev => [newTransaction, ...prev]);
    } catch (err) {
      setError('Failed to categorize transaction. Please try again.');
      console.error(err);
    } finally {
      setIsCategorizing(false);
    }
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };
  
  const handleGenerateReport = useCallback(async () => {
    setIsReportLoading(true);
    setError(null);
    console.log("Generating weekly report on demand...");

    const { startOfWeek, endOfWeek } = getWeekStartAndEnd(new Date());

    const currentWeekTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate >= startOfWeek && tDate <= endOfWeek;
    });

    if (currentWeekTransactions.length === 0) {
      setError("No transactions in the current week to generate a report.");
      setIsReportLoading(false);
      return;
    }

    try {
        const { startOfWeek: prevWeekStart, endOfWeek: prevWeekEnd } = getWeekStartAndEnd(new Date(startOfWeek.getTime() - 7 * 24 * 60 * 60 * 1000));
        const prevWeekTransactions = transactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate >= prevWeekStart && tDate <= prevWeekEnd;
        });

        const report = await generateWeeklyReport(currentWeekTransactions, prevWeekTransactions);
        setWeeklyReport(report);
        setHasNewReport(true);
        setIsReportModalOpen(true); // Open modal immediately
    } catch (err) {
        setError('Failed to generate weekly report.');
        console.error(err);
    } finally {
        setIsReportLoading(false);
    }
  }, [transactions, setWeeklyReport]);

  const handleGetAdvice = useCallback(async () => {
    setIsAdviceLoading(true);
    setAdviceError(null);
    setFinancialAdvice(null);
    try {
        const advice = await getFinancialAdvice(transactions);
        setFinancialAdvice(advice);
    } catch (err) {
        setAdviceError('Failed to get financial advice. Please try again.');
        console.error(err);
    } finally {
        setIsAdviceLoading(false);
    }
  }, [transactions]);

  const summary = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    return {
      totalIncome: income,
      totalExpenses: expenses,
      netCashFlow: income - expenses,
    };
  }, [transactions]);

  const expenseByCategory = useMemo(() => {
    const data: { [key in Category]?: number } = {
      'Needs': 0,
      'Wants': 0,
      'Savings/Investments': 0,
    };
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        if (t.category && data[t.category] !== undefined) {
            // @ts-ignore
          data[t.category] += t.amount;
        }
      });
    return data;
  }, [transactions]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        {hasNewReport && weeklyReport && !isReportModalOpen && (
          <div className="bg-brand-accent text-white p-4 rounded-lg shadow-lg mb-6 flex justify-between items-center">
            <p className="font-semibold">A new weekly financial report was generated!</p>
            <button
              onClick={() => {
                setIsReportModalOpen(true);
                setHasNewReport(false);
              }}
              className="bg-white text-brand-accent font-bold py-2 px-4 rounded-md hover:bg-gray-100 transition-colors"
            >
              View Report
            </button>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Dashboard
              summary={summary}
              expenseByCategory={expenseByCategory}
              onGenerateReport={handleGenerateReport}
              isReportLoading={isReportLoading}
            />
            <TransactionList 
              transactions={transactions} 
              onDelete={handleDeleteTransaction}
            />
          </div>
          <div className="lg:col-span-1 space-y-6">
            <TransactionForm onSubmit={handleAddTransaction} isLoading={isCategorizing} />
            {error && <p className="text-danger mt-4 text-center">{error}</p>}
            <FinancialAdviceCard 
              onGetAdvice={handleGetAdvice}
              advice={financialAdvice}
              isLoading={isAdviceLoading}
              error={adviceError}
            />
          </div>
        </div>
      </main>
      {isReportModalOpen && weeklyReport && (
        <WeeklyReportModal
          report={weeklyReport}
          onClose={() => setIsReportModalOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
