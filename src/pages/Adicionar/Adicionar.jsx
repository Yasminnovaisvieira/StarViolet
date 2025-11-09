import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Adicionar.css';

// Página para Adicionar um novo filme
export default function Adicionar({ onAdd }) {
    const navigate = useNavigate();
    // Estado para controlar os dados do formulário
    const [form, setForm] = useState({ 
        titulo: '', ano: '', genero: '', diretor: '', 
        atores: '', sinopse: '', poster: '' 
    });
    // Estado para mensagens de erro de validação
    const [erro, setErro] = useState('');

    // Função genérica para atualizar o estado do formulário
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // Validação simples antes do envio 
    const validarForm = () => {
        if (!form.titulo || !form.ano || !form.genero) {
            setErro('Título, Ano e Gênero são campos obrigatórios.');
            return false;
        }
        setErro('');
        return true;
    };

    // Função de envio do formulário
    const submit = (e) => { 
        e.preventDefault(); 
        // Se a validação falhar, interrompe o envio
        if (!validarForm()) return; 

        // Poster placeholder se o campo estiver vazio
        const posterFinal = form.poster || 'https://images.unsplash.com/photo-1517602302552-471fe67acf66?w=800&q=80';
        
        // Chama a função 'onAdd' (do App.jsx) com os dados do form
        // O App.jsx cuidará de adicionar o status 'pendente'
        onAdd({ ...form, poster: posterFinal }); 
        
        // Navega de volta para a lista de filmes
        navigate('/filmes'); 
    };

    return (
        <form onSubmit={submit} className="formFilme cartaoPadrao">
            <h3>Adicionar novo filme</h3>
            
            {/* Campos do formulário */}
            <div className="gridCampos">
                <input name="titulo" placeholder="Título *" value={form.titulo} onChange={handleChange} />
                <input name="ano" placeholder="Ano *" value={form.ano} onChange={handleChange} />
                <input name="genero" placeholder="Gênero *" value={form.genero} onChange={handleChange} />
                <input name="diretor" placeholder="Diretor" value={form.diretor} onChange={handleChange} />
                <input name="atores" placeholder="Atores (separados por vírgula)" value={form.atores} onChange={handleChange} />
                <input name="poster" placeholder="URL do poster" value={form.poster} onChange={handleChange} />
                <textarea name="sinopse" placeholder="Sinopse" value={form.sinopse} onChange={handleChange} />
            </div>

            {/* Exibe a mensagem de erro, se houver */}
            {erro && <div className="mensagemErro">{erro}</div>}

            <div className="acoesForm">
                <button type="submit" className="botaoSalvar">Salvar</button>
            </div>
        </form>
    );
}