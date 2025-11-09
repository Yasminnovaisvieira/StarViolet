import Carrossel from '../../components/Carrossel/Carrossel';
import './Home.css';

export default function Home() {
    const listaDeDestaques = [
        { id: 1, titulo: "Filme A", ano: 2024, sinopse: "Um suspense envolvente com reviravoltas intensas.", poster: "url/posterA.jpg" },
        { id: 2, titulo: "Filme B", ano: 2023, sinopse: "Uma história emocionante sobre superação e coragem.", poster: "url/posterB.jpg" },
        { id: 3, titulo: "Filme C", ano: 2022, sinopse: "Uma aventura épica cheia de ação e mistério.", poster: "url/posterC.jpg" }
    ];

    return (
        <main className="paginaHome" aria-label="Página inicial">
            <section className="secaoCarrossel" aria-label="Filmes em destaque">
                <Carrossel destaques={listaDeDestaques} />
            </section>
        </main>
    );
}