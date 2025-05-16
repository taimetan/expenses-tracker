'use client';

import { FaBell } from 'react-icons/fa';
import { Budget } from '@/src/models/budget';
import { motion } from 'framer-motion';

interface DashboardBudgetsProps {
  budgetAlerts: (Budget & {
    currentSpending: number;
    isOver: boolean;
    percentage: number;
  })[];
}

export default function DashboardBudgets({
  budgetAlerts,
}: DashboardBudgetsProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-lg p-6 mb-6 hover:shadow-xl transition-shadow duration-300"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center mb-6">
        <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-3 rounded-xl mr-3 shadow-lg">
          <FaBell className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Cảnh báo ngân sách
          </h2>
          <p className="text-sm text-gray-500">Theo dõi chi tiêu theo danh mục</p>
        </div>
      </div>

      <div className="space-y-4">
        {budgetAlerts.map((budget) => (
          <motion.div
            key={budget.id}
            variants={itemVariants}
            className={`p-4 rounded-xl transition-all duration-300 ${
              budget.isOver 
                ? "bg-gradient-to-r from-red-50 to-red-100 shadow-sm" 
                : "bg-gradient-to-r from-gray-50 to-gray-100"
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {budget.category}
                </h3>
                <p className="text-sm text-gray-600">
                  {budget.currentSpending.toLocaleString("vi-VN")} /{" "}
                  {budget.amount.toLocaleString("vi-VN")} ₫
                </p>
              </div>
              <motion.span
                whileHover={{ scale: 1.05 }}
                className={`px-3 py-1 text-sm font-medium rounded-full ${
                  budget.isOver
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {budget.percentage}%
              </motion.span>
            </div>
            <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${budget.percentage}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`absolute left-0 top-0 h-full rounded-full ${
                  budget.isOver ? "bg-red-500" : "bg-green-500"
                }`}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
} 