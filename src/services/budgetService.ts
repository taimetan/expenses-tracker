import { db } from '@/src/config/firebase';
import { Budget } from '@/src/models/budget';
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    doc,
    updateDoc,
    deleteDoc,
    serverTimestamp
} from 'firebase/firestore';

// Thêm ngân sách mới
export const addBudget = async (budget: Budget) => {
    try {
        const docRef = await addDoc(collection(db, 'budgets'), {
            ...budget,
            createdAt: serverTimestamp(), // Sử dụng server timestamp
            updatedAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding budget: ', error);
        throw error;
    }
};

// Lấy tất cả ngân sách của user
export const getBudgets = async (userId: string) => {
    try {
        const q = query(
            collection(db, 'budgets'),
            where('userId', '==', userId)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Budget[];
    } catch (error) {
        console.error('Error getting budgets: ', error);
        throw error;
    }
};

// Cập nhật ngân sách
export const updateBudget = async (budgetId: string, updates: Partial<Budget>) => {
    try {
        const budgetRef = doc(db, 'budgets', budgetId);
        await updateDoc(budgetRef, {
            ...updates,
            updatedAt: serverTimestamp() // Cập nhật thời gian sửa đổi
        });
    } catch (error) {
        console.error('Error updating budget: ', error);
        throw error;
    }
};

// Xóa ngân sách
export const deleteBudget = async (budgetId: string) => {
    try {
        const budgetRef = doc(db, 'budgets', budgetId);
        await deleteDoc(budgetRef);
    } catch (error) {
        console.error('Error deleting budget: ', error);
        throw error;
    }
};

// Lấy ngân sách theo category
export const getBudgetByCategory = async (userId: string, category: string) => {
    try {
        const q = query(
            collection(db, 'budgets'),
            where('userId', '==', userId),
            where('category', '==', category)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Budget[];
    } catch (error) {
        console.error('Error getting budget by category: ', error);
        throw error;
    }
};