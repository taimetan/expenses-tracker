'use client';

interface ExpenseSummaryProps {
  totalAmount: number;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

export default function ExpenseSummary({
  totalAmount,
  currentPage,
  itemsPerPage,
  totalItems,
}: ExpenseSummaryProps) {
  return (
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
          -{Math.min(currentPage * itemsPerPage, totalItems)} / {totalItems} chi
          tiêu
        </span>
      </div>
    </div>
  );
} 