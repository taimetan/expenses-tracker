'use client';

import { auth } from '@/src/config/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { ReactNode, useEffect, useState } from 'react';
import { AuthContext } from '@/src/contexts/AuthContext';

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
}