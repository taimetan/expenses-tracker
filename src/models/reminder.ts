export interface Reminder {
    id?: string;
    userId: string;
    title: string;
    amount: number;
    category: string;
    dueDate: string; // YYYY-MM-DD
    isPaid: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }