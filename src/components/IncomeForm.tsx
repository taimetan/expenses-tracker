// src/components/IncomeForm.tsx
'use client';
import { useState } from 'react';
import { addIncome } from '@/src/services/incomeService';
import { useAuth } from '@/src/contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface IncomeFormProps {
    onSuccess?: () => void;
    initialData?: {
        amount: number;
        source: string;
        date: string;
        description?: string;
    };
}

export default function IncomeForm({ onSuccess, initialData }: IncomeFormProps) {
    const { user } = useAuth();
    const [income, setIncome] = useState({
        amount: initialData?.amount || 0,
        source: initialData?.source || 'Lương',
        date: initialData?.date || new Date().toISOString().split('T')[0],
        description: initialData?.description || ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || income.amount <= 0) {
            toast.error('Vui lòng nhập số tiền hợp lệ');
            return;
        }

        try {
            setLoading(true);
            await addIncome({
                ...income,
                userId: user.uid,
                amount: Number(income.amount)
            });
            toast.success('Thêm thu nhập thành công!');
            setIncome({
                amount: 0,
                source: 'Lương',
                date: new Date().toISOString().split('T')[0],
                description: ''
            });
            onSuccess?.();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error('Lỗi khi thêm thu nhập');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nguồn thu</label>
                <select
                    value={income.source}
                    onChange={(e) => setIncome({...income, source: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                    <option value="Lương">Lương</option>
                    <option value="Kinh doanh">Kinh doanh</option>
                    <option value="Đầu tư">Đầu tư</option>
                    <option value="Thưởng">Thưởng</option>
                    <option value="Khác">Khác</option>
                </select>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền (VND)</label>
                <input
                    type="number"
                    value={income.amount || ''}
                    onChange={(e) => setIncome({...income, amount: Number(e.target.value)})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    min="1"
                    required
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày nhận</label>
                <input
                    type="date"
                    value={income.date}
                    onChange={(e) => setIncome({...income, date: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả (tùy chọn)</label>
                <input
                    type="text"
                    value={income.description}
                    onChange={(e) => setIncome({...income, description: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    placeholder="Ví dụ: Lương tháng 10"
                />
            </div>
            
            <div className="flex space-x-3 pt-2">
                <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {loading ? 'Đang xử lý...' : 'Lưu thu nhập'}
                </button>
            </div>
        </form>
    );
}