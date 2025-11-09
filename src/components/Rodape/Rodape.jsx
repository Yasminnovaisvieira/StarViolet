import React from 'react';
import './Rodape.css';

// Componente do Rodapé
export default function Rodape() {
    return (
        <footer className="rodape">
            <div className="rodapeInterno containerInterno">
                {/* Mostra o ano atual dinamicamente */}
                <div>© {new Date().getFullYear()} Filminis</div>
                <div className="linksRodape">Ajuda • Termos • Privacidade</div>
            </div>
        </footer>
    );
}