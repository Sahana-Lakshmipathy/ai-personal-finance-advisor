
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  value: number;
}

interface ExpensePieChartProps {
  data: ChartData[];
}

const COLORS = {
    'Needs': '#3b82f6', // blue-500
    'Wants': '#f97316', // orange-500
    'Savings/Investments': '#22c55e', // green-500
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const formattedValue = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(data.value);

    return (
      <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200">
        <p className="font-semibold">{`${data.name}: ${formattedValue}`}</p>
      </div>
    );
  }

  return null;
};

const ExpensePieChart: React.FC<ExpensePieChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
        <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
            <p className="text-gray-500">No expense data to display.</p>
        </div>
    );
  }
  
  return (
    <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
            <PieChart>
            <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
            >
                {data.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name as keyof typeof COLORS] || '#cccccc'} />
                ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            </PieChart>
        </ResponsiveContainer>
    </div>
  );
};

export default ExpensePieChart;
