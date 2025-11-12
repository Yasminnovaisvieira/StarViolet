import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

/* Páginas */
import Home from './pages/Home/Home.jsx';
import ListaFilmes from './pages/ListaFilmes/ListaFilme.jsx';
import FilmeDetalhe from './pages/FilmeDetalhe/FilmeDetalhe.jsx';
import Adicionar from './pages/Adicionar/Adicionar.jsx';
import Editar from './pages/Editar/Editar.jsx';
import Login from './pages/Login/Login.jsx';
import Admin from './pages/Admin/Admin.jsx';

/* Componentes */
import Cabecalho from './components/Cabecalho/Cabecalho.jsx';
import Rodape from './components/Rodape/Rodape.jsx';

/* Importando API */
import apiClient from './api/apiClient.js';

const AUTH_KEY = 'filminis_auth';

// --- CÓDIGO RESTAURADO (INÍCIO) ---

/* Busca o estado inicial de autenticação no localStorage */
function getInitialAuth() {
    try {
        const storedAuth = localStorage.getItem(AUTH_KEY);
        if (storedAuth) {
            const auth = JSON.parse(storedAuth);
            // Verifica se o objeto guardado é válido
            if (auth.token && auth.usuario) {
                
                // --- CORREÇÃO AQUI ---
                // A linha abaixo foi REMOVIDA. Ela era para Axios, e seu apiClient.js
                // já busca o token do localStorage automaticamente.
                // apiClient.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`;
                
                return auth;
            }
        }
    } catch (err) {
        console.error("Falha ao ler auth do localStorage", err);
    }
    // Estado padrão se não houver nada
    return { isAutenticado: false, usuario: null, token: null };
}

/* Componente de Layout (partes da UI que não mudam) */
function LayoutPrincipal({ auth, setAuth }) {
    return (
        <div className="containerApp">
            <Cabecalho auth={auth} setAuth={setAuth} />
            <main className="conteudoPrincipal">
                <Outlet /> {/* Onde as rotas (Home, Filmes, etc.) são renderizadas */}
            </main>
            <Rodape auth={auth} />
        </div>
    );
}
// --- CÓDIGO RESTAURADO (FIM) ---


