/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { useEffect, useState } from 'react';
import {
    getReminders,
    markAsPaid,
    deleteReminder
} from '@/src/services/reminderService';
import { useAuth } from '@/src/contexts/AuthContext';
import ReminderForm from '@/src/components/ReminderForm';
import { FaCheck, FaTrash, FaBell } from 'react-icons/fa';
import ProtectedRoute from '@/src/components/ProtectedRoute';
import { Reminder } from '@/src/models/reminder';
import toast from 'react-hot-toast';

export default function RemindersPage() {
    const { user } = useAuth();
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) fetchReminders();
    }, [user]);

    const fetchReminders = async () => {
        try {
            setLoading(true);
            const data = await getReminders(user!.uid);
            setReminders(data);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsPaid = async (id: string) => {
        try {
            await markAsPaid(id);
            toast.success('Đã đánh dấu đã thanh toán');
            fetchReminders();
        } catch (error) {
            toast.error('Lỗi khi cập nhật');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Bạn chắc chắn muốn xóa nhắc nhở này?')) {
            try {
                await deleteReminder(id);
                toast.success('Đã xóa nhắc nhở');
                fetchReminders();
            } catch (error) {
                toast.error('Lỗi khi xóa');
            }
        }
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-100 text-gray-600">
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className='px-4 py-6 sm:px-0'>
                        <header className="mb-8">
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                <FaBell className="text-blue-500" />
                                Quản lý Nhắc nhở
                            </h1>
                            <p className="text-gray-600">Theo dõi các khoản chi định kỳ</p>
                        </header>

                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Form thêm mới */}
                            <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow">
                                <h2 className="text-xl font-semibold mb-4">Thêm nhắc nhở mới</h2>
                                <ReminderForm />
                            </div>

                            {/* Danh sách */}
                            <div className="lg:col-span-2">
                                <div className="bg-white p-6 rounded-lg shadow">
                                    <h2 className="text-xl font-semibold mb-4">Danh sách nhắc nhở</h2>

                                    {loading ? (
                                        <div className="flex justify-center py-8">
                                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                        </div>
                                    ) : reminders.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            <p>Chưa có nhắc nhở nào</p>
                                        </div>
                                    ) : (
                                        <ul className="divide-y divide-gray-200">
                                            {reminders.map((reminder) => (
                                                <li key={reminder.id} className="py-4">
                                                    <div className="flex justify-between">
                                                        <div>
                                                            <h3 className={`font-medium ${reminder.isPaid ? 'line-through text-gray-400' : ''
                                                                }`}>
                                                                {reminder.title}
                                                            </h3>
                                                            <p className="text-sm text-gray-500">
                                                                {reminder.category} • {reminder.dueDate}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`font-medium ${reminder.isPaid ? 'text-gray-400' : 'text-red-500'
                                                                }`}>
                                                                -{reminder.amount.toLocaleString()} VND
                                                            </span>
                                                            {!reminder.isPaid && (
                                                                <button
                                                                    onClick={() => handleMarkAsPaid(reminder.id!)}
                                                                    className="p-2 text-green-500 hover:bg-green-50 rounded-full"
                                                                    title="Đánh dấu đã thanh toán"
                                                                >
                                                                    <FaCheck />
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => handleDelete(reminder.id!)}
                                                                className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                                                                title="Xóa"
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}