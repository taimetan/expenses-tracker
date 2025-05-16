'use client';
import { useEffect, useState } from 'react';
import ProtectedRoute from '@/src/components/ProtectedRoute';
import BudgetForm from '@/src/components/BudgetForm';
import { getBudgets, deleteBudget } from '@/src/services/budgetService';
import { useAuth } from '@/src/contexts/AuthContext';
import { Budget } from '@/src/models/budget';
import { toast } from 'react-hot-toast';

export default function BudgetsPage() {
    const { user } = useAuth();
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) fetchBudgets();
    }, [user]);

    const fetchBudgets = async () => {
        try {
            setLoading(true);
            const data = await getBudgets(user!.uid);
            setBudgets(data);
        } catch (error) {
            toast.error('Lỗi khi tải ngân sách');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Bạn chắc chắn muốn xóa ngân sách này?')) {
            try {
                await deleteBudget(id);
                toast.success('Xóa ngân sách thành công');
                fetchBudgets();
            } catch (error) {
                toast.error('Lỗi khi xóa ngân sách');
            }
        }
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-100 text-gray-600">
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-xl font-semibold mb-4">Thêm ngân sách mới</h2>
                            <BudgetForm onSuccess={fetchBudgets} />
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-xl font-semibold mb-4">Danh sách ngân sách</h2>
                            {loading ? (
                                <div className="flex justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                                </div>
                            ) : budgets.length === 0 ? (
                                <p className="text-gray-500">Chưa có ngân sách nào</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Danh mục
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Số tiền
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Chu kỳ
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Hành động
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {budgets.map((budget) => (
                                                <tr key={budget.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {budget.category}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {budget.amount.toLocaleString()} VND
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {budget.period === 'monthly' ? 'Hàng tháng' :
                                                            budget.period === 'weekly' ? 'Hàng tuần' : 'Hàng năm'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <button
                                                            onClick={() => handleDelete(budget.id!)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Xóa
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}