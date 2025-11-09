import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

/* Importando CSS */
import '../Cadastro/Cadastro.css'; /* */

/* Importando Modal e Botão */
import Botao from '../../components/Botao/Botao';
import Modal from '../../components/Modal/Modal'; 

/* Importando Assets */
import Logo from "../../../public/logoStarViolet.svg";

export default function Cadastro() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ nome: '', email: '', senha: '' });
    const [erro, setErro] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    /* Estado para o modal */
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

    const submit = async (e) => {
        e.preventDefault();
        setErro('');
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            
            setModal({
                isOpen: true,
                type: 'success',
                title: 'Cadastro Realizado!',
                message: 'Sua conta foi criada com sucesso! Você será redirecionado para o Login.'
            });

        }, 1000);
    };

    const handleCloseModal = () => {
        const modalType = modal.type;
        setModal({ isOpen: false, type: 'info', title: '', message: '' });

        if (modalType === 'success') {
            navigate('/login');
        }
    };

    return (
        <div className="paginaLoginContainer"> 
            <div className="paginaLogin cartaoPadrao">
                <div className='containerLogoLogin'>
                    <figure className="logoContainer">
                        <img src={Logo} alt="Logo - StarViolet" className="logoLogin" />
                    </figure>
                    <h3 className="tituloLogin">StarViolet</h3>
                </div>
                
                <p className="subtituloLogin">Crie sua conta para começar.</p>
                
                <form onSubmit={submit} className="formLogin">
                    <div className="campoLogin">
                        <label htmlFor="nome">Nome Completo</label>
                        <input id="nome" name="nome" placeholder="Seu nome" type="text" value={form.nome} onChange={handleChange} required disabled={isLoading}/>
                    </div>
                    
                    <div className="campoLogin">
                        <label htmlFor="email">Email</label>
                        <input id="email" name="email" placeholder="seu@email.com" type="email" value={form.email} onChange={handleChange} required disabled={isLoading}/>
                    </div>
                    
                    <div className="campoLogin">
                        <label htmlFor="senha">Senha</label>
                        <input id="senha" name="senha" placeholder="••••••••" type="password" value={form.senha} onChange={handleChange} required disabled={isLoading}/>
                    </div>

                    {erro && <div className="erroLogin">{erro}</div>}

                    <div className="acoesLogin">
                        <Botao type="submit" classe="botaoSalvar" disabled={isLoading}> {isLoading ? 'Criando...' : 'Criar Conta'}</Botao>
                    </div>
                </form>

                <div className="linkCadastro">
                    Já tem uma conta? <Link to="/login">Faça login aqui</Link>
                </div>
            </div>

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