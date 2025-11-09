/* Importando CSS */
import './SecaoFilmes.css';

/* Importando Componente CartaoFilme */
import CartaoFilme from '../CartaoFilme/CartaoFilme';

function SecaoFilmes({ titulo, filmes }) {
    /* Não renderiza a seção se não houver filmes */
    if (!filmes || filmes.length === 0) return null;

    const tituloId = `titulo-${titulo.toLowerCase().replace(/\s+/g, '-')}`;

    return (
        <section className="secaoFilmes" aria-labelledby={tituloId}>
            
            {/* Título da seção */}
            <h2 id={tituloId} className="tituloSecao">{titulo}</h2>
            
            {/* Lista horizontal que permite scroll */}
            <div className="listaHorizontal">
                {filmes.map(filme => (
                    <div className="itemLista" key={filme.id}> <CartaoFilme filme={filme} /> </div>
                ))}
            </div>
        </section>
    );
}

export default SecaoFilmes;