'use client';

import ExpenseChart from '@/src/components/ExpenseChart';
import { FaOpencart, FaFileExcel } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface DashboardChartsProps {
  expensesByDay: {
    name: string;
    amount: number;
  }[];
  onExport?: () => void;
}

export default function DashboardCharts({
  expensesByDay,
  onExport,
}: DashboardChartsProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.div 
      className="mb-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Biểu đồ chi tiêu theo ngày */}
      <motion.div 
        className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl mr-3 shadow-lg">
              <FaOpencart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Chi tiêu theo ngày
              </h2>
              <p className="text-sm text-gray-500">Chi tiêu hàng ngày trong tháng</p>
            </div>
          </div>
          {onExport && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onExport}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all duration-200"
            >
              <FaFileExcel className="mr-2" />
              <span>Xuất Excel</span>
            </motion.button>
          )}
        </div>
        <div className="h-80">
          <ExpenseChart
            data={expensesByDay}
            type="daily"
          />
        </div>
      </motion.div>
    </motion.div>
  );
} 