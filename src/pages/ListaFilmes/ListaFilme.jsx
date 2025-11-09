import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/* Importando CSS */
import './ListaFilme.css';

/* Importando Componentes */
import CartaoFilme from '../../components/CartaoFilme/CartaoFilme';
import SecaoCategorias from '../../components/SecaoCategorias/SecaoCategorias';
import Filtro from '../../components/Filtro/Filtro';

/* Importando Imagens */
import imgFiccao from '../../assets/ImagensCategorias/ficcao.jpg';
import imgDrama from '../../assets/ImagensCategorias/drama.jpg';
import imgRomance from '../../assets/ImagensCategorias/romance.jpg';
import imgTerror from '../../assets/ImagensCategorias/terror.jpg';
import imgAventura from '../../assets/ImagensCategorias/aventura.jpg';
import imgFantasia from '../../assets/ImagensCategorias/fantasia.jpg';
import imgSuspense from '../../assets/ImagensCategorias/suspense.jpg';
import imgComedia from '../../assets/ImagensCategorias/comedia.jpg';
import imgTodos from "../../assets/ImagensCategorias/imgPreta.png";

const mapaImagens = {
    'Ficção': imgFiccao,
    'Drama': imgDrama,
    'Romance': imgRomance,
    'Terror': imgTerror,
    'Aventura': imgAventura,
    'Fantasia': imgFantasia,
    'Suspense': imgSuspense,
    'Comédia': imgComedia
};

const mapaFundos = {
    'Ficção': { gradiente: 'var(--fundo-gradiente-ficcao)' },
    'Drama': { gradiente: 'var(--fundo-gradiente-drama)' },
    'Romance': { gradiente: 'var(--fundo-gradiente-romance)' },
    'Terror': { gradiente: 'var(--fundo-gradiente-terror)' },
    'Aventura': { gradiente: 'var(--fundo-gradiente-aventura)' },
    'Fantasia': { gradiente: 'var(--fundo-gradiente-fantasia)' },
    'Suspense': { gradiente: 'var(--fundo-gradiente-suspense)' },
    'Comédia': { gradiente: 'var(--fundo-gradiente-comedia)' },
    'default': { gradiente: 'var(--fundo-gradiente)' }
};

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

const filtrosIniciais = {
    q: '',
    genero: '',
    ano: '',
    diretor: '',
    ator: ''
};

function ListaFilmes({ filmes }) {
    const location = useLocation();
    const generoInicial = location.state?.genero || '';

    const [filtros, setFiltros] = useState({
        ...filtrosIniciais,
        genero: generoInicial,
    });

    const opcoes = useMemo(() => ({
        generos: getUnicosSimples(filmes, 'genero'),
        anos: getUnicosSimples(filmes, 'ano'),
        diretores: getUnicosSimples(filmes, 'diretor'),
        atores: getUnicos(filmes, 'atores')
    }), [filmes]);

    const categorias = useMemo(() => {
        const generosDefinidos = Object.keys(mapaImagens);
        const generosMapeados = generosDefinidos.map(nomeGenero => ({
            nome: nomeGenero,
            imagem: mapaImagens[nomeGenero]
        }));
        const cardTodos = { nome: 'Todos', imagem: imgTodos };
        return [cardTodos, ...generosMapeados];
    }, []);

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLimparFiltros = () => {
        setFiltros(filtrosIniciais);
    };

    useEffect(() => {
        const body = document.body;
        const fundoConfig = mapaFundos[filtros.genero] || mapaFundos.default;

        body.style.backgroundImage = fundoConfig.gradiente;
        body.style.backgroundRepeat = 'no-repeat';
        body.style.backgroundSize = 'cover';
        body.style.backgroundPosition = 'center center';
        body.style.backgroundAttachment = 'fixed';

        return () => {
            body.style.backgroundImage = '';
            body.style.backgroundRepeat = '';
            body.style.backgroundSize = '';
            body.style.backgroundPosition = '';
            body.style.backgroundAttachment = '';
        };
    }, [filtros.genero]);

    useEffect(() => {
        const novoGenero = location.state?.genero;
        if (novoGenero) {
            setFiltros({
                ...filtrosIniciais,
                genero: novoGenero,
            });
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const filtrados = useMemo(() => {
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

    return (
        <div className="paginaLista">
            <SecaoCategorias titulo="Categorias" categorias={categorias} onTodosClick={handleLimparFiltros}/>

            <div className="areaFiltros">
                <Filtro filtros={filtros} onFiltroChange={handleFiltroChange} opcoes={opcoes} onLimparFiltros={handleLimparFiltros}/>
            </div>

            <h2 className="tituloSecaoFilmes">
                {filtros.genero ? `Filmes de ${filtros.genero}` : 'Todos os Filmes'}
            </h2>

            <div className="gradeLista">
                {filtrados.length > 0 ? (
                    filtrados.map(f => <CartaoFilme key={f.id} filme={f} />)
                ) : (
                    <div className="mensagemNenhum">
                        <p>Nenhum filme encontrado com esses filtros.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ListaFilmes;