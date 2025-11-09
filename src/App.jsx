import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Home from './pages/Home/Home';
import ListaFilmes from './pages/ListaFilmes/ListaFilme';
import FilmeDetalhe from './pages/FilmeDetalhe/FilmeDetalhe';
import Adicionar from './pages/Adicionar/Adicionar';
import Editar from './pages/Editar/Editar';
import Login from './pages/Login/Login';
import Admin from './pages/Admin/Admin';

// Components
import Cabecalho from './components/Cabecalho/Cabecalho';
import Rodape from './components/Rodape/Rodape';

// Mock Data
import { sampleFilmes } from './pages/utils/mockData'; // Removido placeholderPoster não usado

// Chaves para o LocalStorage
const AUTH_KEY = 'filminis_auth';
const FILMES_KEY = 'filmes_filminis';

// Tenta buscar o estado de autenticação do localStorage
function getInitialAuth() {
  try { 
    return JSON.parse(localStorage.getItem(AUTH_KEY)) || { isAutenticado: false, usuario: null }; 
  }
  catch { 
    return { isAutenticado: false, usuario: null }; 
  }
}

// Tenta buscar os filmes do localStorage, ou usa o mock
function getInitialFilmes() {
    try { 
        const raw = localStorage.getItem(FILMES_KEY); 
        return raw ? JSON.parse(raw) : sampleFilmes(); 
    }
    catch { 
        return sampleFilmes(); 
    }
}

export default function App() {
  // Estado para a lista completa de filmes
  const [filmes, setFilmes] = useState(getInitialFilmes);
  // Estado para a autenticação
  const [auth, setAuth] = useState(getInitialAuth);

  // Salva filmes no localStorage sempre que o estado 'filmes' mudar
  useEffect(() => { 
    localStorage.setItem(FILMES_KEY, JSON.stringify(filmes)); 
  }, [filmes]);

  // Salva autenticação no localStorage sempre que o estado 'auth' mudar
  useEffect(() => { 
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth)); 
  }, [auth]);

  // Lógica de Adicionar Filme
  // Cumpre o requisito de que usuários comuns podem adicionar[cite: 30],
  // mas administradores devem aprovar.
  const adicionarFilme = (f) => {
    f.id = Date.now().toString();
    // Se for admin, o filme já entra como 'aprovado'. Se for usuário, 'pendente'.
    f.status = auth.usuario?.role === 'admin' ? 'aprovado' : 'pendente';
    setFilmes(prev => [f, ...prev]); 
  };

  // Lógica de Editar Filme
  // Também segue a regra de aprovação.
  const editarFilme = (id, dados) => { 
    const status = auth.usuario?.role === 'admin' ? 'aprovado' : 'pendente';
    setFilmes(prev => prev.map(p => 
      p.id === id ? { ...p, ...dados, status } : p
    )); 
  };

  // Lógica de Deletar Filme (Apenas Admin)
  const deletarFilme = (id) => { 
    setFilmes(prev => prev.filter(p => p.id !== id)); 
  };

  // Nova lógica para Admin aprovar um filme
  const aprovarFilme = (id) => {
    setFilmes(prev => prev.map(p =>
      p.id === id ? { ...p, status: 'aprovado' } : p
    ));
  };

  // Lista de filmes visível para o público (apenas aprovados)
  const filmesVisiveis = filmes.filter(f => f.status === 'aprovado');

  return (
    <BrowserRouter>
      {/* Container principal da aplicação */}
      <div className="containerApp">
        <Cabecalho auth={auth} setAuth={setAuth} />
        <main className="conteudoPrincipal">
          <Routes>
            {/* Páginas públicas só mostram filmes 'aprovados' */}
            <Route path="/" element={<Home filmes={filmesVisiveis} />} />
            <Route path="/filmes" element={<ListaFilmes filmes={filmesVisiveis} />} />
            <Route path="/filmes/:id" element={<FilmeDetalhe filmes={filmesVisiveis} />} />

            {/* Rotas de Adicionar/Editar exigem autenticação [cite: 28] */}
            {/* A página 'Editar' recebe a lista *completa* para o caso de um admin
                querer editar um filme ainda pendente */}
            <Route path="/adicionar" element={<Adicionar onAdd={adicionarFilme} />} />
            <Route path="/editar/:id" element={auth.isAutenticado ? <Editar filmes={filmes} onEdit={editarFilme} /> : <Navigate to="/login" />} />
            
            <Route path="/login" element={<Login setAuth={setAuth} />} />

            {/* Rota Admin (protegida) usa "/*" para permitir sub-rotas */}
            {/* O Admin recebe a lista *completa* para poder gerenciar e aprovar */}
            <Route 
              path="/admin/*" 
              element={
                auth.isAutenticado && auth.usuario?.role === 'admin' 
                ? <Admin filmes={filmes} onDelete={deletarFilme} onApprove={aprovarFilme} /> 
                : <Navigate to="/login" />
              } 
            />
            
            {/* Redireciona qualquer rota não encontrada para a Home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Rodape />
      </div>
    </BrowserRouter>
  );
}