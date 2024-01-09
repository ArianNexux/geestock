import { createContext, useState } from 'react';

export const AppContext = createContext({});

export const AuthContext = ({ children }) => {
    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('userData')))

    return (
        <AppContext.Provider value={{ userData, setUserData }}>
            {children}
        </AppContext.Provider>
    )
}
