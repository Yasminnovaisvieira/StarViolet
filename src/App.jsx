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

/* Dados Fakes */
import { sampleFilmes } from './pages/utils/mockData';

const AUTH_KEY = 'filminis_auth';
const FILMES_KEY = 'filmes_filminis';

function getInitialAuth() {
    try {
        return JSON.parse(localStorage.getItem(AUTH_KEY)) || { isAutenticado: false, usuario: null };
    }
    catch {
        return { isAutenticado: false, usuario: null };
    }
}

function getInitialFilmes() {
    try {
        const raw = localStorage.getItem(FILMES_KEY);
        return raw ? JSON.parse(raw) : sampleFilmes();
    }
    catch {
        return sampleFilmes();
    }
}

const LayoutPrincipal = ({ auth, setAuth }) => (
    <div className="containerApp">
        <Cabecalho auth={auth} setAuth={setAuth} />
        <main className="conteudoPrincipal">
            <Outlet />
        </main>
        <Rodape />
    </div>
);


export default function App() {
    /* Estado para a lista completa de filmes */
    const [filmes, setFilmes] = useState(getInitialFilmes);
    /* Estado para a autenticação */
    const [auth, setAuth] = useState(getInitialAuth);

    useEffect(() => {
        localStorage.setItem(FILMES_KEY, JSON.stringify(filmes));
    }, [filmes]);

    useEffect(() => {
        localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
    }, [auth]);

    /* Lógica de Adicionar Filme */
    const adicionarFilme = (f) => {
        f.id = Date.now().toString();
        f.status = auth.usuario?.role === 'admin' ? 'aprovado' : 'pendente';
        setFilmes(prev => [f, ...prev]);
    };

    /* Lógica de Editar Filme */
    const editarFilme = (id, dados) => {
        const status = auth.usuario?.role === 'admin' ? 'aprovado' : 'pendente';
        setFilmes(prev => prev.map(p =>
            p.id === id ? { ...p, ...dados, status } : p
        ));
    };

    /* Lógica de Deletar Filme (Apenas Administradores) */
    const deletarFilme = (id) => {
        setFilmes(prev => prev.filter(p => p.id !== id));
    };

    /* Lógica para Administrador aprovar um filme */
    const aprovarFilme = (id) => {
        setFilmes(prev => prev.map(p =>
            p.id === id ? { ...p, status: 'aprovado' } : p
        ));
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

                    <Route path="/home" element={auth.isAutenticado ? <Home filmes={filmesVisiveis} /> : <Navigate to="/login" />}/>

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