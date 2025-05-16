import { db } from '@/src/config/firebase';
import { Reminder } from '@/src/models/reminder';
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    doc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    orderBy
} from 'firebase/firestore';

/**
 * Thêm reminder mới
 */
export const addReminder = async (reminder: Reminder) => {
    try {
        const docRef = await addDoc(collection(db, 'reminders'), {
            ...reminder,
            isPaid: false,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding reminder: ', error);
        throw error;
    }
};

/**
 * Lấy tất cả reminders của user
 */
export const getReminders = async (userId: string) => {
    try {
        const q = query(
            collection(db, 'reminders'),
            where('userId', '==', userId),
            orderBy('dueDate', 'asc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Reminder[];
    } catch (error) {
        console.error('Error getting reminders: ', error);
        throw error;
    }
};

/**
 * Cập nhật reminder
 */
export const updateReminder = async (reminderId: string, updates: Partial<Reminder>) => {
    try {
        const reminderRef = doc(db, 'reminders', reminderId);
        await updateDoc(reminderRef, {
            ...updates,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Error updating reminder: ', error);
        throw error;
    }
};

/**
 * Xóa reminder
 */
export const deleteReminder = async (reminderId: string) => {
    try {
        const reminderRef = doc(db, 'reminders', reminderId);
        await deleteDoc(reminderRef);
    } catch (error) {
        console.error('Error deleting reminder: ', error);
        throw error;
    }
};

/**
 * Đánh dấu reminder đã thanh toán
 */
export const markAsPaid = async (reminderId: string) => {
    try {
        const reminderRef = doc(db, 'reminders', reminderId);
        await updateDoc(reminderRef, {
            isPaid: true,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Error marking reminder as paid: ', error);
        throw error;
    }
};

/**
 * Lấy reminders sắp đến hạn (trong 7 ngày tới)
 */
export const getUpcomingReminders = async (userId: string) => {
    try {
        const now = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(now.getDate() + 7);

        const q = query(
            collection(db, 'reminders'),
            where('userId', '==', userId),
            where('dueDate', '>=', now.toISOString().split('T')[0]),
            where('dueDate', '<=', nextWeek.toISOString().split('T')[0]),
            where('isPaid', '==', false),
            orderBy('dueDate', 'asc')
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Reminder[];
    } catch (error) {
        console.error('Error getting upcoming reminders: ', error);
        throw error;
    }
};