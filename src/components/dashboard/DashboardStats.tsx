'use client';

import { FaMoneyBillWave, FaChartLine, FaExchangeAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Tổng chi tiêu */}
      <motion.div 
        variants={cardVariants}
        className="relative overflow-hidden bg-gradient-to-br from-violet-500 to-violet-700 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8">
          <div className="absolute inset-0 bg-white opacity-10 rounded-full"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-violet-100 text-sm font-medium mb-1">Tổng chi tiêu</p>
              <p className="text-3xl font-bold tracking-tight">
                {totalExpenses.toLocaleString('vi-VN')} ₫
              </p>
            </div>
            <div className="bg-violet-400 bg-opacity-40 rounded-full p-3">
              <FaMoneyBillWave className="h-6 w-6" />
            </div>
          </div>
          <div className="flex items-center text-violet-100 text-sm">
            <FaChartLine className="mr-2" />
            <span>Theo dõi chi tiêu của bạn</span>
          </div>
        </div>
      </motion.div>

      {/* Chi tiêu trung bình */}
      <motion.div 
        variants={cardVariants}
        className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8">
          <div className="absolute inset-0 bg-white opacity-10 rounded-full"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Chi tiêu trung bình/ngày</p>
              <p className="text-3xl font-bold tracking-tight">
                {Math.round(avgDailyExpense).toLocaleString('vi-VN')} ₫
              </p>
            </div>
            <div className="bg-blue-400 bg-opacity-40 rounded-full p-3">
              <FaChartLine className="h-6 w-6" />
            </div>
          </div>
          <div className="flex items-center text-blue-100 text-sm">
            <FaChartLine className="mr-2" />
            <span>Phân tích xu hướng</span>
          </div>
        </div>
      </motion.div>

      {/* Số giao dịch */}
      <motion.div 
        variants={cardVariants}
        className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8">
          <div className="absolute inset-0 bg-white opacity-10 rounded-full"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-emerald-100 text-sm font-medium mb-1">Số giao dịch</p>
              <p className="text-3xl font-bold tracking-tight">
                {transactionCount}
              </p>
            </div>
            <div className="bg-emerald-400 bg-opacity-40 rounded-full p-3">
              <FaExchangeAlt className="h-6 w-6" />
            </div>
          </div>
          <div className="flex items-center text-emerald-100 text-sm">
            <FaChartLine className="mr-2" />
            <span>Hoạt động tài chính</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 