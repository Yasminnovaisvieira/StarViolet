import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

// Página de Login
export default function Login({ setAuth }) {
    const navigate = useNavigate();
    // Estado para o formulário de login
    const [form, setForm] = useState({ email: '', senha: '' });
    // Estado para mensagens de erro
    const [erro, setErro] = useState('');

    // Dados mocados de usuários. Em um app real, viria de uma API.
    const usuarios = [
        { email: 'admin@filminis.com', senha: 'admin123', nome: 'Admin', role: 'admin' },
    ];

    // Função de envio do formulário
    const submit = (e) => {
        e.preventDefault();
        setErro(''); // Limpa erros anteriores

        // Procura o usuário na lista mocada
        const u = usuarios.find(u => u.email === form.email && u.senha === form.senha);

        // Se não encontrar, mostra erro 
        if (!u) {
            setErro('Credenciais inválidas. Tente "admin@filminis.com" ou "user@filminis.com"');
            return;
        }

        // Se encontrar, atualiza o estado de autenticação (no App.jsx)
        setAuth({ isAutenticado: true, usuario: u });

        // Redireciona para a Home
        navigate('/');
    };

    return (
        <div className="paginaLogin cartaoPadrao">
            <h3>Entrar</h3>
            <form onSubmit={submit} className="formLogin">
                <input
                    placeholder="Email"
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                />
                <input
                    placeholder="Senha"
                    type="password"
                    value={form.senha}
                    onChange={e => setForm({ ...form, senha: e.target.value })}
                    required
                />

                {/* Exibe mensagem de erro */}
                {erro && <div className="erroLogin">{erro}</div>}

                <div className="acoesLogin">
                    {/* Reutiliza o estilo .botaoSalvar do Adicionar.css */}
                    <button type="submit" className="botaoSalvar">Entrar</button>
                </div>
            </form>
        </div>
    );
}