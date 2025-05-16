'use client';

import { FaMoneyBillWave, FaChartLine, FaExchangeAlt } from 'react-icons/fa';

interface DashboardStatsProps {
  totalExpenses: number;
  avgDailyExpense: number;
  transactionCount: number;
}

export default function DashboardStats({
  totalExpenses,
  avgDailyExpense,
  transactionCount,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Tổng chi tiêu */}
      <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-red-100 text-sm font-medium mb-1">Tổng chi tiêu</p>
            <p className="text-2xl font-bold tracking-tight">
              {totalExpenses.toLocaleString('vi-VN')} VND
            </p>
          </div>
          <div className="bg-red-400 bg-opacity-40 rounded-full p-3">
            <FaMoneyBillWave className="h-6 w-6" />
          </div>
        </div>
        <div className="mt-4 text-red-100 text-sm">
          <span className="flex items-center">
            <FaChartLine className="mr-1" />
            Theo dõi chi tiêu của bạn
          </span>
        </div>
      </div>

      {/* Chi tiêu trung bình */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium mb-1">Chi tiêu trung bình/ngày</p>
            <p className="text-2xl font-bold tracking-tight">
              {Math.round(avgDailyExpense).toLocaleString('vi-VN')} VND
            </p>
          </div>
          <div className="bg-blue-400 bg-opacity-40 rounded-full p-3">
            <FaChartLine className="h-6 w-6" />
          </div>
        </div>
        <div className="mt-4 text-blue-100 text-sm">
          <span className="flex items-center">
            <FaChartLine className="mr-1" />
            Phân tích xu hướng
          </span>
        </div>
      </div>

      {/* Số giao dịch */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm font-medium mb-1">Số giao dịch</p>
            <p className="text-2xl font-bold tracking-tight">
              {transactionCount}
            </p>
          </div>
          <div className="bg-green-400 bg-opacity-40 rounded-full p-3">
            <FaExchangeAlt className="h-6 w-6" />
          </div>
        </div>
        <div className="mt-4 text-green-100 text-sm">
          <span className="flex items-center">
            <FaChartLine className="mr-1" />
            Hoạt động tài chính
          </span>
        </div>
      </div>
    </div>
  );
} 