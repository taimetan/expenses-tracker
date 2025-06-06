'use client';
import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, TooltipProps } from 'recharts';

interface ChartData {
  name: string;
  amount?: number;
  income?: number;
  expenses?: number;
  profit?: number;
}

interface ExpenseChartProps {
  data: ChartData[];
  type?: 'monthly' | 'category' | 'daily';
}

const formatYAxis = (value: number): string => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return value.toString();
};

const chartConfig = {
  monthly: [
    { key: 'income', name: 'Thu nhập', color: '#4ade80' },
    { key: 'expenses', name: 'Chi tiêu', color: '#f87171' },
    { key: 'profit', name: 'Lợi nhuận', color: '#60a5fa' }
  ],
  daily: [
    { key: 'amount', name: 'Chi tiêu', color: '#8884d8' }
  ],
  category: [
    { key: 'amount', name: 'Chi tiêu', color: '#8884d8' }
  ]
} as const;

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-2 text-sm">
      <p className="font-medium text-gray-900">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} className="text-gray-600">
          {entry.value?.toLocaleString('vi-VN')} ₫
        </p>
      ))}
    </div>
  );
};

export default function ExpenseChart({ data, type = 'monthly' }: ExpenseChartProps) {
  const chartBars = useMemo(() => {
    const config = chartConfig[type];
    return config.map(({ key, name, color }) => (
      <Bar key={key} dataKey={key} name={name} fill={color} />
    ));
  }, [type]);

  if (!data?.length) return null;

  return (
    <div className="text-gray-600 h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis 
            dataKey="name" 
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={{ stroke: '#e5e7eb' }}
            fontSize={12}
          />
          <YAxis 
            width={60} 
            tickFormatter={formatYAxis}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={{ stroke: '#e5e7eb' }}
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{
              paddingTop: '1rem'
            }}
            iconType="circle"
            fontSize={12}
          />
          {chartBars}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}