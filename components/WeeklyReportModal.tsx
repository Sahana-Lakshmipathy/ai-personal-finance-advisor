import React from 'react';
import { WeeklyReport } from '../types';

interface WeeklyReportModalProps {
  report: WeeklyReport;
  onClose: () => void;
}

const GRADE_STYLES = {
    A: 'bg-green-100 text-success border-green-500',
    B: 'bg-blue-100 text-blue-600 border-blue-500',
    C: 'bg-yellow-100 text-yellow-600 border-yellow-500',
    D: 'bg-orange-100 text-orange-600 border-orange-500',
    F: 'bg-red-100 text-danger border-red-500',
};

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const WeeklyReportModal: React.FC<WeeklyReportModalProps> = ({ report, onClose }) => {
  const gradeStyle = GRADE_STYLES[report.grade] || GRADE_STYLES['C'];
  
  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
        onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800">Your Weekly Financial Report</h2>
                    <p className="text-gray-500 mt-1">A summary of your financial health from the past week.</p>
                </div>
                <button 
                    onClick={onClose} 
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close report"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            {/* Grade & Summary */}
            <div className={`p-6 rounded-xl border-l-4 ${gradeStyle} mb-8`}>
                <div className="flex items-center">
                    <span className={`text-5xl font-black ${gradeStyle.split(' ')[1]}`}>{report.grade}</span>
                    <div className="ml-4">
                        <h3 className="text-lg font-bold">Financial Health Grade</h3>
                        <p className="text-sm">{report.summary}</p>
                    </div>
                </div>
            </div>

            {/* Main Content Sections */}
            <div className="space-y-8">
                {/* Suggestion */}
                <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">💡 Area of Focus</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-semibold text-brand-primary">{report.suggestion.area}</p>
                        <p className="text-gray-600 text-sm mt-1">{report.suggestion.reason}</p>
                    </div>
                </div>
                
                {/* Top Expenses */}
                <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-3">💸 Top 5 Expenses This Week</h4>
                    <ul className="space-y-2">
                        {report.topExpenses.map((expense, index) => (
                            <li key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                <span className="text-gray-700">{expense.description}</span>
                                <span className="font-semibold text-danger">
                                    -{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(expense.amount)}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Tips */}
                <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-3">🚀 Actionable Tips</h4>
                    <ul className="space-y-3">
                        {report.tips.map((tip, index) => (
                            <li key={index} className="flex items-start text-gray-700">
                                <CheckCircleIcon />
                                <span>{tip}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 text-right rounded-b-2xl">
            <button
                onClick={onClose}
                className="py-2 px-6 bg-brand-secondary text-white font-semibold rounded-lg shadow-md hover:bg-brand-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent transition-colors"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default WeeklyReportModal;