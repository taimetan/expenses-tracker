"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import ExpenseForm from "@/src/components/ExpenseForm";
import { getExpenses } from "@/src/services/expenseService";
import { Expense } from "@/src/models/expense";
import { useAuth } from "@/src/contexts/AuthContext";
import {
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
  FaSearch,
  FaTimes,
  FaCalendarAlt,
  FaMoneyBillWave,
} from "react-icons/fa";
import { categories } from "@/src/models/expense";

export default function ExpensesPage() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // State cho bộ lọc
  const [filters, setFilters] = useState({
    category: "",
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: "",
    searchText: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchExpenses();
    }
  }, [user]);

  useEffect(() => {
    // Đếm số bộ lọc đang active
    const count = Object.values(filters).filter((val) => val !== "").length;
    setActiveFiltersCount(count);
  }, [filters]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await getExpenses(user!.uid);
      const sortedData = data.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setExpenses(sortedData);
      setFilteredExpenses(sortedData);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...expenses];

    if (filters.category) {
      result = result.filter(
        (expense) => expense.category === filters.category
      );
    }

    if (filters.startDate) {
      result = result.filter(
        (expense) => new Date(expense.date) >= new Date(filters.startDate)
      );
    }
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setDate(endDate.getDate() + 1); // Bao gồm cả ngày kết thúc
      result = result.filter((expense) => new Date(expense.date) <= endDate);
    }

    if (filters.minAmount) {
      result = result.filter(
        (expense) => expense.amount >= Number(filters.minAmount)
      );
    }
    if (filters.maxAmount) {
      result = result.filter(
        (expense) => expense.amount <= Number(filters.maxAmount)
      );
    }

    if (filters.searchText) {
      const searchText = filters.searchText.toLowerCase();
      result = result.filter(
        (expense) =>
          expense.description.toLowerCase().includes(searchText) ||
          expense.category.toLowerCase().includes(searchText)
      );
    }

    setFilteredExpenses(result);
    setCurrentPage(1);
    setShowFilters(false); // Đóng panel lọc trên mobile
  };

  const resetFilters = () => {
    setFilters({
      category: "",
      startDate: "",
      endDate: "",
      minAmount: "",
      maxAmount: "",
      searchText: "",
    });
    setFilteredExpenses(expenses);
    setCurrentPage(1);
  };

  const clearFilter = (filterName: keyof typeof filters) => {
    setFilters({ ...filters, [filterName]: "" });
  };

  // Tính toán phân trang
  const totalItems = filteredExpenses.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedExpenses = filteredExpenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Tính tổng chi tiêu
  const totalAmount = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Form thêm chi tiêu mới */}
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h2 className="text-gray-600 text-xl font-semibold mb-4">
                Thêm chi tiêu mới
              </h2>
              <ExpenseForm onSuccess={fetchExpenses} />
            </div>

            {/* Phần lịch sử chi tiêu */}
            <div className="bg-white p-6 rounded-lg shadow">
              {/* Header với tìm kiếm và bộ lọc */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <h2 className="text-gray-600 text-xl font-semibold">
                  Lịch sử chi tiêu
                </h2>

                <div className="w-full sm:w-auto flex flex-col-reverse sm:flex-row gap-2">
                  {/* Ô tìm kiếm */}
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      placeholder="Tìm theo mô tả hoặc danh mục..."
                      value={filters.searchText}
                      onChange={(e) =>
                        setFilters({ ...filters, searchText: e.target.value })
                      }
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
                      showFilters
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-700"
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

              {/* Hiển thị các bộ lọc đang active */}
              {activeFiltersCount > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {filters.category && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Danh mục: {filters.category}
                      <button
                        onClick={() => clearFilter("category")}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <FaTimes size={12} />
                      </button>
                    </span>
                  )}

                  {(filters.startDate || filters.endDate) && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <FaCalendarAlt className="mr-1" size={10} />
                      {filters.startDate || "..."} → {filters.endDate || "..."}
                      <button
                        onClick={() => {
                          clearFilter("startDate");
                          clearFilter("endDate");
                        }}
                        className="ml-1 text-green-600 hover:text-green-800"
                      >
                        <FaTimes size={12} />
                      </button>
                    </span>
                  )}

                  {(filters.minAmount || filters.maxAmount) && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      <FaMoneyBillWave className="mr-1" size={10} />
                      {filters.minAmount || "0"} - {filters.maxAmount || "∞"}{" "}
                      VND
                      <button
                        onClick={() => {
                          clearFilter("minAmount");
                          clearFilter("maxAmount");
                        }}
                        className="ml-1 text-purple-600 hover:text-purple-800"
                      >
                        <FaTimes size={12} />
                      </button>
                    </span>
                  )}
                </div>
              )}

              {/* Panel bộ lọc - Responsive */}
              <div
                className={`mb-6 p-4 text-gray-600 bg-gray-50 rounded-lg ${
                  showFilters ? "block" : "hidden"
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Lọc theo danh mục */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Danh mục
                    </label>
                    <div className="relative">
                      <select
                        value={filters.category}
                        onChange={(e) =>
                          setFilters({ ...filters, category: e.target.value })
                        }
                        className="w-full p-2 border border-gray-300 rounded-md text-sm appearance-none pr-8"
                      >
                        <option value="">Tất cả danh mục</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
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

                  {/* Lọc theo khoảng thời gian */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Từ ngày
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) =>
                          setFilters({ ...filters, startDate: e.target.value })
                        }
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Đến ngày
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) =>
                          setFilters({ ...filters, endDate: e.target.value })
                        }
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

                  {/* Lọc theo khoảng tiền */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số tiền (VND)
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-grow">
                        <input
                          type="number"
                          placeholder="Từ"
                          value={filters.minAmount}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              minAmount: e.target.value,
                            })
                          }
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
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              maxAmount: e.target.value,
                            })
                          }
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
              {/* Chân trang với tổng kết và phân trang */}
              <div className="mt-4 flex flex-col sm:flex-row justify-between items-center border-t py-4 gap-4">
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Tổng chi: </span>
                  <span className="text-red-600">
                    -{totalAmount.toLocaleString("vi-VN")} VND
                  </span>
                  <span className="mx-2">|</span>
                  <span>
                    Hiển thị{" "}
                    {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}
                    -{Math.min(currentPage * itemsPerPage, totalItems)} /{" "}
                    {totalItems} chi tiêu
                  </span>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className={`p-2 rounded-md ${
                        currentPage === 1
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <FaChevronLeft />
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-8 h-8 rounded-md text-sm ${
                                currentPage === pageNum
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}

                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <span className="px-2">...</span>
                      )}

                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <button
                          onClick={() => setCurrentPage(totalPages)}
                          className="w-8 h-8 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {totalPages}
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-md ${
                        currentPage === totalPages
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                )}
              </div>
              {/* Nội dung chính */}
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : filteredExpenses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    Không tìm thấy chi tiêu phù hợp
                  </p>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={resetFilters}
                      className="mt-2 text-sm text-blue-600 hover:underline"
                    >
                      Xóa bộ lọc
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <colgroup>
                        <col className="w-1/6" />{" "}
                        {/* Ngày - chiếm 1/6 độ rộng */}
                        <col className="w-2/6" /> {/* Danh mục - chiếm 2/6 */}
                        <col className="w-2/6" /> {/* Mô tả - chiếm 2/6 */}
                        <col className="w-1/6" /> {/* Số tiền - chiếm 1/6 */}
                      </colgroup>
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ngày
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Danh mục
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Mô tả
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Số tiền
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedExpenses.map((expense) => (
                          <tr key={expense.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(expense.date).toLocaleDateString(
                                "vi-VN"
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {expense.category}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {expense.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                              -{expense.amount.toLocaleString("vi-VN")} VND
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
