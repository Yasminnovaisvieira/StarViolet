import React from 'react';
import './Filtro.css';


export default function Filtro({ valor, setValor }) {
    return (
        <div className="filtro">
            <input value={valor} onChange={e => setValor(e.target.value)} placeholder="Pesquisar" className="campoFiltro" />
        </div>
    );
}