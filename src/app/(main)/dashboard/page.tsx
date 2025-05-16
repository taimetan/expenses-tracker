/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { useAuth } from "@/src/contexts/AuthContext";
import { getExpenses } from "@/src/services/expenseService";
import { getBudgets } from "@/src/services/budgetService";
import { getIncomes } from "@/src/services/incomeService";
import { Expense } from "@/src/models/expense";
import { Budget } from "@/src/models/budget";
import { categories } from "@/src/models/expense";
import { exportToExcel } from "@/src/services/exportService";
import {
  format,
  subMonths,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
  parseISO,
} from "date-fns";
import DashboardHeader from "@/src/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/src/components/dashboard/DashboardSidebar";
import DashboardStats from "@/src/components/dashboard/DashboardStats";
import DashboardCharts from "@/src/components/dashboard/DashboardCharts";
import DashboardBudgets from "@/src/components/dashboard/DashboardBudgets";
import DashboardProfitTable from "@/src/components/dashboard/DashboardProfitTable";

export default function DashboardPage() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
      fetchData();
      fetchMonthlyData();
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

  const fetchMonthlyData = async () => {
    try {
      setLoading(true);
      const months = Array.from({ length: 6 }, (_, i) => {
        const date = subMonths(new Date(), i);
        return {
          start: startOfMonth(date),
          end: endOfMonth(date),
          name: format(date, "MM/yyyy"),
        };
      });

      console.log('Months to fetch:', months);

      const [expenses, incomes] = await Promise.all([
        getExpenses(user!.uid),
        getIncomes(user!.uid),
      ]);

      console.log('Fetched data:', { expenses, incomes });

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

        const monthData = {
          month: month.name,
          income: monthlyIncome,
          expenses: monthlyExpenses,
          profit: monthlyIncome - monthlyExpenses,
        };

        console.log(`Data for month ${month.name}:`, monthData);
        return monthData;
      });

      console.log('Final monthly data:', data);
      setMonthlyData(data);
    } catch (error) {
      console.error('Error in fetchMonthlyData:', error);
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

  const changeMonth = (months: number) => {
    setCurrentMonth(addMonths(currentMonth, months));
  };

  const filteredExpenses = filterExpensesByTimeRange(expenses, timeRange);
  const totalExpenses = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const avgDailyExpense =
    totalExpenses /
    (timeRange === "week" ? 7 : timeRange === "month" ? 30 : 365);
  const transactionCount = filteredExpenses.length;

  const expensesByCategory = categories
    .map((category) => {
      const amount = filteredExpenses
        .filter((expense) => expense.category === category)
        .reduce((sum, expense) => sum + expense.amount, 0);
      return { category, amount };
    })
    .filter((item) => item.amount > 0);

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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
        <DashboardHeader
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <DashboardSidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          currentMonth={currentMonth}
          changeMonth={changeMonth}
        />

        <main className="flex-1 p-6">
          <DashboardStats
            totalExpenses={totalExpenses}
            avgDailyExpense={avgDailyExpense}
            transactionCount={transactionCount}
          />

          <DashboardCharts
            monthlyData={monthlyData}
            expensesByCategory={expensesByCategory}
            handleExport={handleExport}
          />

          <DashboardBudgets budgetAlerts={budgetAlerts} />

          <DashboardProfitTable 
            monthlyData={monthlyData}
            loading={loading}
          />
        </main>
      </div>
    </ProtectedRoute>
  );
}

function addMonths(date: Date, months: number) {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
}

function startOfYear(date: Date) {
  return new Date(date.getFullYear(), 0, 1);
}

function endOfYear(date: Date) {
  return new Date(date.getFullYear(), 11, 31);
}

function subDays(date: Date, days: number) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() - days);
  return newDate;
}
