'use client';

import ExpenseChart from '@/src/components/ExpenseChart';
import { FaFileExcel, FaChartBar, FaOpencart } from 'react-icons/fa';

interface DashboardChartsProps {
  monthlyData: {
    month: string;
    income: number;
    expenses: number;
    profit: number;
  }[];
  expensesByCategory: {
    category: string;
    amount: number;
  }[];
  handleExport: () => void;
}

export default function DashboardCharts({
  monthlyData,
  expensesByCategory,
  handleExport,
}: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Biểu đồ thu chi */}
      <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-xl mr-3">
              <FaChartBar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Biểu đồ thu chi
              </h2>
              <p className="text-sm text-gray-500">Phân tích 6 tháng gần nhất</p>
            </div>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors duration-200"
          >
            <FaFileExcel className="mr-2" />
            <span>Xuất Excel</span>
          </button>
        </div>
        <div className="h-80">
          <ExpenseChart
            data={monthlyData.map((item) => ({
              name: item.month,
              income: item.income,
              expenses: item.expenses,
              profit: item.profit,
            }))}
            type="monthly"
          />
        </div>
      </div>

      {/* Biểu đồ chi tiêu theo danh mục */}
      <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
        <div className="flex items-center mb-6">
          <div className="bg-purple-100 p-3 rounded-xl mr-3">
            <FaOpencart className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Chi tiêu theo danh mục
            </h2>
            <p className="text-sm text-gray-500">Phân bổ chi tiêu</p>
          </div>
        </div>
        <div className="h-80">
          <ExpenseChart
            data={expensesByCategory.map((item) => ({
              name: item.category,
              amount: item.amount,
            }))}
            type="category"
          />
        </div>
      </div>
    </div>
  );
} 