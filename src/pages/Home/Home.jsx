import { useMemo } from 'react';

/* Importando CSS */
import './Home.css';

/* Importando Componentes */
import Carrossel from '../../components/Carrossel/Carrossel';
import SecaoFilmes from '../../components/SecaoFilmes/SecaoFilmes';
import SecaoCategorias from '../../components/SecaoCategorias/SecaoCategorias';
import Rodape from '../../components/Rodape/Rodape';

/* Importando Imagens */
import imgFiccao from '../../assets/ImagensCategorias/ficcao.jpg';
import imgDrama from '../../assets/ImagensCategorias/drama.jpg';
import imgRomance from '../../assets/ImagensCategorias/romance.jpg';
import imgTerror from '../../assets/ImagensCategorias/terror.jpg';
import imgAventura from '../../assets/ImagensCategorias/aventura.jpg';
import imgFantasia from '../../assets/ImagensCategorias/fantasia.jpg';
import imgSuspense from '../../assets/ImagensCategorias/suspense.jpg';
import imgComedia from '../../assets/ImagensCategorias/comedia.jpg';

function Home({ filmes }) {

    /* Separar os filmes em categorias usando useMemo */
    const destaques = useMemo(() => {
        return filmes.slice(0, 5);
    }, [filmes]);

    const novidades = useMemo(() => {
        /* Simula "novidades" pegando filmes dos últimos 3 anos */
        const anoAtual = new Date().getFullYear();
        return filmes
            .filter(f => parseInt(f.ano) >= anoAtual - 2)
            .sort((a, b) => b.ano - a.ano);    /* Mostrar os mais novos primeiro */
    }, [filmes]);

    /* Lista de Categorias */
    const categorias = useMemo(() => {

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

        const generosDefinidos = Object.keys(mapaImagens);

        return generosDefinidos.map(genero => ({
            nome: genero,
            imagem: mapaImagens[genero]
        }));

    }, []);

    return (
        <>
            <main className="paginaHome" aria-label="Página inicial">

                {/* Carrossel */}
                <section className="secaoCarrossel" aria-label="Filmes em destaque">
                    <Carrossel destaques={destaques} />
                </section>

                {/* Container para as seções de prateleiras */}
                <div className="containerSecoes">
                    {/* Cards de Novidades */}
                    <SecaoFilmes titulo="Novidades" filmes={novidades} />

                    {/* Seção de Categorias */}
                    <SecaoCategorias titulo="Categorias" categorias={categorias} />
                </div>
            </main>
        </>
    );
}

export default Home;