// src/services/incomeService.ts
import { db } from '@/src/config/firebase';
import { Income } from '@/src/models/income';
import { 
    collection, 
    addDoc, 
    getDocs, 
    query, 
    where, 
    doc, 
    deleteDoc,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';

export const addIncome = async (income: Omit<Income, 'id'>) => {
    try {
        const docRef = await addDoc(collection(db, 'incomes'), {
            ...income,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding income:', error);
        throw error;
    }
};

export const getIncomes = async (userId: string) => {
    try {
        const q = query(
            collection(db, 'incomes'),
            where('userId', '==', userId),
            orderBy('date', 'desc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Income[];
    } catch (error) {
        console.error('Error getting incomes:', error);
        throw error;
    }
};

export const deleteIncome = async (id: string) => {
    try {
        await deleteDoc(doc(db, 'incomes', id));
    } catch (error) {
        console.error('Error deleting income:', error);
        throw error;
    }
};