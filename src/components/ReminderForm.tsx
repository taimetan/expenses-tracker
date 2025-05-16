'use client';
import { useState } from 'react';
import { Reminder } from '@/src/models/reminder';
import { categories } from '@/src/models/expense';
import { addReminder } from '@/src/services/reminderService';
import { useAuth } from '@/src/contexts/AuthContext';
import { toast } from 'react-hot-toast';

export default function ReminderForm() {
    const { user } = useAuth();
    const [reminder, setReminder] = useState<Omit<Reminder, 'userId' | 'isPaid'>>({
        title: '',
        amount: 0,
        category: categories[0],
        dueDate: new Date().toISOString().split('T')[0]
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            setLoading(true);
            await addReminder({
                ...reminder,
                userId: user.uid,
                isPaid: false
            });
            toast.success('Thêm nhắc nhở thành công!');
            setReminder({
                title: '',
                amount: 0,
                category: categories[0],
                dueDate: new Date().toISOString().split('T')[0]
            });
        } catch (error) {
            toast.error('Lỗi khi thêm nhắc nhở');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block mb-1">Tiêu đề</label>
                <input
                    type="text"
                    value={reminder.title}
                    onChange={(e) => setReminder({ ...reminder, title: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>

            <div>
                <label className="block mb-1">Số tiền</label>
                <input
                    type="number"
                    value={reminder.amount || ''}
                    onChange={(e) => setReminder({ ...reminder, amount: Number(e.target.value) })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    required
                />
            </div>

            <div>
                <label className="block mb-1">Danh mục</label>
                <select
                    value={reminder.category}
                    onChange={(e) => setReminder({ ...reminder, category: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block mb-1">Ngày đến hạn</label>
                <input
                    type="date"
                    value={reminder.dueDate}
                    onChange={(e) => setReminder({ ...reminder, dueDate: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
            >
                {loading ? 'Đang xử lý...' : 'Thêm nhắc nhở'}
            </button>
        </form>
    );
}