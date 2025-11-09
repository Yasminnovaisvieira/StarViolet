import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
// Importa os estilos globais e as variáveis
import './style/global.css';

// Renderiza o componente principal (App) na div #root
createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);