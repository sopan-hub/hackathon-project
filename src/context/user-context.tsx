
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
    firstName: string;
    lastName: string;
    email: string;
    isLoggedIn: boolean;
}

interface UserContextType {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>({
        firstName: 'Alex',
        lastName: 'Doe',
        email: 'alex.doe@example.com',
        isLoggedIn: false
    });

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
