import { useState } from 'react';
import { useNavigate} from 'react-router-dom';

/* Importando CSS */
import './Login.css';

/* Importando Componente Botão */
import Botao from '../../components/Botao/Botao';

/* Importando Assets */
import Logo from "../../../public/logoStarViolet.svg";

const mockApiLogin = (email, senha) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const usuarios = [
                { email: 'admin@starviolet.com', senha: 'admin123', nome: 'Admin', role: 'admin' },
                { email: 'user@starviolet.com', senha: 'user123', nome: 'Usuário', role: 'user' },
            ];
            
            const u = usuarios.find(u => u.email === email && u.senha === senha);

            if (u) {
                const { senha, ...usuarioLogado } = u;
                resolve(usuarioLogado);
            } else {
                reject(new Error('Credenciais inválidas. Verifique seu e-mail e senha.'));
            }
        }, 1000);
    });
};

function Login({ setAuth }) {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', senha: '' });
    const [erro, setErro] = useState('');
    
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const submit = async (e) => {
        e.preventDefault();
        setErro('');
        setIsLoading(true);

        try {
            /* * INTEGRAÇÃO BACKEND (Exemplo)
             * Aqui você faria a chamada para sua API Python:
             *
             * const response = await fetch('https://sua-api.com/login', {
             * method: 'POST',
             * headers: { 'Content-Type': 'application/json' },
             * body: JSON.stringify(form)
             * });
             *
             * const data = await response.json();
             *
             * if (!response.ok) {
             * // Se a API retornar um erro (401, 400, etc.)
             * throw new Error(data.message || 'Falha no login');
             * }
             *
             * // Se o login for bem-sucedido, 'data' deve ser o objeto do usuário
             * setAuth({ isAutenticado: true, usuario: data });
             * navigate('/home'); // Redireciona para a Home
             */
            
            const usuarioLogado = await mockApiLogin(form.email, form.senha);

            setAuth({ isAutenticado: true, usuario: usuarioLogado });

            navigate('/home');

        } catch (err) {
            setErro(err.message);
        } finally {
            setIsLoading(false);
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
                
                <form onSubmit={submit} className="formLogin">
                    <div className="campoLogin">
                        <label htmlFor="email">Email</label>
                        <input id="email" name="email" placeholder="user@filminis.com" type="email" value={form.email} onChange={handleChange} required disabled={isLoading}/>
                    </div>
                    
                    <div className="campoLogin">
                        <label htmlFor="senha">Senha</label>
                        <input
                            id="senha"
                            name="senha"
                            placeholder="••••••••"
                            type="password"
                            value={form.senha}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {/* Exibe mensagem de erro da API */}
                    {erro && <div className="erroLogin">{erro}</div>}

                    <div className="acoesLogin">
                        <Botao type="submit" classe="botaoSalvar" disabled={isLoading}>
                            {isLoading ? 'Entrando...' : 'Entrar'}
                        </Botao>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;