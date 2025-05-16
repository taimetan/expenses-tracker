import { db } from '@/src/config/firebase';
import { Expense } from '@/src/models/expense';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export const addExpense = async (expense: Expense) => {
    try {
        const docRef = await addDoc(collection(db, 'expenses'), {
            ...expense,
            userId: expense.userId, // Đảm bảo có userId
            createdAt: new Date()
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding expense: ', error);
        throw error;
    }
  };

export const getExpenses = async (userId: string) => {
    try {
        const q = query(collection(db, 'expenses'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Expense[];
    } catch (error) {
        console.error('Error getting expenses: ', error);
        throw error;
    }
};

export const updateExpense = async (id: string, expense: Partial<Expense>) => {
    try {
        await updateDoc(doc(db, 'expenses', id), expense);
    } catch (error) {
        console.error('Error updating expense: ', error);
        throw error;
    }
};

export const deleteExpense = async (id: string) => {
    try {
        await deleteDoc(doc(db, 'expenses', id));
    } catch (error) {
        console.error('Error deleting expense: ', error);
        throw error;
    }
};