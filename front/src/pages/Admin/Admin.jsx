import { useState, useMemo } from 'react';
import { Routes, Route, NavLink, Link, useParams, useNavigate } from 'react-router-dom';

/* Importando CSS */
import './Admin.css';

/* Importando Componentes e Modal */
import Filtro from '../../components/Filtro/Filtro';
import Botao from '../../components/Botao/Botao';
import Modal from '../../components/Modal/Modal';

const getUnicos = (filmes, campo) => {
    const todosOsItens = filmes.flatMap(filme => {
        const valor = filme[campo];
        if (Array.isArray(valor)) {
            return valor.map(item => item.trim());
        }

        if (typeof valor === 'string' && valor) {
            return valor.split(',').map(item => item.trim());
        }
        return [];
    });
    return [...new Set(todosOsItens)].sort();
};

const getUnicosSimples = (filmes, campo) => {
    const todosOsItens = filmes.map(f => f[campo]).filter(Boolean);
    return [...new Set(todosOsItens)].sort();
};

function GerenciarFilmes({ filmes, onDelete }) {

    const [filtros, setFiltros] = useState({ q: '', genero: '', ano: '', diretor: '', ator: '' });

    /* Estado do Modal */
    const [modal, setModal] = useState({ isOpen: false, type: 'info', title: '', message: '' });
    const [filmeParaExcluir, setFilmeParaExcluir] = useState(null); // Armazena o filme a ser excluído

    /* Prepara as opções para os filtros */
    const opcoes = useMemo(() => ({
        generos: getUnicosSimples(filmes, 'genero'),
        anos: getUnicosSimples(filmes, 'ano'),
        diretores: getUnicosSimples(filmes, 'diretor'),
        atores: getUnicos(filmes, 'atores')
    }), [filmes]);

    /* Lógica de filtragem */
    const filmesFiltrados = useMemo(() => {
        return filmes.filter(f => {
            let atoresFilme = [];
            if (Array.isArray(f.atores)) {
                atoresFilme = f.atores.map(a => a.trim());
            } else if (typeof f.atores === 'string') {
                atoresFilme = f.atores.split(',').map(a => a.trim());
            }

            const buscaTitulo = f.titulo.toLowerCase().includes(filtros.q.toLowerCase());
            const buscaGenero = filtros.genero ? f.genero === filtros.genero : true;
            const buscaAno = filtros.ano ? f.ano === filtros.ano : true;
            const buscaDiretor = filtros.diretor ? f.diretor === filtros.diretor : true;
            const buscaAtor = filtros.ator ? atoresFilme.includes(filtros.ator) : true;

            return buscaTitulo && buscaGenero && buscaAno && buscaDiretor && buscaAtor;
        });
    }, [filmes, filtros]);

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({ ...prev, [name]: value }));
    };

    const handleLimparFiltros = () => {
        setFiltros({ q: '', genero: '', ano: '', diretor: '', ator: '' });
    };

    /* Funções para controlar o Modal de Exclusão */
    const handleExcluirClick = (filme) => {
        setFilmeParaExcluir(filme);
        setModal({
            isOpen: true,
            type: 'confirm',
            title: 'Confirmar Exclusão',
            message: `Tem certeza que deseja excluir o filme "${filme.titulo}"? Esta ação não pode ser desfeita.`
        });
    };

    const handleConfirmarExcluir = () => {
        try {
            onDelete(filmeParaExcluir.id);
            setModal({
                isOpen: true,
                type: 'success',
                title: 'Sucesso!',
                message: 'O filme foi excluído com sucesso.'
            });
        } catch (err) {
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Erro!',
                message: `Ocorreu um erro ao excluir: ${err.message}`
            });
        }
        setFilmeParaExcluir(null);
    };

    const handleCloseModal = () => {
        setModal({ isOpen: false, type: 'info', title: '', message: '' });
        setFilmeParaExcluir(null);
    };

    return (
        <>
            {/* Filtros */}
            <div className="areaFiltrosAdmin">
                <Filtro
                    filtros={filtros}
                    onFiltroChange={handleFiltroChange}
                    opcoes={opcoes}
                    onLimparFiltros={handleLimparFiltros}
                />
            </div>

            {/* Lista de Filmes Filtrados */}
            <div className="listaAdmin">
                {filmesFiltrados.length === 0 && <p>Nenhum filme aprovado encontrado.</p>}
                {filmesFiltrados.map(f => (
                    <div className="itemAdmin cartaoPadrao" key={f.id}>
                        <img src={f.poster} alt={f.titulo} className="miniPosterAdmin" />
                        <div className="infoAdmin">
                            <div className="tituloAdmin">{f.titulo}</div>
                            <div className="metaAdmin">{f.ano} • {f.genero}</div>
                        </div>
                        <div className="acoesAdmin">
                            <Link to={`/filmes/${f.id}`} className="botaoVerDetalhes">Ver Detalhes</Link>
                            <Link to={`/editar/${f.id}`} className="botaoEditarAdmin">Editar</Link>
                            <Botao onClick={() => handleExcluirClick(f)} type="button" classe="botaoExcluir">Excluir</Botao>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            <Modal
                isOpen={modal.isOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmarExcluir}
                title={modal.title}
                message={modal.message}
                type={modal.type}
            />
        </>
    );
}

function AprovarPendencias({ filmes }) {
    return (
        <div className="listaAdmin">
            {filmes.length === 0 && <p className='mensagemNenhumPendente'>Nenhum filme pendente de aprovação.</p>}
            {filmes.map(f => (
                <div className="itemAdmin cartaoPadrao" key={f.id}>
                    <img src={f.poster} alt={f.titulo} className="miniPosterAdmin" />
                    <div className="infoAdmin">
                        <div className="tituloAdmin">{f.titulo}</div>
                        <div className="metaAdmin">{f.ano} • {f.genero}</div>
                        <div className="statusPendente">Status: Pendente</div>
                    </div>
                    <div className="acoesAdmin">
                        <Link to={`/admin/aprovar/${f.id}`} className="botaoAnalisar">Analisar</Link>
                    </div>
                </div>
            ))}
        </div>
    );
}

function DetalheAprovacao({ filmes, onApprove, onReject }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const filme = filmes.find(f => f.id === id);

    /* Estado do Modal para Aprovação/Rejeição */
    const [modal, setModal] = useState({ isOpen: false, type: 'info', title: '', message: '' });
    const [acaoPendente, setAcaoPendente] = useState(null); // 'aprovar' ou 'rejeitar'

    if (!filme) {
        return <div className="cartaoPadrao">Filme pendente não encontrado.</div>;
    }

    /* Funções para controlar o Modal de Aprovação/Rejeição */
    const handleAprovarClick = () => {
        setAcaoPendente('aprovar');
        setModal({
            isOpen: true,
            type: 'confirm',
            title: 'Confirmar Aprovação',
            message: `Tem certeza que deseja aprovar o filme "${filme.titulo}"?`
        });
    };

    const handleRejeitarClick = () => {
        setAcaoPendente('rejeitar');
        setModal({
            isOpen: true,
            type: 'confirm',
            title: 'Confirmar Rejeição',
            message: `Tem certeza que deseja rejeitar (excluir) o filme "${filme.titulo}"?`
        });
    };

    const handleConfirmarAcao = () => {
        try {
            if (acaoPendente === 'aprovar') {
                onApprove(filme.id);
                setModal({
                    isOpen: true,
                    type: 'success',
                    title: 'Sucesso!',
                    message: 'Filme aprovado com sucesso.'
                });
            } else if (acaoPendente === 'rejeitar') {
                onReject(filme.id);
                setModal({
                    isOpen: true,
                    type: 'success',
                    title: 'Sucesso!',
                    message: 'Filme rejeitado (excluído) com sucesso.'
                });
            }
        } catch (err) {
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Erro!',
                message: `Ocorreu um erro: ${err.message}`
            });
        }
    };

    const handleCloseModal = () => {
        const modalType = modal.type;
        const acaoRealizada = acaoPendente;

        setModal({ isOpen: false, type: 'info', title: '', message: '' });
        setAcaoPendente(null);

        if (modalType === 'success' && (acaoRealizada === 'aprovar' || acaoRealizada === 'rejeitar')) {
            navigate('/admin/aprovar');
        }
    };

    return (
        <div className="paginaDetalhe cartaoPadrao">
            <div className="colunaPoster">
                <img src={filme.poster} alt={filme.titulo} className="posterDetalhe" />
            </div>
            <div className="colunaInfo">
                <div className="avisoPendente admin">
                    Analisando Filme Pendente
                </div>

                <h2 className="tituloDetalhe">
                    {filme.titulo} <span className="anoDetalhe">({filme.ano})</span>
                </h2>
                <p className="sinopseDetalhe"><strong>Sinopse:</strong> {filme.sinopse}</p>
                <ul className="metaDetalhe">
                    <li><strong>Gênero:</strong> {filme.genero}</li>
                    <li><strong>Diretor:</strong> {filme.diretor}</li>
                    <li><strong>Atores:</strong> {Array.isArray(filme.atores) ? filme.atores.join(', ') : filme.atores}</li>
                </ul>

                {/* Botões de Ação do Admin */}
                <div className="botoesDetalhe">
                    <Botao onClick={() => navigate(-1)} classe="botaoVoltar">Voltar</Botao>
                    <Botao onClick={handleRejeitarClick} classe="botaoExcluir admin">Rejeitar</Botao>
                    <Botao onClick={handleAprovarClick} classe="botaoAprovar admin">Aprovar</Botao>
                </div>
            </div>

            {/* Modal*/}
            <Modal
                isOpen={modal.isOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmarAcao}
                title={modal.title}
                message={modal.message}
                type={modal.type}
            />
        </div>
    );
}

/* Componente principal do PAINEL DE ADMINISTRADOR */
function Admin({ filmes, onDelete, onApprove }) {

    /* Separa os filmes entre aprovados e pendentes */
    const filmesAprovados = filmes.filter(f => f.status === 'aprovado');
    const filmesPendentes = filmes.filter(f => f.status === 'pendente');

    return (
        <div className="paginaAdmin">
            <div className="cabecalhoAdmin">
                <h3>Painel de Administração</h3>
                <nav className="navAdmin">
                    <NavLink to="/admin" end>Gerenciar Filmes ({filmesAprovados.length})</NavLink>
                    <NavLink to="/admin/aprovar">Aprovar Pendências ({filmesPendentes.length})</NavLink>
                </nav>
            </div>

            <div className="conteudoAdmin">
                <Routes>
                    <Route index element={<GerenciarFilmes filmes={filmesAprovados} onDelete={onDelete} />}/>
                    
                    <Route path="aprovar" element={<AprovarPendencias filmes={filmesPendentes} />}/>
                    
                    <Route path="aprovar/:id" element={<DetalheAprovacao filmes={filmes} onApprove={onApprove} onReject={onDelete} />}/>
                </Routes>
            </div>
        </div>
    );
}

export default Admin;