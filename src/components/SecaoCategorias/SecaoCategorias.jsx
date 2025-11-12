import { useRef } from 'react'; // Importe o useRef

/* Importando CSS */
import './SecaoCategorias.css';

/* Importando Componente CartaoCategoria */
import CartaoCategoria from '../CartaoCategoria/CartaoCategoria';

function SecaoCategorias({ titulo, categorias, onTodosClick }) {
    
    const scrollRef = useRef(null);
    
    if (!categorias || categorias.length === 0) return null;
    
    const tituloId = `titulo-${titulo.toLowerCase().replace(/\s+/g, '-')}`;

    const scroll = (direction) => {
        const scrollAmount = (180 + 24) * 3;

        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="secaoCategorias" aria-labelledby={tituloId}>
            <h2 id={tituloId} className="tituloSecao">{titulo}</h2>
            
            <div className="containerCarrosselManual">
                
                <button 
                    className="botaoScroll scrollEsquerda" 
                    onClick={() => scroll('left')}
                    aria-label="Rolar para esquerda"
                >
                    ‹
                </button>

                <div className="listaHorizontalCategorias" ref={scrollRef}> 
                    {categorias.map((categoria) => (
                        <div className="itemListaCategoria" key={categoria.nome}>
                            <CartaoCategoria categoria={categoria} onClick={categoria.nome === 'Todos' ? onTodosClick : null}/>
                        </div>
                    ))}
                </div>
                
                <button 
                    className="botaoScroll scrollDireita" 
                    onClick={() => scroll('right')}
                    aria-label="Rolar para direita"
                >
                    ›
                </button>

            </div>
        </section>
    );
}

export default SecaoCategorias;