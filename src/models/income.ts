// src/models/income.ts
export interface Income {
  id: string;
  userId: string;
  amount: number;
  source: string; // Ví dụ: "Lương", "Kinh doanh",...
  date: string; // YYYY-MM-DD
  description?: string;
  createdAt?: Date;
}