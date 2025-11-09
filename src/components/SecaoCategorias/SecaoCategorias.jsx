/* Importando CSS */
import './SecaoCategorias.css';

/* Importando Componente CartaoCategoria */
import CartaoCategoria from '../CartaoCategoria/CartaoCategoria';

function SecaoCategorias({ titulo, categorias, onTodosClick }) {
    
    if (!categorias || categorias.length === 0) return null;
    
    const tituloId = `titulo-${titulo.toLowerCase().replace(/\s+/g, '-')}`;

    return (
        <section className="secaoCategorias" aria-labelledby={tituloId}>
            <h2 id={tituloId} className="tituloSecao">{titulo}</h2>
            
            <div className="listaHorizontalCategorias"> 
                {categorias.map((categoria) => (
                    <div className="itemListaCategoria" key={categoria.nome}>
                        <CartaoCategoria categoria={categoria} onClick={categoria.nome === 'Todos' ? onTodosClick : null}/>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default SecaoCategorias;