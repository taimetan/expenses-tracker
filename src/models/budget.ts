export interface Budget {
    id?: string;
    userId: string;
    category: string;
    amount: number;
    period: 'daily' | 'weekly' | 'monthly' | 'yearly';
    createdAt?: Date;
  }