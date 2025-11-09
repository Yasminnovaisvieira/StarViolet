/* Importando CSS */
import './Filtro.css';

/* Importando Componente Botão */
import Botao from '../Botao/Botao';

/**
 * @param {object} filtros      Objeto com os valores atuais dos filtros (q, genero, ano, diretor, ator)
 * @param {function} onFiltroChange     Função para atualizar o estado no componente pai
 * @param {object} opcoes       Objeto com os arrays de opções para os selects (generos, anos, diretores, atores)
 */
function Filtro({ filtros, onFiltroChange, opcoes, onLimparFiltros }) {
    
    const renderOptions = (items) => {
        return items.map(item => (
            <option key={item} value={item}>{item}</option>
        ));
    };

    const algumFiltroAtivo = Object.entries(filtros).some(([chave, valor]) => chave !== 'genero' && valor !== '');

    return (
        <div className="containerFiltros cartaoPadrao">
            {/* Busca por Título */}
            <input
                name="q"
                placeholder="Buscar por título..."
                value={filtros.q}
                onChange={onFiltroChange}
                className="filtroInputBusca"
            />
            
            {/* Ano */}
            <select name="ano" value={filtros.ano} onChange={onFiltroChange} className="filtroSelect">
                <option value="">Todos os Anos</option>
                {renderOptions(opcoes.anos)}
            </select>
            
            {/* Diretor */}
            <select name="diretor" value={filtros.diretor} onChange={onFiltroChange} className="filtroSelect">
                <option value="">Todos os Diretores</option>
                {renderOptions(opcoes.diretores)}
            </select>
            
            {/* Atores */}
            <select name="ator" value={filtros.ator} onChange={onFiltroChange} className="filtroSelect">
                <option value="">Todos os Atores</option>
                {renderOptions(opcoes.atores)}
            </select>

            {algumFiltroAtivo && (
                <Botao onClick={onLimparFiltros} classe="botaoLimparFiltro">Limpar Filtros</Botao>
            )}
        </div>
    );
}

export default Filtro;