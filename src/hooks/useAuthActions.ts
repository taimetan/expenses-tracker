/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { auth } from '@/src/config/firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updateProfile,
    UserCredential,
} from 'firebase/auth';
import { toast } from 'react-hot-toast';

export function useAuthActions() {
    const register = async (
        email: string,
        password: string,
        displayName: string
    ): Promise<UserCredential | null> => {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            await updateProfile(userCredential.user, { displayName });
            toast.success('Đăng ký thành công!');
            return userCredential;
        } catch (error: any) {
            toast.error(`Lỗi đăng ký: ${error.message}`);
            return null;
        }
    };

    const login = async (
        email: string,
        password: string
    ): Promise<UserCredential | null> => {
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            toast.success('Đăng nhập thành công!');
            return userCredential;
        } catch (error: any) {
            toast.error(`Lỗi đăng nhập: ${error.message}`);
            return null;
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await signOut(auth);
            toast.success('Đăng xuất thành công!');
        } catch (error: any) {
            toast.error(`Lỗi đăng xuất: ${error.message}`);
        }
    };

    const resetPassword = async (email: string): Promise<void> => {
        try {
            await sendPasswordResetEmail(auth, email);
            toast.success('Email đặt lại mật khẩu đã được gửi!');
        } catch (error: any) {
            toast.error(`Lỗi gửi email: ${error.message}`);
        }
    };

    return { register, login, logout, resetPassword };
}