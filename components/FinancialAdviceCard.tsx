
import React from 'react';

interface FinancialAdviceCardProps {
    onGetAdvice: () => void;
    advice: string | null;
    isLoading: boolean;
    error: string | null;
}

const FinancialAdviceCard: React.FC<FinancialAdviceCardProps> = ({ onGetAdvice, advice, isLoading, error }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Personalized Financial Advice</h3>
            <p className="text-gray-600 mb-6 text-sm">Get AI-powered insights on your spending, plus investment tips and a 6-month plan based on your income.</p>

            {!advice && !isLoading && (
                 <button
                    onClick={onGetAdvice}
                    disabled={isLoading}
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-accent hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    Get AI-Powered Advice
                </button>
            )}
           
            {isLoading && (
                <div className="flex justify-center items-center p-8">
                    <svg className="animate-spin h-8 w-8 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="ml-4 text-gray-600">Analyzing your finances...</p>
                </div>
            )}

            {error && <p className="text-sm text-danger text-center">{error}</p>}

            {advice && (
                <div className="mt-4 space-y-4 text-gray-700 bg-gray-50 p-4 rounded-lg">
                    <div
                        className="prose prose-sm max-w-none"
                        style={{ whiteSpace: 'pre-wrap' }}
                    >
                        {advice}
                    </div>
                     <button
                        onClick={onGetAdvice}
                        disabled={isLoading}
                        className="w-full mt-4 flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent disabled:bg-gray-300 transition-colors"
                    >
                        {isLoading ? 'Regenerating...' : 'Regenerate Advice'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default FinancialAdviceCard;
