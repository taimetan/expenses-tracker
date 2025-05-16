'use client';

import { FaChartBar, FaCalendarAlt, FaFilter, FaTimes, FaChevronLeft, FaChevronRight, FaFileExcel } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardSidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  timeRange: "week" | "month" | "year";
  setTimeRange: (range: "week" | "month" | "year") => void;
  currentMonth: Date;
  changeMonth: (months: number) => void;
  onExport?: () => void;
}

export default function DashboardSidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  timeRange,
  setTimeRange,
  currentMonth,
  changeMonth,
  onExport,
}: DashboardSidebarProps) {
  // Mobile sidebar animation variants
  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: "-100%",
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const renderSidebarContent = () => (
    <div className="p-6 space-y-8">
      {/* Time Controls */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-gray-800">
          <FaCalendarAlt className="text-indigo-500" />
          <h2 className="font-semibold">Thời gian</h2>
        </div>
        <div className="bg-gray-50 p-3 rounded-xl">
          <div className="flex items-center justify-between bg-white shadow-sm rounded-lg p-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => changeMonth(-1)}
              className="p-2 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
            >
              <FaChevronLeft className="w-4 h-4" />
            </motion.button>
            <span className="font-medium text-gray-700">
              {currentMonth.toLocaleDateString("vi-VN", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => changeMonth(1)}
              className="p-2 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
            >
              <FaChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Time Range Filter */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-gray-800">
          <FaFilter className="text-indigo-500" />
          <h2 className="font-semibold">Phạm vi</h2>
        </div>
        <div className="space-y-2">
          {[
            { value: "week", label: "Tuần này" },
            { value: "month", label: "Tháng này" },
            { value: "year", label: "Năm này" }
          ].map((range) => (
            <motion.button
              key={range.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setTimeRange(range.value as "week" | "month" | "year")}
              className={`
                w-full px-4 py-3 rounded-xl flex items-center justify-between
                transition-all duration-200 group
                ${timeRange === range.value
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }
              `}
            >
              <span className="font-medium">{range.label}</span>
              {timeRange === range.value && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2 h-2 rounded-full bg-white"
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Export Button */}
      {onExport && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-gray-800">
            <FaFileExcel className="text-indigo-500" />
            <h2 className="font-semibold">Xuất dữ liệu</h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onExport}
            className="w-full px-4 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <FaFileExcel className="w-4 h-4" />
            <span>Xuất Excel</span>
          </motion.button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-80 bg-white border-r border-gray-100 flex-col min-h-[calc(100vh-4rem)]">
        <div className="flex flex-col flex-grow overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <FaChartBar className="text-white text-xl" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
            </div>
          </div>

          {/* Content */}
          {renderSidebarContent()}
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden fixed inset-0 bg-black/20 z-40"
            />
            
            {/* Sidebar */}
            <motion.aside
              initial="closed"
              animate="open"
              exit="closed"
              variants={sidebarVariants}
              className="md:hidden fixed inset-y-0 left-0 w-80 bg-white shadow-lg z-50 flex flex-col"
            >
              <div className="flex flex-col flex-grow overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <FaChartBar className="text-white text-xl" />
                      </div>
                      <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                        Dashboard
                      </h1>
                    </div>
                    <button
                      onClick={() => setIsSidebarOpen(false)}
                      className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                    >
                      <FaTimes className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                {renderSidebarContent()}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
} 