// import createContext and useState
import { createContext, useState } from 'react';
// Initiate context
const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
    // Manage theme state
    const [theme, setTheme] = useState('light');
    return (
        <ThemeContext.Provider
            value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export {
    ThemeContext,
    ThemeProvider
}