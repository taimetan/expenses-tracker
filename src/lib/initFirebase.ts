import { auth } from '@/src/config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export const testFirebaseConnection = async () => {
    try {
        // Thử đăng nhập với test account
        const userCredential = await signInWithEmailAndPassword(
            auth,
            'test@example.com',
            'password123'
        );
        console.log('Kết nối Firebase thành công!', userCredential.user);
        return true;
    } catch (error) {
        console.error('Lỗi kết nối Firebase:', error);
        return false;
    }
};