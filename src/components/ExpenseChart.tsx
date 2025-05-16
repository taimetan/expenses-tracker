'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Expense } from '@/src/models/expense';
import { format, subDays } from 'date-fns';

interface ExpenseChartProps {
    expenses: Expense[];
    timeRange: 'week' | 'month' | 'year';
  }

export default function ExpenseChart({ expenses }: ExpenseChartProps) {
    // Nhóm chi tiêu theo ngày
    const dailyData = expenses.reduce((acc, expense) => {
        const date = expense.date;
        if (!acc[date]) {
            acc[date] = 0;
        }
        acc[date] += expense.amount;
        return acc;
    }, {} as Record<string, number>);

    // Tạo dữ liệu cho 7 ngày gần nhất
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = format(subDays(new Date(), 6 - i), 'yyyy-MM-dd');
        return {
            date: format(new Date(date), 'dd/MM'),
            amount: dailyData[date] || 0
        };
    });

    return (
        <div className="text-gray-600 h-80">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={last7Days}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} VND`, 'Tổng chi']} />
                    <Legend />
                    <Bar dataKey="amount" name="Chi tiêu" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}