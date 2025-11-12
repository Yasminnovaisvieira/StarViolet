import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

/* Importando CSS */
import './FilmeDetalhe.css';

/* Importando componentes */
import Botao from '../../components/Botao/Botao';
import Modal from '../../components/Modal/Modal';

function FilmeDetalhe({ filmes, isAdmin, onDelete }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const filme = filmes.find(f => f.id === id);

    /* Estado para controlar o modal */
    const [modal, setModal] = useState({
        isOpen: false,
        type: 'info',
        title: '',
        message: ''
    });

    /* Se o filme não for encontrado, mostra mensagem */
    if (!filme) return <div className="cartaoPadrao">Filme não encontrado</div>;

    const handleExcluirClick = () => {
        setModal({
            isOpen: true,
            type: 'confirm',
            title: 'Confirmar Exclusão',
            message: `Tem certeza que deseja excluir o filme "${filme.titulo}"? Esta ação não pode ser desfeita.`
        });
    };

    const handleConfirmarExcluir = () => {
        try {
            onDelete(filme.id);
            setModal({
                isOpen: true,
                type: 'success',
                title: 'Sucesso!',
                message: 'O filme foi excluído com sucesso.'
            });
        } catch (err) {
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Erro!',
                message: `Ocorreu um erro ao excluir o filme: ${err.message}`
            });
        }
    };

    const handleCloseModal = () => {
        const modalType = modal.type;
        setModal({ isOpen: false, type: 'info', title: '', message: '' });

        if (modalType === 'success') {
            navigate('/filmes');
        }
    };

    return (
        <>
            <div className="paginaDetalhe cartaoPadrao">
                <div className="colunaPoster">
                    <img src={filme.poster} alt={filme.titulo} className="posterDetalhe" />
                </div>
                <div className="colunaInfo">

                    {/* Aviso de Status Pendente */}
                    {filme.status === 'pendente' && (
                        <div className="avisoPendente">
                            Este filme está pendente de aprovação.
                        </div>
                    )}

                    <h2 className="tituloDetalhe">
                        {filme.titulo} <span className="anoDetalhe">({filme.ano})</span>
                    </h2>
                    <p className="sinopseDetalhe"><strong>Sinopse:</strong> {filme.sinopse}</p>
                    <ul className="metaDetalhe">
                        <li><strong>Gênero:</strong> {filme.genero}</li>
                        <li><strong>Diretor:</strong> {filme.diretor}</li>
                        <li><strong>Atores:</strong> {Array.isArray(filme.atores) ? filme.atores.join(', ') : filme.atores}</li>
                    </ul>
                    <div className="botoesDetalhe">
                        <Link to="/filmes" className="botaoVoltar">Voltar</Link>
                        <Link to={`/editar/${filme.id}`} className="botaoEditar">Editar</Link>

                        {/* Botão de Excluir condicional para Admin */}
                        {isAdmin && (
                            <Botao
                                onClick={handleExcluirClick}
                                classe="botaoExcluir"
                                type="button"
                            >
                                Excluir
                            </Botao>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            <Modal
                isOpen={modal.isOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmarExcluir}
                title={modal.title}
                message={modal.message}
                type={modal.type}
            />
        </>
    );
}

export default FilmeDetalhe;