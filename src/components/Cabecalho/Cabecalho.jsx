import { Link, NavLink, useNavigate } from 'react-router-dom';

/* Importando CSS */
import './Cabecalho.css';

/* Importando Assets */
import Logo from "../../../public/logoStarViolet.svg";
import IconUser from "../../assets/iconUser.svg";
import iconeLogout from "../../assets/iconLogout.svg";

/* Importando Componentes */
import Botao from '../Botao/Botao';

function Cabecalho({ auth, setAuth }) {
    const navigate = useNavigate();

    /* Função de logout */
    const sair = () => {
        setAuth({ isAutenticado: false, usuario: null });
        navigate('/');
    };

    return (
        <header className="cabecalho">
            <div className="cabecalhoInterno">
                <Link to="/home" className="containerLogo" aria-label="Página inicial - StarViolet">
                    <figure className="logoContainer">
                        <img src={Logo} alt="Logo - StarViolet" className="logo" />
                    </figure>
                    <span className="logoTexto">StarViolet</span>
                </Link>

                {/* Navegação principal */}
                <nav className="navPrincipal" aria-label="Navegação principal">
                    <ul className="listaNav">
                        <li><NavLink to="/home" aria-label="Início da plataforma" className={({ isActive }) => isActive ? "navItem ativo" : "navItem"}>Início</NavLink></li>
                        <li><NavLink to="/filmes" aria-label="Catálogo com todos os filmes" className={({ isActive }) => isActive ? "navItem ativo" : "navItem"}>Catálogo</NavLink></li>
                        <li><NavLink to="/adicionar" aria-label="Adicionar novo filme" className={({ isActive }) => isActive ? "navItem ativo" : "navItem"}>Adicionar Novo Filme</NavLink></li>
                    </ul>

                    {/* Se for ADMINISTRADOR e estiver autenticado */}
                    {auth?.isAutenticado ? (
                        <div className="usuarioArea">
                            {auth.usuario.role === 'admin' && (
                                <NavLink to="/admin" className={({ isActive }) => isActive ? "botaoAdmin ativo" : "botaoAdmin"} aria-label="Área administrativa"> Área Administrativa</NavLink>
                            )}

                            <div className="containerNomeAdmin">
                                <img src={IconUser} alt="Ícone de usuário" className="iconeUsuario" />
                                <span className="nomeUsuario" aria-label="Usuário logado">{auth.usuario.nome}</span>
                            </div>

                            <Botao onClick={sair} classe="botaoSair" aria-label="Encerrar sessão">
                                <img
                                    src={iconeLogout}
                                    alt="Ícone de logout"
                                    className="iconeUsuario iconeLogout"
                                />
                                <span>Sair</span>
                            </Botao>
                        </div>
                    ) : (
                        // Este trecho não deve mais ser renderizado aqui, 
                        // pois o Cabecalho só existe para usuários logados,
                        // mas deixamos por segurança.
                        < NavLink to="/login" className={({ isActive }) => isActive ? "botaoLoginIcone ativo" : "botaoLoginIcone"} aria-label="Fazer login" >
                            <img src={IconUser} alt="Ícone de usuário" className="iconeUsuario iconeLogin" />
                            <span>Login</span>
                        </NavLink>
                    )}

                </nav>
            </div>
        </header >
    );
}

export default Cabecalho;