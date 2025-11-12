import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

/* Importando CSS */
import './Editar.css';

/* Importando Modal e Botao */
import Modal from '../../components/Modal/Modal';
import Botao from '../../components/Botao/Botao';

/* Lista de gêneros para o select */
const generosLista = [
    'Ficção', 'Drama', 'Romance', 'Terror', 'Aventura', 'Fantasia', 'Suspense', 'Comédia'
];

function Editar({ filmes, onEdit, isAdmin = false }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const filmeOriginal = filmes.find(f => f.id === id);

    /* Iniciando com os dados do Filme */
    const [form, setForm] = useState(filmeOriginal || {});

    const [modal, setModal] = useState({
        isOpen: false,
        type: 'info',
        title: '',
        message: ''
    });

    /* Atualiza o formulário se o filme for encontrado (após a renderização) */
    useEffect(() => {
        if (filmeOriginal) setForm(filmeOriginal);
    }, [filmeOriginal]);

    /* Se o filme não existir, mostra mensagem */
    if (!filmeOriginal) return <div className="cartaoPadrao">Filme não encontrado</div>;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const validarForm = () => {
        if (!form.titulo || !form.ano || !form.genero) {
            setModal({ isOpen: true, type: 'error', title: 'Erro de Validação', message: 'Título, Ano e Gênero são campos obrigatórios.' });
            return false;
        }
        return true;
    };

    const submit = (e) => {
        e.preventDefault();
        if (!validarForm()) return;

        onEdit(id, form);

        /* Mensagem de sucesso condicional */
        const mensagem = isAdmin
            ? 'As alterações foram salvas com sucesso.'
            : 'As alterações foram salvas e aguardam aprovação do administrador.';

        setModal({
            isOpen: true,
            type: 'success',
            title: 'Filme Atualizado!',
            message: mensagem
        });
    };

    /* Para navegar após o sucesso */
    const handleCloseModal = () => {
        const modalType = modal.type;

        /* Fecha o modal */
        setModal({ isOpen: false, type: 'info', title: '', message: '' });

        /* Se o modal que fechamos era o de 'sucesso', navega para a página de detalhes */
        if (modalType === 'success') {
            navigate(`/filmes/${id}`);
        }
    };

    return (
        <div className='formulario'>
            <form onSubmit={submit} className="formFilme cartaoPadrao">
                <h3 className='tituloFormulario'>Editar filme: {filmeOriginal.titulo}</h3>

                <div className="gridCampos">
                    <div className='ladoALado'>
                        <div className="campoMetade">
                            <label htmlFor="titulo">Título *</label>
                            <input id="titulo" name="titulo" placeholder="Ex: Duna: Parte 2" value={form.titulo} onChange={handleChange} />
                        </div>

                        <div className="campoMetade">
                            <label htmlFor="ano">Ano *</label>
                            <input id="ano" name="ano" placeholder="Ex: 2024" value={form.ano} onChange={handleChange} />
                        </div>
                    </div>

                    <div className='ladoALado'>
                        <div className="campoMetade">
                            <label htmlFor="genero">Gênero *</label>
                            <select id="genero" name="genero" value={form.genero} onChange={handleChange}>
                                <option value="">Selecione</option>
                                {generosLista.map(g => (
                                    <option key={g} value={g}>{g}</option>
                                ))}
                            </select>
                        </div>

                        <div className="campoMetade">
                            <label htmlFor="diretor">Diretor</label>
                            <input id="diretor" name="diretor" placeholder="Ex: Denis Villeneuve" value={form.diretor} onChange={handleChange} />
                        </div>
                    </div>

                    <div className='ladoALado'>
                        <div className="campoMetade">
                            <label htmlFor="atores">Atores (separados por vírgula)</label>
                            <input id="atores" name="atores" placeholder="Ex: Timothée Chalamet, Zendaya" value={form.atores} onChange={handleChange} />
                        </div>

                        <div className="campoMetade">
                            <label htmlFor="poster">URL do poster</label>
                            <input id="poster" name="poster" placeholder="http://..." value={form.poster} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="campoFullWidth">
                        <label htmlFor="sinopse">Sinopse</label>
                        <textarea id="sinopse" name="sinopse" placeholder="Descreva o filme..." value={form.sinopse} onChange={handleChange} />
                    </div>
                </div>

                <div className="acoesForm">
                    <Botao type="button" classe="botaoCancelar" onClick={() => navigate(-1)}> Cancelar </Botao>
                    <Botao type="submit" classe="botaoSalvar"> Salvar Alterações </Botao>
                </div>
            </form>

            {/* Modal */}
            <Modal
                isOpen={modal.isOpen}
                onClose={handleCloseModal}
                title={modal.title}
                message={modal.message}
                type={modal.type}
            />
        </div>
    );
}

export default Editar;