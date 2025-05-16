// src/components/BudgetForm.tsx
'use client';
import { useState } from 'react';
import { Budget } from '@/src/models/budget';
import { categories } from '@/src/models/expense';
import { addBudget } from '@/src/services/budgetService';
import { useAuth } from '@/src/contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface BudgetFormProps {
    onSuccess?: () => void;
    showStatus?: boolean;
}

export default function BudgetForm({ onSuccess, showStatus = true }: BudgetFormProps) {
    const { user } = useAuth();
    const [budget, setBudget] = useState<Omit<Budget, 'userId'>>({
        category: categories[0],
        amount: 0,
        period: 'monthly'
    });
    const [loading, setLoading] = useState(false);
    const [budgetStatus, setBudgetStatus] = useState<{
        remaining: number;
        percentageUsed: number;
    } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            setLoading(true);
            await addBudget({
                ...budget,
                userId: user.uid
            });

            if (showStatus) {
                setBudgetStatus({
                    remaining: budget.amount,
                    percentageUsed: 0
                });
            }

            toast.success('Đặt ngân sách thành công!');
            onSuccess?.();
        } catch (error) {
            toast.error('Lỗi khi đặt ngân sách');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='text-gray-600'>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                        Danh mục
                    </label>
                    <select
                        id="category"
                        value={budget.category}
                        onChange={(e) => setBudget({ ...budget, category: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                        {categories.map((category) => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                        Số tiền (VND)
                    </label>
                    <input
                        id="amount"
                        type="number"
                        value={budget.amount || ''}
                        onChange={(e) => setBudget({ ...budget, amount: Number(e.target.value) })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nhập số tiền"
                        min="1"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">
                        Chu kỳ
                    </label>
                    <select
                        id="period"
                        value={budget.period}
                        onChange={(e) => setBudget({ ...budget, period: e.target.value as any })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="daily">Hàng ngày</option>
                        <option value="weekly">Hàng tuần</option>
                        <option value="monthly">Hàng tháng</option>
                        <option value="yearly">Hàng năm</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    {loading ? 'Đang xử lý...' : 'Đặt ngân sách'}
                </button>
            </form>

            {showStatus && budgetStatus && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2">Thông tin ngân sách</h3>
                    <p>Số tiền còn lại: {budgetStatus.remaining.toLocaleString()} VND</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${budgetStatus.percentageUsed}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        Đã sử dụng: {budgetStatus.percentageUsed}%
                    </p>
                </div>
            )}
        </div>
    );
}