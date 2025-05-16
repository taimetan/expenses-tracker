"use client"

import Link from 'next/link';
import { FaMoneyBillWave, FaChartPie, FaPiggyBank } from 'react-icons/fa';
import { useAuth } from '@/src/contexts/AuthContext';

export default function HomePage() {
  // Lấy thông tin user từ AuthContext
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center py-12 md:py-20">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Quản lý chi tiêu thông minh
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
            Theo dõi và phân tích chi tiêu cá nhân của bạn một cách dễ dàng và hiệu quả
          </p>

          <div className="flex justify-center gap-4">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300"
                >
                  Vào Dashboard
                </Link>
                <Link
                  href="/expenses"
                  className="bg-white hover:bg-gray-100 text-indigo-600 font-bold py-3 px-6 rounded-lg text-lg border border-indigo-600 transition duration-300"
                >
                  Thêm chi tiêu
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/register"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300"
                >
                  Đăng ký miễn phí
                </Link>
                <Link
                  href="/login"
                  className="bg-white hover:bg-gray-100 text-indigo-600 font-bold py-3 px-6 rounded-lg text-lg border border-indigo-600 transition duration-300"
                >
                  Đăng nhập
                </Link>
              </>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 md:py-20 bg-white rounded-xl shadow-sm">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Tính năng nổi bật
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
            <div className="text-center p-6 rounded-lg hover:bg-gray-50 transition duration-300">
              <div className="flex justify-center text-4xl text-indigo-600 mb-4">
                <FaMoneyBillWave />
              </div>
              <h3 className="text-gray-600 text-xl font-bold mb-3">Theo dõi chi tiêu</h3>
              <p className="text-gray-600">
                Ghi chép mọi khoản chi tiêu hàng ngày một cách dễ dàng và nhanh chóng
              </p>
            </div>

            <div className="text-center p-6 rounded-lg hover:bg-gray-50 transition duration-300">
              <div className="flex justify-center text-4xl text-indigo-600 mb-4">
                <FaChartPie />
              </div>
              <h3 className="text-gray-600 text-xl font-bold mb-3">Phân tích thông minh</h3>
              <p className="text-gray-600">
                Biểu đồ trực quan giúp bạn hiểu rõ cách bạn đang chi tiêu theo từng danh mục
              </p>
            </div>

            <div className="text-center p-6 rounded-lg hover:bg-gray-50 transition duration-300">
              <div className="flex justify-center text-4xl text-indigo-600 mb-4">
                <FaPiggyBank />
              </div>
              <h3 className="text-gray-600 text-xl font-bold mb-3">Tiết kiệm hiệu quả</h3>
              <p className="text-gray-600">
                Đặt mục tiêu tiết kiệm và theo dõi tiến độ hoàn thành mục tiêu của bạn
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        {!user && (
          <section className="text-center py-12 md:py-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Bắt đầu quản lý chi tiêu ngay hôm nay
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Đăng ký miễn phí và kiểm soát tài chính cá nhân của bạn
            </p>
            <Link
              href="/register"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg text-lg inline-block transition duration-300"
            >
              Đăng ký ngay
            </Link>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white py-8 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} Expense Tracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}