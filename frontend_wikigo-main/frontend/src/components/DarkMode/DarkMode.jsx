import React, { useState, useEffect } from "react";
import "./DarkMode.css";

const DarkMode = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Verifica o tema atual no carregamento do componente
        return document.body.getAttribute('data-theme') === 'dark';
    });

    // Efeito para aplicar o tema baseado no estado
    useEffect(() => {
        document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);  // Alterna o estado
    };

    return (
        <div className='dark_mode'>
            <input
                className='dark_mode_input'
                type='checkbox'
                id='darkmode-toggle'
                onChange={toggleTheme}
                checked={isDarkMode}  // Controla o estado do checkbox com o estado do React
            />
            <label className='dark_mode_label' htmlFor='darkmode-toggle' />

        </div>
    );
};

export default DarkMode;
