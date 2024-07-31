import { createContext, useState } from 'react';

export const AppContext = createContext({});

export const AuthContext = ({ children }) => {
    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('userData')))
    const [curentWarehouse, setCurentWarehouse] = useState(JSON.parse(localStorage.getItem('userData'))?.data.warehouse[0])

    return (
        <AppContext.Provider value={{ userData, setUserData, curentWarehouse, setCurentWarehouse }}>
            {children}
        </AppContext.Provider>
    )
}
