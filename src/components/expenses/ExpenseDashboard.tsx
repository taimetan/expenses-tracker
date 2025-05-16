'use client';

import { Expense } from '@/src/models/expense';
import ExpenseFilters from './ExpenseFilters';
import ExpenseSummary from './ExpenseSummary';
import ExpenseList from './ExpenseList';

interface ExpenseDashboardProps {
  filters: {
    category: string;
    startDate: string;
    endDate: string;
    minAmount: string;
    maxAmount: string;
    searchText: string;
  };
  showFilters: boolean;
  loading: boolean;
  filteredExpenses: Expense[];
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  totalAmount: number;
  activeFiltersCount: number;
  setFilters: (filters: any) => void;
  clearFilter: (filterName: "category" | "startDate" | "endDate" | "minAmount" | "maxAmount" | "searchText") => void;
  applyFilters: () => void;
  resetFilters: () => void;
  setShowFilters: (show: boolean) => void;
  setCurrentPage: (page: number) => void;
}

export default function ExpenseDashboard({
  filters,
  showFilters,
  loading,
  filteredExpenses,
  currentPage,
  itemsPerPage,
  totalItems,
  totalPages,
  totalAmount,
  activeFiltersCount,
  setFilters,
  clearFilter,
  applyFilters,
  resetFilters,
  setShowFilters,
  setCurrentPage,
}: ExpenseDashboardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-gray-600 text-xl font-semibold mb-4">
        Lịch sử chi tiêu
      </h2>

      <ExpenseFilters
        filters={filters}
        showFilters={showFilters}
        setFilters={setFilters}
        clearFilter={clearFilter}
        applyFilters={applyFilters}
        resetFilters={resetFilters}
        setShowFilters={setShowFilters}
        activeFiltersCount={activeFiltersCount}
      />

      <ExpenseSummary
        totalAmount={totalAmount}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
      />

      <ExpenseList
        loading={loading}
        filteredExpenses={filteredExpenses}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        resetFilters={resetFilters}
        activeFiltersCount={activeFiltersCount}
      />
    </div>
  );
} 