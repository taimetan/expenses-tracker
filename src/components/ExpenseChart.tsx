'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  [key: string]: string | number;
}

interface ExpenseChartProps {
  data: ChartData[];
  type?: 'monthly' | 'category';
}

export default function ExpenseChart({ data, type = 'monthly' }: ExpenseChartProps) {
  return (
    <div className="text-gray-600 h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => [`${value.toLocaleString('vi-VN')} VND`, '']} />
          <Legend />
          {type === 'monthly' ? (
            <>
              <Bar dataKey="income" name="Thu nhập" fill="#4ade80" />
              <Bar dataKey="expenses" name="Chi tiêu" fill="#f87171" />
              <Bar dataKey="profit" name="Lợi nhuận" fill="#60a5fa" />
            </>
          ) : (
            <Bar dataKey="amount" name="Chi tiêu" fill="#8884d8" />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}