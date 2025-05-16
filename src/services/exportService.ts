/* eslint-disable @typescript-eslint/no-unused-vars */
import { Expense } from '@/src/models/expense';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';

export const exportToExcel = async (expenses: Expense[], filename: string) => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Chi tiêu');

    // Add header row
    worksheet.addRow(['Ngày', 'Danh mục', 'Mô tả', 'Số tiền (VND)']);

    // Add data rows
    expenses.forEach(expense => {
        worksheet.addRow([
            expense.date,
            expense.category,
            expense.description,
            expense.amount
        ]);
    });

    // Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `${filename}.xlsx`);
};

export const exportToPDF = async (expenses: Expense[], filename: string) => {
    // Triển khai tương tự với thư viện PDF như jsPDF
};