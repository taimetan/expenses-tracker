'use client';

import { FaChartBar } from 'react-icons/fa';

interface DashboardSidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  timeRange: "week" | "month" | "year";
  setTimeRange: (range: "week" | "month" | "year") => void;
  currentMonth: Date;
  changeMonth: (months: number) => void;
}

export default function DashboardSidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  timeRange,
  setTimeRange,
  currentMonth,
  changeMonth,
}: DashboardSidebarProps) {
  return (
    <aside
      className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
      md:translate-x-0 transform transition-transform duration-200 ease-in-out
      fixed md:static inset-y-0 left-0 w-64 bg-white shadow-md z-50 md:z-auto`}
    >
      <div className="text-gray-600 p-4 flex flex-col h-auto">
        {/* Nút đóng sidebar trên mobile */}
        <div className="md:hidden flex justify-end mb-4">
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1 rounded-full hover:bg-gray-200"
          >
            &times;
          </button>
        </div>

        {/* Tiêu đề */}
        <div className="flex items-center mb-8">
          <FaChartBar className="text-indigo-600 mr-2" />
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        </div>

        {/* Điều khiển thời gian */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 mb-2">
            THỜI GIAN
          </h2>
          <div className="flex items-center justify-between bg-gray-100 p-2 rounded-lg">
            <button
              onClick={() => changeMonth(-1)}
              className="text-gray-600 hover:text-gray-900"
            >
              &lt;
            </button>
            <span className="font-medium">
              {currentMonth.toLocaleDateString("vi-VN", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button
              onClick={() => changeMonth(1)}
              className="text-gray-600 hover:text-gray-900"
            >
              &gt;
            </button>
          </div>
        </div>

        {/* Bộ lọc thời gian */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 mb-2">
            PHẠM VI
          </h2>
          <div className="space-y-2">
            {["week", "month", "year"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range as "week" | "month" | "year")}
                className={`w-full px-4 py-2 text-left rounded-lg ${
                  timeRange === range
                    ? "bg-indigo-100 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {range === "week"
                  ? "Tuần này"
                  : range === "month"
                  ? "Tháng này"
                  : "Năm này"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
} 