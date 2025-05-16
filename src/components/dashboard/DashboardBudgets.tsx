'use client';

import { FaBell } from 'react-icons/fa';
import { Budget } from '@/src/models/budget';

interface DashboardBudgetsProps {
  budgetAlerts: (Budget & {
    currentSpending: number;
    isOver: boolean;
    percentage: number;
  })[];
}

export default function DashboardBudgets({
  budgetAlerts,
}: DashboardBudgetsProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center mb-4">
        <FaBell className="text-yellow-500 mr-2" />
        <h2 className="text-lg font-semibold text-gray-900">
          Cảnh báo ngân sách
        </h2>
      </div>

      <div className="space-y-4">
        {budgetAlerts.map((budget) => (
          <div
            key={budget.id}
            className={`p-4 rounded-lg ${
              budget.isOver ? "bg-red-50" : "bg-gray-50"
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium text-gray-900">
                  {budget.category}
                </h3>
                <p className="text-sm text-gray-500">
                  {budget.currentSpending.toLocaleString("vi-VN")} /{" "}
                  {budget.amount.toLocaleString("vi-VN")} VND
                </p>
              </div>
              <span
                className={`px-2 py-1 text-sm rounded ${
                  budget.isOver
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {budget.percentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${
                  budget.isOver ? "bg-red-600" : "bg-green-600"
                }`}
                style={{ width: `${budget.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 