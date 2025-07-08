import React from 'react';

interface MetricCardProps {
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'net';
}

const ArrowUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
);

const ArrowDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
);

const ScaleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
);

const ICONS = {
    income: <ArrowUpIcon />,
    expense: <ArrowDownIcon />,
    net: <ScaleIcon />
};

const COLORS = {
    income: 'text-success',
    expense: 'text-danger',
    net: 'text-brand-primary'
};

const MetricCard: React.FC<MetricCardProps> = ({ title, amount, type }) => {
  const colorClass = COLORS[type];
  const icon = ICONS[type];
  
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center space-x-4">
        <div className={`p-2 rounded-full bg-opacity-10 ${colorClass.replace('text-', 'bg-')}`}>
            <span className={colorClass}>{icon}</span>
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className={`text-2xl font-bold ${colorClass}`}>{formattedAmount}</p>
        </div>
    </div>
  );
};

export default MetricCard;