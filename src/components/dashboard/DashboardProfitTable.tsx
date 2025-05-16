'use client';

import { motion } from 'framer-motion';
import { FaChartLine, FaSort, FaSortUp, FaSortDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useState, useMemo } from 'react';

interface DashboardProfitTableProps {
  monthlyData: {
    month: string;
    income: number;
    expenses: number;
    profit: number;
  }[];
  loading: boolean;
}

export default function DashboardProfitTable({
  monthlyData,
  loading,
}: DashboardProfitTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: 'month' | 'income' | 'expenses' | 'profit';
    direction: 'asc' | 'desc';
  }>({ key: 'month', direction: 'desc' });

  const [filter, setFilter] = useState<'all' | 'profit' | 'loss'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const sortedAndFilteredData = useMemo(() => {
    // Lọc các tháng có dữ liệu (có thu nhập hoặc chi tiêu)
    let filteredData = monthlyData.filter(item => item.income > 0 || item.expenses > 0);

    // Áp dụng bộ lọc lãi/lỗ
    if (filter === 'profit') {
      filteredData = filteredData.filter(item => item.profit >= 0);
    } else if (filter === 'loss') {
      filteredData = filteredData.filter(item => item.profit < 0);
    }

    // Sắp xếp dữ liệu
    return filteredData.sort((a, b) => {
      if (sortConfig.key === 'month') {
        const [monthA, yearA] = a.month.split('/').map(Number);
        const [monthB, yearB] = b.month.split('/').map(Number);
        const dateA = new Date(yearA, monthA - 1);
        const dateB = new Date(yearB, monthB - 1);
        return sortConfig.direction === 'asc' 
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }
      return sortConfig.direction === 'asc'
        ? a[sortConfig.key] - b[sortConfig.key]
        : b[sortConfig.key] - a[sortConfig.key];
    });
  }, [monthlyData, sortConfig, filter]);

  // Tính toán số trang
  const totalPages = Math.ceil(sortedAndFilteredData.length / itemsPerPage);

  // Lấy dữ liệu cho trang hiện tại
  const currentData = sortedAndFilteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key: 'month' | 'income' | 'expenses' | 'profit') => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (key: 'month' | 'income' | 'expenses' | 'profit') => {
    if (sortConfig.key !== key) return <FaSort className="ml-1 text-gray-400" />;
    return sortConfig.direction === 'asc' 
      ? <FaSortUp className="ml-1 text-indigo-500" />
      : <FaSortDown className="ml-1 text-indigo-500" />;
  };

  const totals = useMemo(() => {
    return currentData.reduce((acc, curr) => ({
      income: acc.income + curr.income,
      expenses: acc.expenses + curr.expenses,
      profit: acc.profit + curr.profit
    }), { income: 0, expenses: 0, profit: 0 });
  }, [currentData]);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-lg p-3 md:p-6 hover:shadow-xl transition-shadow duration-300"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 space-y-3 md:space-y-0">
        <div className="flex items-center">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-2 md:p-3 rounded-xl mr-2 md:mr-3 shadow-lg">
            <FaChartLine className="h-4 w-4 md:h-6 md:w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-gray-800">
              Lợi nhuận hàng tháng
            </h2>
            <p className="text-xs md:text-sm text-gray-500">Chi tiết thu chi theo tháng</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 md:gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm font-medium transition-colors duration-200 ${
              filter === 'all'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilter('profit')}
            className={`px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm font-medium transition-colors duration-200 ${
              filter === 'profit'
                ? 'bg-green-100 text-green-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Lợi nhuận
          </button>
          <button
            onClick={() => setFilter('loss')}
            className={`px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm font-medium transition-colors duration-200 ${
              filter === 'loss'
                ? 'bg-red-100 text-red-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Thua lỗ
          </button>
        </div>
      </div>

      <div className="overflow-x-auto -mx-3 md:mx-0">
        <div className="min-w-[600px] md:w-full p-3 md:p-0">
          <table className="w-full text-gray-600 text-xs md:text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th 
                  className="py-2 md:py-3 text-left cursor-pointer hover:bg-gray-50 font-medium"
                  onClick={() => handleSort('month')}
                >
                  <div className="flex items-center">
                    <span>Tháng</span>
                    {getSortIcon('month')}
                  </div>
                </th>
                <th 
                  className="py-2 md:py-3 text-right cursor-pointer hover:bg-gray-50 font-medium"
                  onClick={() => handleSort('income')}
                >
                  <div className="flex items-center justify-end">
                    <span>Thu nhập</span>
                    {getSortIcon('income')}
                  </div>
                </th>
                <th 
                  className="py-2 md:py-3 text-right cursor-pointer hover:bg-gray-50 font-medium"
                  onClick={() => handleSort('expenses')}
                >
                  <div className="flex items-center justify-end">
                    <span>Chi tiêu</span>
                    {getSortIcon('expenses')}
                  </div>
                </th>
                <th 
                  className="py-2 md:py-3 text-right cursor-pointer hover:bg-gray-50 font-medium"
                  onClick={() => handleSort('profit')}
                >
                  <div className="flex items-center justify-end">
                    <span>Lợi nhuận</span>
                    {getSortIcon('profit')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, index) => (
                <motion.tr
                  key={item.month}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-2 md:py-3">{item.month}</td>
                  <td className="py-2 md:py-3 text-right text-green-600">
                    {item.income.toLocaleString('vi-VN')} ₫
                  </td>
                  <td className="py-2 md:py-3 text-right text-red-600">
                    {item.expenses.toLocaleString('vi-VN')} ₫
                  </td>
                  <td className={`py-2 md:py-3 text-right ${
                    item.profit >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.profit.toLocaleString('vi-VN')} ₫
                  </td>
                </motion.tr>
              ))}
              <tr className="font-semibold bg-gray-50">
                <td className="py-2 md:py-3">Tổng trang</td>
                <td className="py-2 md:py-3 text-right text-green-600">
                  {totals.income.toLocaleString('vi-VN')} ₫
                </td>
                <td className="py-2 md:py-3 text-right text-red-600">
                  {totals.expenses.toLocaleString('vi-VN')} ₫
                </td>
                <td className={`py-2 md:py-3 text-right ${
                  totals.profit >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {totals.profit.toLocaleString('vi-VN')} ₫
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 md:space-x-4 mt-4 md:mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`p-1.5 md:p-2 rounded-lg ${
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FaChevronLeft className="h-3 w-3 md:h-4 md:w-4" />
          </button>
          <span className="text-xs md:text-sm text-gray-600">
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`p-1.5 md:p-2 rounded-lg ${
              currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FaChevronRight className="h-3 w-3 md:h-4 md:w-4" />
          </button>
        </div>
      )}
    </motion.div>
  );
} 