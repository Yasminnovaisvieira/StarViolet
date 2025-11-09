import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* Importando CSS */
import './Adicionar.css';

/* Importando Modal e Botao */
import Modal from '../../components/Modal/Modal';
import Botao from '../../components/Botao/Botao';

/* Importando Imagem Preta */
import imgPreta from "../../assets/ImagensCategorias/imgPreta.png"

function Adicionar({ onAdd, isAdmin = false }) {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        titulo: '', ano: '', genero: '', diretor: '',
        atores: '', sinopse: '', poster: ''
    });

    /* Estado único para controlar o modal */
    const [modal, setModal] = useState({
        isOpen: false,
        type: 'info',
        title: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    /* Validação simples antes do envio */
    const validarForm = () => {
        if (!form.titulo || !form.ano || !form.genero) {
            setModal({ isOpen: true, type: 'error', title: 'Erro de Validação', message: 'Título, Ano e Gênero são campos obrigatórios.' });
            return false;
        }
        return true;
    };

    /* Função de envio do formulário */
    const submit = (e) => {
        e.preventDefault();
        if (!validarForm()) return;

        const posterFinal = form.poster || imgPreta;
        onAdd({ ...form, poster: posterFinal });

        /* Mensagem diferenciada conforme o tipo de usuário */
        const mensagem = isAdmin
            ? 'Filme adicionado com sucesso.'
            : 'O filme foi enviado para análise e aguarda aprovação do administrador.';

        setModal({
            isOpen: true,
            type: 'success',
            title: 'Filme Adicionado!',
            message: mensagem
        });
    };

    /* Função chamada quando o modal é fechado */
    const handleCloseModal = () => {
        const modalType = modal.type;

        /* Fecha o modal */
        setModal({ isOpen: false, type: 'info', title: '', message: '' });

        /* Se o modal que fechamos era o de 'sucesso', navega para a lista */
        if (modalType === 'success') {
            navigate('/filmes');
        }
    };

    return (
        <div className='formulario'>
            <form onSubmit={submit} className="formFilme cartaoPadrao">
                <h3 className='tituloFormulario'>Adicionar Novo Filme</h3>

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
                            <input id="genero" name="genero" placeholder="Ex: Ficção" value={form.genero} onChange={handleChange} />
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
                    {/* Botão Cancelar */}
                    <Botao type="button" classe="botaoCancelar" onClick={() => navigate(-1)}> Cancelar </Botao>

                    {/* Botão Salvar */}
                    <Botao type="submit" classe="botaoSalvar"> Salvar </Botao>
                </div>
            </form>

            {/* Modal */}
            <Modal isOpen={modal.isOpen} onClose={handleCloseModal} title={modal.title} message={modal.message} type={modal.type} />
        </div>
    );
}

export default Adicionar;