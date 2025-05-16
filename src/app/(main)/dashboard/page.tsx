/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { useAuth } from "@/src/contexts/AuthContext";
import { getExpenses } from "@/src/services/expenseService";
import { getBudgets } from "@/src/services/budgetService";
import { Expense } from "@/src/models/expense";
import { Budget } from "@/src/models/budget";
import { categories } from "@/src/models/expense";
import ExpenseChart from "@/src/components/ExpenseChart";
import BudgetForm from "@/src/components/BudgetForm";
import { exportToExcel } from "@/src/services/exportService";
import {
  FaFileExcel,
  FaChartBar,
  FaMoneyBillWave,
  FaBell,
} from "react-icons/fa";
import {
  format,
  subMonths,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
  parseISO,
} from "date-fns";
import { getIncomes } from "@/src/services/incomeService";
export default function DashboardPage() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">(
    "month"
  );
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, currentMonth]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const expensesData = await getExpenses(user!.uid);
      const budgetsData = await getBudgets(user!.uid);
      setExpenses(expensesData);
      setBudgets(budgetsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    await exportToExcel(
      filterExpensesByTimeRange(expenses, timeRange),
      `bao-cao-chi-tieu-${format(new Date(), "yyyy-MM-dd")}`
    );
  };

  const filterExpensesByTimeRange = (
    expenses: Expense[],
    range: "week" | "month" | "year"
  ) => {
    const now = new Date();
    let startDate: Date, endDate: Date;

    if (range === "week") {
      startDate = subDays(now, 7);
      endDate = now;
    } else if (range === "month") {
      startDate = startOfMonth(currentMonth);
      endDate = endOfMonth(currentMonth);
    } else {
      startDate = startOfYear(currentMonth);
      endDate = endOfYear(currentMonth);
    }

    return expenses.filter((expense) => {
      const expenseDate = parseISO(expense.date);
      return isWithinInterval(expenseDate, { start: startDate, end: endDate });
    });
  };
  const filteredExpenses = filterExpensesByTimeRange(expenses, timeRange);

  // Tính toán các chỉ số
  const totalExpenses = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const avgDailyExpense =
    totalExpenses /
    (timeRange === "week" ? 7 : timeRange === "month" ? 30 : 365);
  const transactionCount = filteredExpenses.length;

  // Phân tích theo danh mục
  const expensesByCategory = categories
    .map((category) => {
      const amount = filteredExpenses
        .filter((expense) => expense.category === category)
        .reduce((sum, expense) => sum + expense.amount, 0);
      return { category, amount };
    })
    .filter((item) => item.amount > 0);

  // Kiểm tra ngân sách
  const budgetAlerts = budgets.map((budget) => {
    const categoryExpenses = filteredExpenses
      .filter((e) => e.category === budget.category)
      .reduce((sum, e) => sum + e.amount, 0);

    return {
      ...budget,
      currentSpending: categoryExpenses,
      isOver: categoryExpenses > budget.amount,
      percentage: Math.min(
        Math.round((categoryExpenses / budget.amount) * 100),
        100
      ),
    };
  });

  const changeMonth = (months: number) => {
    setCurrentMonth(addMonths(currentMonth, months));
  };

  const [monthlyData, setMonthlyData] = useState<
    {
      month: string;
      income: number;
      expenses: number;
      profit: number;
    }[]
  >([]);

  useEffect(() => {
    if (user) {
      fetchMonthlyData();
    }
  }, [user]);

  const fetchMonthlyData = async () => {
    try {
      setLoading(true);

      // Lấy dữ liệu 6 tháng gần nhất
      const months = Array.from({ length: 6 }, (_, i) => {
        const date = subMonths(new Date(), i);
        return {
          start: startOfMonth(date),
          end: endOfMonth(date),
          name: format(date, "MM/yyyy"),
        };
      });

      const [expenses, incomes] = await Promise.all([
        getExpenses(user!.uid),
        getIncomes(user!.uid),
      ]);

      const data = months.map((month) => {
        const monthlyExpenses = expenses
          .filter(
            (e) =>
              new Date(e.date) >= month.start && new Date(e.date) <= month.end
          )
          .reduce((sum, e) => sum + e.amount, 0);

        const monthlyIncome = incomes
          .filter(
            (i) =>
              new Date(i.date) >= month.start && new Date(i.date) <= month.end
          )
          .reduce((sum, i) => sum + i.amount, 0);

        return {
          month: month.name,
          income: monthlyIncome,
          expenses: monthlyExpenses,
          profit: monthlyIncome - monthlyExpenses,
        };
      });

      setMonthlyData(data);
    } finally {
      setLoading(false);
    }
  };
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
        {/* Mobile Header (chỉ hiển thị trên mobile) */}
        <header className="md:hidden bg-white shadow p-4 flex justify-between items-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <div className="w-6"></div> {/* Placeholder để cân bằng layout */}
        </header>
        {/* Sidebar - responsive */}
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
                  className="p-1 rounded-full hover:bg-gray-200"
                >
                  &lt;
                </button>
                <span className="font-medium">
                  {format(currentMonth, "MM/yyyy")}
                </span>
                <button
                  onClick={() => changeMonth(1)}
                  className="p-1 rounded-full hover:bg-gray-200"
                  disabled={
                    format(currentMonth, "MM/yyyy") ===
                    format(new Date(), "MM/yyyy")
                  }
                >
                  &gt;
                </button>
              </div>
            </div>

            {/* Phạm vi thời gian */}
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-500 mb-2">
                PHẠM VI
              </h2>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setTimeRange("week");
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                    timeRange === "week"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  Tuần
                </button>
                <button
                  onClick={() => {
                    setTimeRange("month");
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                    timeRange === "month"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  Tháng
                </button>
                <button
                  onClick={() => {
                    setTimeRange("year");
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                    timeRange === "year"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  Năm
                </button>
              </div>
            </div>

            {/* Nút xuất Excel */}
            <div className="mt-auto">
              <button
                onClick={() => {
                  handleExport();
                  setIsSidebarOpen(false);
                }}
                className="w-full flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
              >
                <FaFileExcel className="mr-2" />
                Xuất Excel
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay cho mobile (chỉ hiển thị khi sidebar mở) */}
        {isSidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <main className="flex-1 max-w-7xl mx-auto w-[90%] py-6 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cột trái - Tổng quan và biểu đồ */}
              <div className="lg:col-span-2 space-y-6">
                {/* Thống kê tổng quan */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center">
                      <FaMoneyBillWave className="text-indigo-600 mr-2" />
                      <h3 className="text-sm font-medium text-gray-500">
                        Tổng chi tiêu
                      </h3>
                    </div>
                    <p className="text-2xl font-bold mt-2 text-red-600">
                      -{totalExpenses.toLocaleString()} VND
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {timeRange === "week"
                        ? "Tuần này"
                        : timeRange === "month"
                        ? "Tháng này"
                        : "Năm này"}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">
                      Chi tiêu trung bình
                    </h3>
                    <p className="text-gray-600 text-2xl font-bold mt-2">
                      {avgDailyExpense.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}{" "}
                      VND
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {timeRange === "week"
                        ? "Mỗi ngày"
                        : timeRange === "month"
                        ? "Mỗi ngày"
                        : "Mỗi tháng"}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">
                      Số giao dịch
                    </h3>
                    <p className="text-gray-600 text-2xl font-bold mt-2">
                      {transactionCount}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {timeRange === "week"
                        ? "Tuần này"
                        : timeRange === "month"
                        ? "Tháng này"
                        : "Năm này"}
                    </p>
                  </div>
                </div>

                {/* Biểu đồ */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-gray-600 text-xl font-semibold mb-4 flex items-center">
                    <FaChartBar className="mr-2 text-indigo-600" />
                    Biểu đồ chi tiêu
                  </h2>
                  <ExpenseChart
                    expenses={filteredExpenses}
                    timeRange={timeRange}
                  />
                </div>

                {/* Phân tích theo danh mục */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-gray-600 text-xl font-semibold mb-4">
                    Chi tiêu theo danh mục
                  </h2>
                  <div className="space-y-4">
                    {expensesByCategory
                      .sort((a, b) => b.amount - a.amount)
                      .map((item) => (
                        <div key={item.category}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">
                              {item.category}
                            </span>
                            <span className="text-sm font-medium text-red-600">
                              -{item.amount.toLocaleString()} VND (
                              {Math.round((item.amount / totalExpenses) * 100)}
                              %)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-indigo-600 h-2.5 rounded-full"
                              style={{
                                width: `${Math.round(
                                  (item.amount / totalExpenses) * 100
                                )}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Cột phải - Ngân sách và cảnh báo */}
              <div className="space-y-6">
                {/* Đặt ngân sách */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-gray-600 text-xl font-semibold mb-4 flex items-center">
                    <FaMoneyBillWave className="mr-2 text-indigo-600" />
                    Đặt ngân sách
                  </h2>
                  <BudgetForm />
                </div>

                {/* Cảnh báo ngân sách */}
                <div className="text-gray-600 bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <FaBell className="mr-2 text-red-600" />
                    Cảnh báo ngân sách
                  </h2>
                  {budgetAlerts.filter((a) => a.isOver).length > 0 ? (
                    <ul className="space-y-3">
                      {budgetAlerts
                        .filter((a) => a.isOver)
                        .sort((a, b) => b.percentage - a.percentage)
                        .map((alert) => (
                          <li
                            key={alert.id}
                            className="p-3 bg-red-50 rounded-lg"
                          >
                            <div className="flex justify-between mb-1">
                              <span className="font-medium">
                                {alert.category}
                              </span>
                              <span className="text-red-600">
                                {alert.percentage}% ngân sách
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-red-600 h-2 rounded-full"
                                style={{ width: `${alert.percentage}%` }}
                              ></div>
                            </div>
                            <p className="text-sm mt-1">
                              Đã chi: {alert.currentSpending.toLocaleString()} /
                              Ngân sách: {alert.amount.toLocaleString()} VND
                            </p>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">
                      Không có cảnh báo vượt ngân sách
                    </p>
                  )}
                </div>

                {/* Ngân sách còn lại */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-gray-600 text-xl font-semibold mb-4">
                    Ngân sách còn lại
                  </h2>
                  {budgetAlerts
                    .filter((a) => !a.isOver)
                    .sort((a, b) => b.percentage - a.percentage)
                    .map((alert) => (
                      <div key={alert.id} className="mb-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-600 text-sm font-medium">
                            {alert.category}
                          </span>
                          <span className="text-gray-600 text-sm">
                            {100 - alert.percentage}% còn lại
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${100 - alert.percentage}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Đã chi {alert.percentage}% (
                          {alert.currentSpending.toLocaleString()}/
                          {alert.amount.toLocaleString()} VND)
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </main>
        {/* Phần lợi nhuận hàng tháng */}
        <div className="text-gray-600 bg-white p-6 rounded-lg shadow col-span-2">
          <h2 className="text-xl font-semibold mb-4">Lợi nhuận hàng tháng</h2>
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tháng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thu nhập
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Chi tiêu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lợi nhuận
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {monthlyData.map((data) => (
                    <tr key={data.month}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {data.month}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                        +{data.income.toLocaleString()} VND
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                        -{data.expenses.toLocaleString()} VND
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                          data.profit >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {data.profit >= 0 ? "+" : ""}
                        {data.profit.toLocaleString()} VND
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

// Helper functions
function addMonths(date: Date, months: number) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function startOfYear(date: Date) {
  return new Date(date.getFullYear(), 0, 1);
}

function endOfYear(date: Date) {
  return new Date(date.getFullYear(), 11, 31, 23, 59, 59);
}

function subDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}
