'use client';

interface DashboardProfitTableProps {
  monthlyData: {
    month: string;
    income: number;
    expenses: number;
    profit: number;
  }[];
  loading: boolean;
}

export default function DashboardProfitTable({
  monthlyData,
  loading,
}: DashboardProfitTableProps) {
  if (loading) {
    return (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Lợi nhuận hàng tháng
      </h2>
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
                  +{data.income.toLocaleString('vi-VN')} VND
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                  -{data.expenses.toLocaleString('vi-VN')} VND
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    data.profit >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {data.profit >= 0 ? '+' : ''}
                  {data.profit.toLocaleString('vi-VN')} VND
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 