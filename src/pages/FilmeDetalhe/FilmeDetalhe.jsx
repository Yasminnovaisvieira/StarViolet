import React from 'react';
import { useParams, Link } from 'react-router-dom';
import './FilmeDetalhe.css';

// Página de Detalhes de um Filme Específico
export default function FilmeDetalhe({ filmes }) {
    // Pega o 'id' da URL
    const { id } = useParams();
    // Encontra o filme correspondente na lista de filmes
    const filme = filmes.find(f => f.id === id);

    // Se o filme não for encontrado (ou não estiver aprovado), mostra mensagem
    if (!filme) return <div className="cartaoPadrao">Filme não encontrado</div>;

    // Renderiza os detalhes completos do filme [cite: 37]
    return (
        <div className="paginaDetalhe cartaoPadrao">
            <div className="colunaPoster">
                <img src={filme.poster} alt={filme.titulo} className="posterDetalhe" />
            </div>
            <div className="colunaInfo">
                <h2 className="tituloDetalhe">
                    {filme.titulo} <span className="anoDetalhe">({filme.ano})</span>
                </h2>
                <p className="sinopseDetalhe">{filme.sinopse}</p>
                <ul className="metaDetalhe">
                    <li><strong>Gênero:</strong> {filme.genero}</li>
                    <li><strong>Diretor:</strong> {filme.diretor}</li>
                    {/* O .join junta o array de atores (se for um) com vírgula */}
                    <li><strong>Atores:</strong> {Array.isArray(filme.atores) ? filme.atores.join(', ') : filme.atores}</li>
                </ul>
                <div className="botoesDetalhe">
                    {/* O Link de Editar agora aponta para a rota de edição correta */}
                    <Link to={`/editar/${filme.id}`} className="botaoEditar">Editar</Link>
                    <Link to="/filmes" className="botaoVoltar">Voltar</Link>
                </div>
            </div>
        </div>
    );
}