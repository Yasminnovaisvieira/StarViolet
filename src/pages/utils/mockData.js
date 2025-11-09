export function placeholderPoster() { return '/assets/posters/placeholder.jpg'; }

// Função que retorna os dados mocados de filmes
// Adicionei o campo 'status' para controlar o fluxo de aprovação do Admin
export function sampleFilmes() {
    return [
        { id: '1', titulo: 'Nebula Nights', ano: '2023', genero: 'Ficção', diretor: 'A. Silva', atores: 'João, Maria', sinopse: 'Uma aventura espacial em tons roxos.', poster: '/assets/posters/placeholder.jpg', status: 'aprovado' },
        { id: '2', titulo: 'Cidade Sombria', ano: '2021', genero: 'Drama', diretor: 'P. Costa', atores: 'Ana, Carlos', sinopse: 'Mistério urbano e decisões difíceis.', poster: '/assets/posters/placeholder.jpg', status: 'aprovado' },
        { id: '4', titulo: 'Sombras do Norte', ano: '2019', genero: 'Terror', diretor: 'M. Nunes', atores: 'Paulo, Sofia', sinopse: 'Segredos enterrados na neve.', poster: '/assets/posters/placeholder.jpg', status: 'aprovado' },
        { id: '5', titulo: 'Futuro Próximo', ano: '2024', genero: 'Aventura', diretor: 'E. Rocha', atores: 'Diego, Clara', sinopse: 'Sociedade em transformação por tecnologia.', poster: '/assets/posters/placeholder.jpg', status: 'aprovado' },
        { id: '6', titulo: 'Futuro Próximo', ano: '2024', genero: 'Romance', diretor: 'E. Rocha', atores: 'Diego, Clara', sinopse: 'Sociedade em transformação por tecnologia.', poster: '/assets/posters/placeholder.jpg', status: 'aprovado' },
        { id: '7', titulo: 'Futuro Próximo', ano: '2024', genero: 'Fantasia', diretor: 'E. Rocha', atores: 'Diego, Clara', sinopse: 'Sociedade em transformação por tecnologia.', poster: '/assets/posters/placeholder.jpg', status: 'aprovado' },
        { id: '8', titulo: 'Futuro Próximo', ano: '2024', genero: 'Suspense', diretor: 'E. Rocha', atores: 'Diego, Clara', sinopse: 'Sociedade em transformação por tecnologia.', poster: '/assets/posters/placeholder.jpg', status: 'aprovado' }
    ];
}