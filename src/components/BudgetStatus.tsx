// src/components/BudgetStatus.tsx
'use client';
import { Budget } from '@/src/models/budget';
import { Expense } from '@/src/models/expense';

interface BudgetStatusProps {
    budgets: Budget[];
    expenses: Expense[];
}

export default function BudgetStatus({ budgets, expenses }: BudgetStatusProps) {
    const budgetStatus = budgets.map(budget => {
        const spent = expenses
            .filter(e => e.category === budget.category)
            .reduce((sum, e) => sum + e.amount, 0);

        const remaining = Math.max(0, budget.amount - spent);
        const percentageUsed = Math.min(Math.round((spent / budget.amount) * 100), 100);

        return {
            ...budget,
            spent,
            remaining,
            percentageUsed,
            isOver: spent > budget.amount
        };
    });

    const overBudgets = budgetStatus.filter(b => b.isOver);
    const safeBudgets = budgetStatus.filter(b => !b.isOver);

    return (
        <div className="space-y-6">
            {/* Cảnh báo vượt ngân sách */}
            <div>
                <h3 className="text-gray-600 font-medium mb-2">Cảnh báo ngân sách</h3>
                {overBudgets.length > 0 ? (
                    <ul className="space-y-2">
                        {overBudgets.map(budget => (
                            <li key={budget.id} className="text-red-600">
                                {budget.category}: Đã vượt {(budget.spent - budget.amount).toLocaleString()} VND
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">Không có cảnh báo vượt ngân sách</p>
                )}
            </div>

            {/* Ngân sách còn lại */}
            <div>
                <h3 className="font-medium mb-2">Ngân sách còn lại</h3>
                {safeBudgets.length > 0 ? (
                    <ul className="space-y-2">
                        {safeBudgets.map(budget => (
                            <li key={budget.id}>
                                {budget.category}: Còn {budget.remaining.toLocaleString()} VND ({100 - budget.percentageUsed}%)
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">Không có ngân sách nào</p>
                )}
            </div>
        </div>
    );
}