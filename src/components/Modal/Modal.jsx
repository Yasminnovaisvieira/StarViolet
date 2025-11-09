/* Importando CSS */
import './Modal.css';

/* Importando Componente Botao */
import Botao from '../Botao/Botao';

/**
 * @param {boolean} isOpen      Controla a visibilidade do modal
 * @param {function} onClose        Função chamada ao fechar
 * @param {function} onConfirm      Função chamada ao clicar em 'Confirmar'.
 * @param {string} title    Título do modal.
 * @param {string} message      Mensagem principal.
 * @param {'success' | 'error' | 'confirm' | 'info'} type       Tipo de modal, que afeta o estilo e os botões.
 */
function Modal({ isOpen, onClose, onConfirm, title, message, type = 'info' }) {
    
    if (!isOpen) return null;

    const classeTipoModal = `modalCabecalho ${type}`; 
    const mostrarBotaoConfirmar = type === 'confirm';

    return (
        /* Fundo escuro */
        <div className="modalFundo" onClick={onClose}>
            
            <div className="modalConteudo" onClick={e => e.stopPropagation()}>
                
                {/* Cabeçalho com cor baseada no 'type' */}
                <div className={classeTipoModal}>
                    <h3 className="modalTitulo">{title}</h3>
                    <button className="modalBotaoFechar" onClick={onClose}>&times;</button>
                </div>
                
                {/* mensagem */}
                <div className="modalCorpo">
                    <p>{message}</p>
                </div>
                
                {/* Rodapé */}
                <div className="modalRodape">
                    {mostrarBotaoConfirmar && (
                        <Botao onClick={onClose} classe="botaoModalCancelar"> Cancelar </Botao>
                    )}
                    
                    <Botao onClick={mostrarBotaoConfirmar ? onConfirm : onClose} classe={`botaoModalConfirmar ${type}`}> {mostrarBotaoConfirmar ? 'Confirmar' : 'OK'}</Botao>
                </div>

            </div>
        </div>
    );
}

export default Modal;