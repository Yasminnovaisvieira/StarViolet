import React, { useState, useMemo } from 'react';
import CartaoFilme from '../../components/CartaoFilme/CartaoFilme';
import './ListaFilme.css';

// Página de Listagem e Busca de Filmes
export default function ListaFilmes({ filmes }) {
    // Estados para os filtros
    const [q, setQ] = useState(''); // Filtro de busca por título [cite: 25]
    const [genero, setGenero] = useState(''); // Filtro por gênero 
    const [ano, setAno] = useState(''); // Filtro por ano 

    // Gera as listas de opções para os filtros, usando useMemo para performance
    // Isso evita recalcular a cada renderização, só quando 'filmes' mudar
    const generos = useMemo(() => [...new Set(filmes.map(f => f.genero))], [filmes]);
    const anos = useMemo(() => [...new Set(filmes.map(f => f.ano))], [filmes]);

    // Lógica de filtragem
    const filtrados = filmes.filter(f => {
        // 1. Filtra por título
        const buscaTitulo = f.titulo.toLowerCase().includes(q.toLowerCase());
        // 2. Filtra por gênero (se um gênero estiver selecionado)
        const buscaGenero = genero ? f.genero === genero : true;
        // 3. Filtra por ano (se um ano estiver selecionado)
        const buscaAno = ano ? f.ano === ano : true;
        
        return buscaTitulo && buscaGenero && buscaAno;
    });

    return (
        <div className="paginaLista">
            {/* Área de Filtros */}
            <div className="areaFiltros cartaoPadrao">
                <input 
                    placeholder="Buscar por título..." 
                    value={q} 
                    onChange={e => setQ(e.target.value)} 
                    className="campoBusca" 
                />
                <select value={genero} onChange={e => setGenero(e.target.value)} className="campoSelect">
                    <option value="">Todos os Gêneros</option>
                    {generos.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                <select value={ano} onChange={e => setAno(e.target.value)} className="campoSelect">
                    <option value="">Todos os Anos</option>
                    {anos.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
            </div>

            {/* Grade de Filmes */}
            <div className="gradeLista">
                {filtrados.length > 0 ? (
                    filtrados.map(f => <CartaoFilme key={f.id} filme={f} />)
                ) : (
                    <p>Nenhum filme encontrado com esses filtros.</p>
                )}
            </div>
        </div>
    );
}