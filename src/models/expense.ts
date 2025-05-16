export interface Expense {
    id?: string; // ID tự động từ Firestore
    userId: string; // ID người dùng
    amount: number; // Số tiền
    category: string; // Danh mục
    description: string; // Mô tả
    date: string; // Ngày chi tiêu (YYYY-MM-DD)
    createdAt?: Date; // Ngày tạo
}

export const categories = [
    'Ăn uống',
    'Nhà ở',
    'Đi lại',
    'Giải trí',
    'Mua sắm',
    'Y tế',
    'Giáo dục',
    'Tiết kiệm',
    'Hóa đơn',
    'Ngân hàng',
    'Khác'
  ];