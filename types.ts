
export type TransactionType = 'income' | 'expense';
export type Category = 'Needs' | 'Wants' | 'Savings/Investments' | 'Income';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
  date: string;
}

export interface WeeklyReport {
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  summary: string;
  topExpenses: {
    description: string;
    amount: number;
    wowChange?: number;
  }[];
  suggestion: {
    area: string;
    reason: string;
  };
  tips: string[];
}