export default function App() {
    /* Estado para a lista completa de filmes */
    const [filmes, setFilmes] = useState([]);
    /* Estado para a autenticação */
    const [auth, setAuth] = useState(getInitialAuth);

    useEffect(() => {
        // Salva no localStorage sempre que 'auth' mudar
        localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
    }, [auth]);

    useEffect(() => {
        // Busca filmes se estiver autenticado
        if (auth.isAutenticado) {
            apiClient.get('/filmes')
                .then(data => {
                    const filmesFormatados = data.map(f => ({
                        ...f,
                        id: f.id_filme, // <-- ID é um NÚMERO
                        status: f.status_aprovacao
                    }));
                    setFilmes(filmesFormatados);
                })
                .catch(err => {
                    console.error("Falha ao buscar filmes:", err);
                    if (err.message.includes("401")) {
                        // Se o token expirou, desloga o usuário
                        setAuth({ isAutenticado: false, usuario: null, token: null });
                    }
                });
        } else {
            // Limpa os filmes se o usuário deslogar
            setFilmes([]);
        }
    }, [auth.isAutenticado]); // Roda sempre que o status de autenticação mudar

    /* Lógica de Adicionar Filme */
    const adicionarFilme = async (filmeData) => {
        try {
            const novoFilmeDoBackend = await apiClient.post('/filmes', filmeData);
            const filmeFormatado = {
                ...novoFilmeDoBackend,
                id: novoFilmeDoBackend.id_filme,
                status: novoFilmeDoBackend.status_aprovacao
            };
            // Adiciona o novo filme no início da lista
            setFilmes(prev => [filmeFormatado, ...prev]);

            // Retorna o filme formatado para a página saber o ID
            return filmeFormatado;

        } catch (err) {
            console.error("Erro ao adicionar filme:", err);
            throw err; // Lança o erro para a página Adicionar tratar
        }
    };

    /* Lógica de Editar Filme */
    const editarFilme = async (id, dados) => {
        try {
            const filmeAtualizadoDoBackend = await apiClient.patch(`/filmes/${id}`, dados);
            const filmeFormatado = {
                ...filmeAtualizadoDoBackend,
                id: filmeAtualizadoDoBackend.id_filme,
                status: filmeAtualizadoDoBackend.status_aprovacao
            };

            setFilmes(prev => prev.map(p =>
                // Compara número com número
                p.id === parseInt(id) ? filmeFormatado : p
            ));
        } catch (err) {
            console.error("Erro ao editar filme:", err);
            throw err; // Lança o erro para a página Editar tratar
        }
    };

    /* Lógica de Deletar Filme (Apenas Administradores) */
    const deletarFilme = async (id) => {
        try {
            await apiClient.delete(`/filmes/${id}`);
            // Remove o filme da lista
            setFilmes(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error("Erro ao deletar filme:", err);
            throw err; // Lança o erro para a página Detalhe tratar
        }
    };

    /* Lógica para Administrador aprovar um filme */
    const aprovarFilme = async (id) => {
        try {
            const dados = { status_aprovacao: 'aprovado' };
            const filmeAtualizadoDoBackend = await apiClient.patch(`/filmes/${id}`, dados);
            const filmeFormatado = {
                ...filmeAtualizadoDoBackend,
                id: filmeAtualizadoDoBackend.id_filme,
                status: filmeAtualizadoDoBackend.status_aprovacao
            };

            setFilmes(prev => prev.map(p =>
                p.id === parseInt(id) ? filmeFormatado : p
            ));
        } catch (err) {
            console.error("Erro ao aprovar filme:", err);
            throw err; // Lança o erro para a página Admin tratar
        }
    };

    // --- CORREÇÃO DE SINTAXE ---
    // O '}' que estava aqui (fechando o App) foi removido.


    /* Lista de filmes visível para o público (apenas aprovados) */
    // Usamos .filter() aqui para que Home e ListaFilmes só mostrem os aprovados
    const filmesVisiveis = filmes.filter(f => f.status === 'aprovado');
    const isAdmin = auth.usuario?.role === 'admin';

    return (
        <BrowserRouter>
            <Routes>
                {/* Rota de Login (raiz) */}
                <Route path="/"
                    element={
                        auth.isAutenticado
                            ? <Navigate to="/home" /> // Se já estiver logado, vai para /home
                            : <Login setAuth={setAuth} />
                    }
                />

                {/* Rotas que usam o Layout Principal (Cabeçalho e Rodapé) */}
                <Route element={<LayoutPrincipal auth={auth} setAuth={setAuth} />}>

                    <Route path="/home" element={auth.isAutenticado ? <Home filmes={filmesVisiveis} /> : <Navigate to="/" />} />

                    <Route path="/filmes" element={auth.isAutenticado ? <ListaFilmes filmes={filmesVisiveis} /> : <Navigate to="/" />} a />

                    <Route path="/filmes/:id"
                        element={
                            auth.isAutenticado
                                ? <FilmeDetalhe
                                    filmes={filmes} // Passa TODOS os filmes (para ver pendentes)
                                    isAdmin={isAdmin}
                                    onDelete={deletarFilme}
                                />
                                : <Navigate to="/" />
                        }
                    />

                    <Route path="/adicionar" element={auth.isAutenticado ? <Adicionar onAdd={adicionarFilme} isAdmin={isAdmin} /> : <Navigate to="/" />} />

                    <Route path="/editar/:id" element={auth.isAutenticado ? <Editar filmes={filmes} onEdit={editarFilme} isAdmin={isAdmin} /> : <Navigate to="/" />} />

                    {/* Rota de Admin (aninhada) */}
                    <Route path="/admin/*"
                        element={
                            auth.isAutenticado && isAdmin
                                ? <Admin filmes={filmes} onDelete={deletarFilme} onApprove={aprovarFilme} />
                                : <Navigate to="/home" /> // Se não for admin, volta pra home
                        }
                    />
                </Route>

                {/* Redireciona qualquer rota não encontrada */}
                <Route path="*" element={<Navigate to={auth.isAutenticado ? "/home" : "/"} />} />
            </Routes>
        </BrowserRouter>
    );
} // <-- O '}' de fechamento do 'export default function App()' fica aqui.