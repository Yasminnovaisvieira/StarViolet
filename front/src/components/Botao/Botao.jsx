/* Importando CSS */
import './Botao.css';

function Botao({ onClick, children, classe, type = 'button', width }) {
    
    const estilo = width ? { width: width } : {};

    return (
        <button
            type={type}
            /* Aplica uma classe padrão, caso não venha outra do componente pai */
            className={`botaoPadrao ${classe || ''}`} 
            onClick={onClick}
            style={estilo}
        >
            {children}
        </button>
    );
}

export default Botao;