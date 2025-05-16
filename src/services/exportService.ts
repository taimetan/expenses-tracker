/* eslint-disable @typescript-eslint/no-unused-vars */
import { Expense } from '@/src/models/expense';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const exportToExcel = async (data: any[], filename: string) => {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    
    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Save file
    saveAs(blob, `${filename}.xlsx`);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw error;
  }
};

export const exportToPDF = async (expenses: Expense[], filename: string) => {
    // Triển khai tương tự với thư viện PDF như jsPDF
};