'use client';
import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/src/config/firebase';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error('Vui lòng nhập email');
            return;
        }

        try {
            setLoading(true);
            await sendPasswordResetEmail(auth, email);
            toast.success(`Email đặt lại mật khẩu đã gửi đến ${email}`);
            router.push('/login');
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="text-gray-600 min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Quên mật khẩu</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md mt-1"
                            placeholder="Nhập email của bạn"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        {loading ? 'Đang gửi...' : 'Gửi link đặt lại mật khẩu'}
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <Link href="/login" className="text-blue-600 hover:underline">
                        Quay lại đăng nhập
                    </Link>
                </div>
                <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded text-sm">
                    <p>Chúng tôi sẽ gửi link đặt lại mật khẩu đến email của bạn.</p>
                    <p className="mt-1">• Kiểm tra hộp thư spam nếu không thấy email</p>
                    <p>• Link có hiệu lực trong 24 giờ</p>
                </div>
            </div>
        </div>
    );
}