"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import ExpenseForm from "@/src/components/ExpenseForm";
import { getExpenses } from "@/src/services/expenseService";
import { Expense } from "@/src/models/expense";
import { useAuth } from "@/src/contexts/AuthContext";
import ExpenseDashboard from "@/src/components/expenses/ExpenseDashboard";

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
      result = result.filter((expense) => expense.category === filters.category);
    }

    if (filters.startDate) {
      result = result.filter(
        (expense) => new Date(expense.date) >= new Date(filters.startDate)
      );
    }
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setDate(endDate.getDate() + 1);
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
    setShowFilters(false);
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

  // Tính toán phân trang và tổng chi tiêu
  const totalItems = filteredExpenses.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
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
            <ExpenseDashboard
              filters={filters}
              showFilters={showFilters}
              loading={loading}
              filteredExpenses={filteredExpenses}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
              totalPages={totalPages}
              totalAmount={totalAmount}
              activeFiltersCount={activeFiltersCount}
              setFilters={setFilters}
              clearFilter={clearFilter}
              applyFilters={applyFilters}
              resetFilters={resetFilters}
              setShowFilters={setShowFilters}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
