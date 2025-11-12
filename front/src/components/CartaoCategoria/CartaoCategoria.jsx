import { Link } from 'react-router-dom';

/* Importando CSS */
import './CartaoCategoria.css';

function CartaoCategoria({ categoria, onClick }) {

    if (onClick) {
        return (
            <button type="button" className="cartaoCategoria" style={{ backgroundImage: `url(${categoria.imagem})` }} onClick={onClick} aria-label="Ver todos os filmes">
                <div className="peliculaCategoria"></div>
                <h3 className="tituloCategoria">{categoria.nome}</h3>
            </button>
        );
    }

    return (
        <Link to="/filmes" className="cartaoCategoria" state={{ genero: categoria.nome }} style={{ backgroundImage: `url(${categoria.imagem})` }} aria-label={`Ver filmes de ${categoria.nome}`}>
            <div className="peliculaCategoria"></div>
            <h3 className="tituloCategoria">{categoria.nome}</h3>
        </Link>
    );
}

export default CartaoCategoria;