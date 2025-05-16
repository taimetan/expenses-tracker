/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { useState, useEffect } from 'react';
import ProtectedRoute from '@/src/components/ProtectedRoute';
import IncomeForm from '@/src/components/IncomeForm';
import { getIncomes, deleteIncome } from '@/src/services/incomeService';
import { useAuth } from '@/src/contexts/AuthContext';
import { FaTrash, FaEdit, FaPlus, FaSearch, FaFilter, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { toast } from 'react-hot-toast';
import { Income } from '@/src/models/income';

export default function IncomesPage() {
    const { user } = useAuth();
    const [incomes, setIncomes] = useState<Income[]>([]);
    const [filteredIncomes, setFilteredIncomes] = useState<Income[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    
    // State cho bộ lọc
    const [filters, setFilters] = useState({
        source: '',
        startDate: '',
        endDate: '',
        minAmount: '',
        maxAmount: '',
        searchText: ''
    });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        if (user) {
            fetchIncomes();
        }
    }, [user]);

    const fetchIncomes = async () => {
        try {
            setLoading(true);
            const data = await getIncomes(user!.uid);
            setIncomes(data);
            setFilteredIncomes(data);
        } catch (error) {
            console.error('Error fetching incomes:', error);
            toast.error('Lỗi khi tải dữ liệu thu nhập');
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let result = [...incomes];
        
        if (filters.source) {
            result = result.filter(income => income.source === filters.source);
        }
        
        if (filters.startDate) {
            result = result.filter(income => new Date(income.date) >= new Date(filters.startDate));
        }
        if (filters.endDate) {
            const endDate = new Date(filters.endDate);
            endDate.setDate(endDate.getDate() + 1); // Bao gồm cả ngày kết thúc
            result = result.filter(income => new Date(income.date) <= endDate);
        }
        
        if (filters.minAmount) {
            result = result.filter(income => income.amount >= Number(filters.minAmount));
        }
        if (filters.maxAmount) {
            result = result.filter(income => income.amount <= Number(filters.maxAmount));
        }
        
        if (filters.searchText) {
            const searchText = filters.searchText.toLowerCase();
            result = result.filter(income => 
                income.source.toLowerCase().includes(searchText) ||
                (income.description && income.description.toLowerCase().includes(searchText)) ||
                income.amount.toString().includes(searchText)
            );
        }
        
        setFilteredIncomes(result);
        setCurrentPage(1);
        setShowFilters(false);
    };

    const resetFilters = () => {
        setFilters({
            source: '',
            startDate: '',
            endDate: '',
            minAmount: '',
            maxAmount: '',
            searchText: ''
        });
        setFilteredIncomes(incomes);
        setCurrentPage(1);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Bạn chắc chắn muốn xóa khoản thu nhập này?')) {
            try {
                await deleteIncome(id);
                toast.success('Xóa thu nhập thành công');
                fetchIncomes();
            } catch (error) {
                toast.error('Lỗi khi xóa thu nhập');
            }
        }
    };

    // Tính toán phân trang
    const totalItems = filteredIncomes.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedIncomes = filteredIncomes.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Tính tổng thu nhập
    const totalAmount = filteredIncomes.reduce((sum, income) => sum + income.amount, 0);

    // Các nguồn thu nhập duy nhất cho filter
    const incomeSources = [...new Set(incomes.map(income => income.source))];

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-100">
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="text-gray-600 px-4 py-6 sm:px-0">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Quản Lý Thu Nhập</h1>
                                <p className="text-sm text-gray-600">Theo dõi các nguồn thu nhập của bạn</p>
                            </div>
                            
                            <div className="flex gap-2 w-full sm:w-auto">
                                <button
                                    onClick={() => setShowForm(!showForm)}
                                    className={`flex items-center px-4 py-2 rounded-md ${
                                        showForm ? 'bg-gray-200 text-gray-800' : 'bg-green-600 text-white'
                                    }`}
                                >
                                    <FaPlus className="mr-2" />
                                    {showForm ? 'Đóng' : 'Thêm mới'}
                                </button>
                            </div>
                        </div>

                        {/* Form thêm thu nhập */}
                        {showForm && (
                            <div className="bg-white p-6 rounded-lg shadow mb-6">
                                <IncomeForm 
                                    onSuccess={() => {
                                        fetchIncomes();
                                        setShowForm(false);
                                    }} 
                                />
                            </div>
                        )}

                        {/* Bộ lọc và tìm kiếm */}
                        <div className="bg-white p-6 rounded-lg shadow mb-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                                <h2 className="text-lg font-semibold">Lọc thu nhập</h2>
                                
                                <div className="w-full sm:w-96">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Tìm kiếm thu nhập..."
                                            value={filters.searchText}
                                            onChange={(e) => setFilters({...filters, searchText: e.target.value})}
                                            onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                                            className="w-full pl-10 pr-4 py-2 border rounded-md text-sm"
                                        />
                                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                                        {filters.searchText && (
                                            <button
                                                onClick={() => setFilters({...filters, searchText: ''})}
                                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                            >
                                                <FaTimes size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Panel bộ lọc */}
                            <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 ${showFilters ? 'block' : 'hidden'}`}>
                                {/* Lọc theo nguồn thu */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nguồn thu</label>
                                    <select
                                        value={filters.source}
                                        onChange={(e) => setFilters({...filters, source: e.target.value})}
                                        className="w-full p-2 border rounded-md text-sm"
                                    >
                                        <option value="">Tất cả nguồn</option>
                                        {incomeSources.map(source => (
                                            <option key={source} value={source}>{source}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                {/* Lọc theo khoảng thời gian */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
                                    <input
                                        type="date"
                                        value={filters.startDate}
                                        onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                                        className="w-full p-2 border rounded-md text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
                                    <input
                                        type="date"
                                        value={filters.endDate}
                                        onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                                        className="w-full p-2 border rounded-md text-sm"
                                    />
                                </div>
                                
                                {/* Lọc theo khoảng tiền */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền từ</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={filters.minAmount}
                                        onChange={(e) => setFilters({...filters, minAmount: e.target.value})}
                                        className="w-full p-2 border rounded-md text-sm"
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Đến</label>
                                    <input
                                        type="number"
                                        placeholder="Không giới hạn"
                                        value={filters.maxAmount}
                                        onChange={(e) => setFilters({...filters, maxAmount: e.target.value})}
                                        className="w-full p-2 border rounded-md text-sm"
                                        min="0"
                                    />
                                </div>
                            </div>

                            {/* Nút điều khiển bộ lọc */}
                            <div className="flex justify-between items-center">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                                >
                                    <FaFilter className="mr-1" />
                                    {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
                                </button>
                                
                                <div className="flex gap-2">
                                    <button
                                        onClick={resetFilters}
                                        className="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                                    >
                                        Đặt lại
                                    </button>
                                    <button
                                        onClick={applyFilters}
                                        className="px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                    >
                                        Áp dụng
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Thống kê nhanh */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-white p-4 rounded-lg shadow">
                                <p className="text-sm text-gray-500">Tổng số thu nhập</p>
                                <p className="text-2xl font-bold">{filteredIncomes.length}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow">
                                <p className="text-sm text-gray-500">Tổng số tiền</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {totalAmount.toLocaleString('vi-VN')} VND
                                </p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow">
                                <p className="text-sm text-gray-500">Trung bình mỗi khoản</p>
                                <p className="text-2xl font-bold">
                                    {filteredIncomes.length > 0 
                                        ? Math.round(totalAmount / filteredIncomes.length).toLocaleString('vi-VN') 
                                        : 0} VND
                                </p>
                            </div>
                        </div>

                        {/* Danh sách thu nhập */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                                </div>
                            ) : filteredIncomes.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">
                                        {Object.values(filters).some(f => f) 
                                            ? 'Không tìm thấy thu nhập phù hợp' 
                                            : 'Chưa có thu nhập nào'}
                                    </p>
                                    {Object.values(filters).some(f => f) && (
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
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Ngày
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Nguồn thu
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Mô tả
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Số tiền
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Hành động
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {paginatedIncomes.map((income) => (
                                                    <tr key={income.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {format(new Date(income.date), 'dd/MM/yyyy')}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {income.source}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                                            {income.description || '--'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                                                            +{income.amount.toLocaleString('vi-VN')} VND
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <button
                                                                onClick={() => handleDelete(income.id)}
                                                                className="text-red-600 hover:text-red-900 p-1"
                                                                title="Xóa"
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Phân trang */}
                                    {totalPages > 1 && (
                                        <div className="mt-4 flex flex-col sm:flex-row justify-between items-center border-t pt-4 gap-4">
                                            <div className="text-sm text-gray-700">
                                                Hiển thị {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}-
                                                {Math.min(currentPage * itemsPerPage, totalItems)} / {totalItems} khoản thu
                                            </div>
                                            
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                    disabled={currentPage === 1}
                                                    className={`p-2 rounded-md ${currentPage === 1 ? 
                                                        'text-gray-400 cursor-not-allowed' : 
                                                        'text-gray-700 hover:bg-gray-100'}`}
                                                >
                                                    <FaChevronLeft />
                                                </button>
                                                
                                                <span className="text-sm text-gray-700">
                                                    Trang {currentPage}/{totalPages}
                                                </span>
                                                
                                                <button
                                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                    disabled={currentPage === totalPages}
                                                    className={`p-2 rounded-md ${currentPage === totalPages ? 
                                                        'text-gray-400 cursor-not-allowed' : 
                                                        'text-gray-700 hover:bg-gray-100'}`}
                                                >
                                                    <FaChevronRight />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}