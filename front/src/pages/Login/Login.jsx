import { useState } from 'react';
import { useNavigate} from 'react-router-dom';

/* Importando CSS */
import './Login.css';

/* Importando Componente Botão */
import Botao from '../../components/Botao/Botao';

/* Importando Assets */
import Logo from "../../../public/logoStarViolet.svg";

/* Importando API */
import apiClient from "../../api/apiClient"

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
            const data = await apiClient.login(form.email, form.senha);

            setAuth({
                isAutenticado: true,
                usuario: data.usuario,
                token: data.access_token
            });

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