/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState, useMemo } from "react";
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
  addMonths,
  startOfYear,
  endOfYear,
  subDays,
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
      const months = Array.from({ length: 6 }, (_, i) => {
        const date = subMonths(new Date(), i);
        return {
          start: startOfMonth(date),
          end: endOfMonth(date),
          name: format(date, "MM/yyyy"),
        };
      }).reverse();

      const [expensesData, incomesData] = await Promise.all([
        getExpenses(user!.uid),
        getIncomes(user!.uid),
      ]);

      const data = months.map((month) => {
        const monthlyExpenses = expensesData
          .filter((e) => {
            const expenseDate = parseISO(e.date);
            return isWithinInterval(expenseDate, { 
              start: month.start, 
              end: month.end 
            });
          })
          .reduce((sum, e) => sum + e.amount, 0);

        const monthlyIncome = incomesData
          .filter((i) => {
            const incomeDate = parseISO(i.date);
            return isWithinInterval(incomeDate, { 
              start: month.start, 
              end: month.end 
            });
          })
          .reduce((sum, i) => sum + i.amount, 0);

        return {
          month: month.name,
          income: monthlyIncome,
          expenses: monthlyExpenses,
          profit: monthlyIncome - monthlyExpenses,
        };
      });

      setMonthlyData(data);
    } catch (error) {
      console.error("Error fetching monthly data:", error);
    }
  };

  const handleExport = async () => {
    try {
      // Chuẩn bị dữ liệu xuất Excel
      const exportData = expensesByDay.map(item => ({
        'Ngày': item.name,
        'Chi tiêu': item.amount
      }));

      // Thêm dòng tổng cộng
      const total = expensesByDay.reduce((sum, item) => sum + item.amount, 0);
      exportData.push({
        'Ngày': 'Tổng cộng',
        'Chi tiêu': total
      });

      await exportToExcel(
        exportData,
        `chi-tieu-hang-ngay-${format(currentMonth, "MM-yyyy")}`
      );
    } catch (error) {
      console.error("Error exporting data:", error);
    }
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

  // Group expenses by day
  const expensesByDay = useMemo(() => {
    const dailyExpenses = new Map<string, number>();
    
    filteredExpenses.forEach((expense) => {
      const day = format(parseISO(expense.date), 'dd/MM');
      const currentAmount = dailyExpenses.get(day) || 0;
      dailyExpenses.set(day, currentAmount + expense.amount);
    });

    // Convert to array and sort by date
    return Array.from(dailyExpenses.entries())
      .map(([day, amount]) => ({ name: day, amount }))
      .sort((a, b) => {
        const [dayA, monthA] = a.name.split('/').map(Number);
        const [dayB, monthB] = b.name.split('/').map(Number);
        if (monthA !== monthB) return monthA - monthB;
        return dayA - dayB;
      });
  }, [filteredExpenses]);

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
            expensesByDay={expensesByDay}
            onExport={handleExport}
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
