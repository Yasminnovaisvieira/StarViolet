import React from 'react';
import { Routes, Route, NavLink, Link } from 'react-router-dom';
import './Admin.css';

// Componente Interno para a lista de filmes APROVADOS (Gerenciar)
function GerenciarFilmes({ filmes, onDelete }) {
    return (
        <div className="listaAdmin">
            {filmes.map(f => (
                <div className="itemAdmin cartaoPadrao" key={f.id}>
                    <img src={f.poster} alt={f.titulo} className="miniPosterAdmin" />
                    <div className="infoAdmin">
                        <div className="tituloAdmin">{f.titulo}</div>
                        <div className="metaAdmin">{f.ano} • {f.genero}</div>
                    </div>
                    <div className="acoesAdmin">
                        {/* Link para a página de edição */}
                        <Link to={`/editar/${f.id}`} className="botaoEditarAdmin">Editar</Link>
                        {/* Botão para deletar [cite: 32] */}
                        <button onClick={() => onDelete(f.id)} className="botaoExcluir">Excluir</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Componente Interno para a lista de filmes PENDENTES (Aprovar)
function AprovarPendencias({ filmes, onApprove }) {
    return (
        <div className="listaAdmin">
            {filmes.length === 0 && <p>Nenhum filme pendente de aprovação.</p>}
            {filmes.map(f => (
                <div className="itemAdmin cartaoPadrao" key={f.id}>
                    <img src={f.poster} alt={f.titulo} className="miniPosterAdmin" />
                    <div className="infoAdmin">
                        <div className="tituloAdmin">{f.titulo}</div>
                        <div className="metaAdmin">{f.ano} • {f.genero}</div>
                        <div className="statusPendente">Status: Pendente</div>
                    </div>
                    <div className="acoesAdmin">
                        {/* Botão para aprovar o filme  */}
                        <button onClick={() => onApprove(f.id)} className="botaoAprovar">Aprovar</button>
                    </div>
                </div>
            ))}
        </div>
    );
}


// Componente Principal do Painel Admin
export default function Admin({ filmes, onDelete, onApprove }) {
    
    // Separa os filmes entre aprovados e pendentes
    const filmesAprovados = filmes.filter(f => f.status === 'aprovado');
    const filmesPendentes = filmes.filter(f => f.status === 'pendente');

    return (
        <div className="paginaAdmin">
            <div className="cabecalhoAdmin">
                <h3>Painel de Administração</h3>
                {/* Navegação interna do painel (Sub-rotas) */}
                <nav className="navAdmin">
                    <NavLink to="/admin" end>Gerenciar Filmes ({filmesAprovados.length})</NavLink>
                    <NavLink to="/admin/aprovar">Aprovar Pendências ({filmesPendentes.length})</NavLink>
                </nav>
            </div>

            {/* Container para as sub-rotas */}
            <div className="conteudoAdmin">
                <Routes>
                    <Route 
                        index 
                        element={<GerenciarFilmes filmes={filmesAprovados} onDelete={onDelete} />} 
                    />
                    <Route 
                        path="aprovar" 
                        element={<AprovarPendencias filmes={filmesPendentes} onApprove={onApprove} />} 
                    />
                </Routes>
            </div>
        </div>
    );
}