import { useNavigate } from 'react-router-dom';

/* Importando CSS */
import './CartaoFilme.css';

/* Importando Componente Botao */
import Botao from '../Botao/Botao';

function CartaoFilme({ filme }) {
    const navigate = useNavigate();

    /* Ir para os detalhes do Filme */
    const irParaDetalhes = (e) => {
        e.stopPropagation();
        e.preventDefault();
        navigate(`/filmes/${filme.id}`);
    };

    return (
        <div className="cartaoFilme">
            <div className="posterWrapper" >
                <div className="poster" style={{ backgroundImage: `url(${filme.poster})` }} />
            </div>

            <div className="infoCartao">
                <div>
                    <div className="tituloCartao">{filme.titulo}</div>
                    <div className="metaCartao">{filme.ano} • {filme.genero}</div>
                </div>

                <div className="acaoCartao">
                    <Botao onClick={irParaDetalhes} classe="botaoDetalhesCartao"> Ver Detalhes </Botao>
                </div>
            </div>
        </div>
    );
}

export default CartaoFilme;