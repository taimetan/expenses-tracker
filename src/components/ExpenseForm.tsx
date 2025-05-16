/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { Expense, categories } from '@/src/models/expense';
import { addExpense } from '@/src/services/expenseService';
import { useAuth } from '@/src/contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface ExpenseFormProps {
    onSuccess?: () => void;
}

export default function ExpenseForm({ onSuccess }: ExpenseFormProps) {
    const { user } = useAuth();
    const [expense, setExpense] = useState<Omit<Expense, 'userId'>>({
        amount: 0,
        category: categories[0],
        description: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            setLoading(true);
            await addExpense({
                ...expense,
                userId: user.uid
            });
            toast.success('Thêm chi tiêu thành công!');
            setExpense({
                amount: 0,
                category: categories[0],
                description: '',
                date: new Date().toISOString().split('T')[0]
            });
            onSuccess?.();
        } catch (error) {
            toast.error('Có lỗi xảy ra khi thêm chi tiêu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-gray-600">
            <div>
                <label className="block text-sm font-medium text-gray-700">Số tiền</label>
                <input
                    type="number"
                    value={expense.amount || ''}
                    onChange={(e) => setExpense({ ...expense, amount: Number(e.target.value) })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder='Nhập số tiền: 20,000 VNĐ'
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Danh mục</label>
                <select
                    value={expense.category}
                    onChange={(e) => setExpense({ ...expense, category: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                <input
                    type="text"
                    value={expense.description}
                    onChange={(e) => setExpense({ ...expense, description: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder='Ăn sáng'
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Ngày</label>
                <input
                    type="date"
                    value={expense.date}
                    onChange={(e) => setExpense({ ...expense, date: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className={`inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
            >
                {loading ? 'Đang thêm...' : 'Thêm chi tiêu'}
            </button>
        </form>
    );
}