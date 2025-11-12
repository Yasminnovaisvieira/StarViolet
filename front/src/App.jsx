import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

/* Páginas */
import Home from './pages/Home/Home';
import ListaFilmes from './pages/ListaFilmes/ListaFilme';
import FilmeDetalhe from './pages/FilmeDetalhe/FilmeDetalhe';
import Adicionar from './pages/Adicionar/Adicionar';
import Editar from './pages/Editar/Editar';
import Login from './pages/Login/Login';
import Admin from './pages/Admin/Admin';

/* Componentes */
import Cabecalho from './components/Cabecalho/Cabecalho';
import Rodape from './components/Rodape/Rodape';

/* Importando API */
import apiClient from './api/apiClient';

const AUTH_KEY = 'filminis_auth';

function getInitialAuth() {
    try {
        const authData = JSON.parse(localStorage.getItem(AUTH_KEY));
        if (authData && authData.token) {
            return authData;
        }
        return { isAutenticado: false, usuario: null, token: null };
    }
    catch {
        return { isAutenticado: false, usuario: null, token: null };
    }
}

const LayoutPrincipal = ({ auth, setAuth }) => (
    <div className="containerApp">
        <Cabecalho auth={auth} setAuth={setAuth} />
        <main className="conteudoPrincipal">
            <Outlet />
        </main>
        <Rodape auth={auth} />
    </div>
);


export default function App() {
    /* Estado para a lista completa de filmes */
    const [filmes, setFilmes] = useState([]);
    /* Estado para a autenticação */
    const [auth, setAuth] = useState(getInitialAuth);

    useEffect(() => {
        localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
    }, [auth]);

    useEffect(() => {
        if (auth.isAutenticado) {
            apiClient.get('/filmes')
                .then(data => {
                    const filmesFormatados = data.map(f => ({
                        ...f,
                        id: f.id_filme,
                        status: f.status_aprovacao
                    }));
                    setFilmes(filmesFormatados);
                })
                .catch(err => {
                    console.error("Falha ao buscar filmes:", err);
                    if (err.message.includes("401")) {
                        setAuth({ isAutenticado: false, usuario: null, token: null });
                    }
                });
        } else {
            setFilmes([]);
        }
    }, [auth.isAutenticado]);

    /* Lógica de Adicionar Filme */
    const adicionarFilme = async (filmeData) => {
        try {
            const novoFilmeDoBackend = await apiClient.post('/filmes', filmeData);
            // Formata o filme vindo do backend
            const filmeFormatado = {
                ...novoFilmeDoBackend,
                id: novoFilmeDoBackend.id_filme,
                status: novoFilmeDoBackend.status_aprovacao
            };
            setFilmes(prev => [filmeFormatado, ...prev]);
        } catch (err) {
            console.error("Erro ao adicionar filme:", err);
            // Re-lança o erro para a página de adicionar mostrar
            throw err; 
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
                p.id === id ? filmeFormatado : p
            ));
        } catch (err) {
            console.error("Erro ao editar filme:", err);
            throw err;
        }
    };

    /* Lógica de Deletar Filme (Apenas Administradores) */
    const deletarFilme = async (id) => {
        try {
            await apiClient.delete(`/filmes/${id}`);
            setFilmes(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error("Erro ao deletar filme:", err);
            throw err;
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
                p.id === id ? filmeFormatado : p
            ));
        } catch (err) {
            console.error("Erro ao aprovar filme:", err);
            throw err;
        }
    };

    /* Lista de filmes visível para o público (apenas aprovados) */
    const filmesVisiveis = filmes.filter(f => f.status === 'aprovado');
    const isAdmin = auth.usuario?.role === 'admin';

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/"
                    element={
                        auth.isAutenticado
                            ? <Navigate to="/home" /> // Se já estiver logado, vai para /home
                            : <Login setAuth={setAuth} />
                    }
                />

                <Route element={<LayoutPrincipal auth={auth} setAuth={setAuth} />}>

                    <Route path="/home" element={auth.isAutenticado ? <Home filmes={filmesVisiveis} /> : <Navigate to="/login" />} />

                    <Route path="/filmes" element={auth.isAutenticado ? <ListaFilmes filmes={filmesVisiveis} /> : <Navigate to="/login" />} a />

                    <Route path="/filmes/:id"
                        element={
                            auth.isAutenticado
                                ? <FilmeDetalhe
                                    filmes={filmes}
                                    isAdmin={isAdmin}
                                    onDelete={deletarFilme}
                                />
                                : <Navigate to="/login" />
                        }
                    />

                    <Route path="/adicionar" element={auth.isAutenticado ? <Adicionar onAdd={adicionarFilme} isAdmin={isAdmin} /> : <Navigate to="/login" />} />

                    <Route path="/editar/:id" element={auth.isAutenticado ? <Editar filmes={filmes} onEdit={editarFilme} isAdmin={isAdmin} /> : <Navigate to="/login" />} />

                    {/* Rota de Admin */}
                    <Route path="/admin/*"
                        element={
                            auth.isAutenticado && isAdmin
                                ? <Admin filmes={filmes} onDelete={deletarFilme} onApprove={aprovarFilme} />
                                : <Navigate to="/home" />
                        }
                    />
                </Route>

                {/* Redireciona qualquer rota não encontrada para a home ou login */}
                <Route path="*" element={<Navigate to={auth.isAutenticado ? "/home" : "/"} />} />
            </Routes>
        </BrowserRouter>
    );
}