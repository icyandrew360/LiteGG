import { createContext, useState, useContext, ReactNode } from 'react';

interface UserContextType {
    currentUser: string;
    userInfo: any;
    setCurrentUser: (user: string) => void;
    setUserInfo: (info: any) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<string>('');
    const [userInfo, setUserInfo] = useState<any>(null);

    return (
        <UserContext.Provider value={{ currentUser, userInfo, setCurrentUser, setUserInfo }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
