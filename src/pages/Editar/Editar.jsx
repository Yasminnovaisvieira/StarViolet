import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Editar.css'; // Importa o CSS de Edição

// Página para Editar um filme existente
export default function Editar({ filmes, onEdit }) {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Encontra o filme original na lista completa
    const filmeOriginal = filmes.find(f => f.id === id);

    // Estado para o formulário, inicializado com os dados do filme
    const [form, setForm] = useState(filmeOriginal || {});
    // Estado para mensagens de erro
    const [erro, setErro] = useState('');

    // Atualiza o formulário se o filme for encontrado (após a renderização)
    useEffect(() => { 
        if (filmeOriginal) setForm(filmeOriginal); 
    }, [filmeOriginal]);

    // Se o filme não existir, mostra mensagem
    if (!filmeOriginal) return <div className="cartaoPadrao">Filme não encontrado</div>;

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
        if (!validarForm()) return;

        // Chama a função 'onEdit' (do App.jsx)
        // O App.jsx cuidará de atualizar o status para 'pendente' se for um usuário
        onEdit(id, form); 
        
        // Navega para a página de detalhes do filme
        navigate(`/filmes/${id}`); 
    };

    return (
        // Reutiliza o CSS da página Adicionar
        <form onSubmit={submit} className="formFilme cartaoPadrao"> 
            <h3>Editar filme: {filmeOriginal.titulo}</h3>
            
            <div className="gridCampos">
                <input name="titulo" placeholder="Título *" value={form.titulo} onChange={handleChange} />
                <input name="ano" placeholder="Ano *" value={form.ano} onChange={handleChange} />
                <input name="genero" placeholder="Gênero *" value={form.genero} onChange={handleChange} />
                <input name="diretor" placeholder="Diretor" value={form.diretor} onChange={handleChange} />
                <input name="atores" placeholder="Atores (separados por vírgula)" value={form.atores} onChange={handleChange} />
                <input name="poster" placeholder="URL do poster" value={form.poster} onChange={handleChange} />
                <textarea name="sinopse" placeholder="Sinopse" value={form.sinopse} onChange={handleChange} />
            </div>
            
            {erro && <div className="mensagemErro">{erro}</div>}

            <div className="acoesForm">
                <button type="submit" className="botaoSalvar">Salvar alterações</button>
            </div>
        </form>
    );
}