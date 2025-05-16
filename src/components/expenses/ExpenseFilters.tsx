'use client';

import { FaTimes, FaFilter, FaSearch } from 'react-icons/fa';
import { categories } from '@/src/models/expense';

interface ExpenseFiltersProps {
  filters: {
    category: string;
    startDate: string;
    endDate: string;
    minAmount: string;
    maxAmount: string;
    searchText: string;
  };
  showFilters: boolean;
  setFilters: (filters: any) => void;
  clearFilter: (filterName: "category" | "startDate" | "endDate" | "minAmount" | "maxAmount" | "searchText") => void;
  applyFilters: () => void;
  resetFilters: () => void;
  setShowFilters: (show: boolean) => void;
  activeFiltersCount: number;
}

export default function ExpenseFilters({
  filters,
  showFilters,
  setFilters,
  clearFilter,
  applyFilters,
  resetFilters,
  setShowFilters,
  activeFiltersCount,
}: ExpenseFiltersProps) {
  return (
    <>
      {/* Header với tìm kiếm và bộ lọc */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <div className="w-full sm:w-auto flex flex-col-reverse sm:flex-row gap-2">
          {/* Ô tìm kiếm */}
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Tìm theo mô tả hoặc danh mục..."
              value={filters.searchText}
              onChange={(e) => setFilters({ ...filters, searchText: e.target.value })}
              onKeyPress={(e) => e.key === "Enter" && applyFilters()}
              className="w-full text-gray-600 pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            {filters.searchText && (
              <button
                onClick={() => clearFilter("searchText")}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={14} />
              </button>
            )}
          </div>

          {/* Nút bộ lọc */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center sm:justify-start px-3 py-2 rounded-md text-sm ${
              showFilters ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-700"
            }`}
          >
            <FaFilter className="mr-1" />
            Bộ lọc
            {activeFiltersCount > 0 && (
              <span className="ml-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Panel bộ lọc */}
      <div className={`mb-6 p-4 text-gray-600 bg-gray-50 rounded-lg ${showFilters ? "block" : "hidden"}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Lọc theo danh mục */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
            <div className="relative">
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md text-sm appearance-none pr-8"
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {filters.category && (
                <button
                  onClick={() => clearFilter("category")}
                  className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Lọc theo thời gian */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
            <div className="relative">
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md text-sm pr-8"
              />
              {filters.startDate && (
                <button
                  onClick={() => clearFilter("startDate")}
                  className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={14} />
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
            <div className="relative">
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md text-sm pr-8"
              />
              {filters.endDate && (
                <button
                  onClick={() => clearFilter("endDate")}
                  className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Lọc theo số tiền */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền (VND)</label>
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <input
                  type="number"
                  placeholder="Từ"
                  value={filters.minAmount}
                  onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm pr-8"
                  min="0"
                />
                {filters.minAmount && (
                  <button
                    onClick={() => clearFilter("minAmount")}
                    className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes size={14} />
                  </button>
                )}
              </div>
              <div className="relative flex-grow">
                <input
                  type="number"
                  placeholder="Đến"
                  value={filters.maxAmount}
                  onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm pr-8"
                  min="0"
                />
                {filters.maxAmount && (
                  <button
                    onClick={() => clearFilter("maxAmount")}
                    className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4 gap-2">
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 flex items-center"
          >
            <FaTimes className="mr-1" /> Đặt lại
          </button>
          <button
            onClick={applyFilters}
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center"
          >
            <FaFilter className="mr-1" /> Áp dụng
          </button>
        </div>
      </div>
    </>
  );
} 