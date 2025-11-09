import React from 'react';
import { Link } from 'react-router-dom';
import './CartaoFilme.css';

// Componente reutilizável para mostrar um filme em formato de card
// É um link que leva para a página de detalhes do filme
export default function CartaoFilme({ filme }) {
    return (
        <Link to={`/filmes/${filme.id}`} className="cartaoFilme">
            <div className="poster" style={{ backgroundImage: `url(${filme.poster})` }} />
            <div className="infoCartao">
                <div className="tituloCartao">{filme.titulo}</div>
                <div className="metaCartao">{filme.ano} • {filme.genero}</div>
            </div>
        </Link>
    );
}