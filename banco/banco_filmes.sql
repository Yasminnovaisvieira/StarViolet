-- Criação do Banco de Dados
CREATE DATABASE IF NOT EXISTS starviolet;
USE starviolet;

-- Tabelas principais
CREATE TABLE genero (
    id_genero INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE diretor (
    id_diretor INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL
);

CREATE TABLE ator (
    id_ator INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL
);

CREATE TABLE produtora (
    id_produtora INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL
);

CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tipo_usuario ENUM('comum', 'administrador') NOT NULL
);

CREATE TABLE filme (
    id_filme INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    ano YEAR,
    sinopse TEXT,
    poster VARCHAR(255),
    produtora_id INT,
    criador_id INT,
    editor_id INT,
    aprovado_por INT,
    status_aprovacao ENUM('aprovado', 'pendente_adicao', 'pendente_edicao') NOT NULL DEFAULT 'pendente_adicao',
    FOREIGN KEY (produtora_id) REFERENCES produtora(id_produtora),
    FOREIGN KEY (criador_id) REFERENCES usuario(id_usuario),
    FOREIGN KEY (editor_id) REFERENCES usuario(id_usuario),
    FOREIGN KEY (aprovado_por) REFERENCES usuario(id_usuario)
);

-- Tabelas intermediárias
CREATE TABLE filme_ator (
    id_filme INT,
    id_ator INT,
    PRIMARY KEY (id_filme, id_ator),
    FOREIGN KEY (id_filme) REFERENCES filme(id_filme) ON DELETE CASCADE,
    FOREIGN KEY (id_ator) REFERENCES ator(id_ator) ON DELETE CASCADE
);

CREATE TABLE filme_genero (
    id_filme INT,
    id_genero INT,
    PRIMARY KEY (id_filme, id_genero),
    FOREIGN KEY (id_filme) REFERENCES filme(id_filme) ON DELETE CASCADE,
    FOREIGN KEY (id_genero) REFERENCES genero(id_genero) ON DELETE CASCADE
);

CREATE TABLE filme_diretor (
    id_filme INT,
    id_diretor INT,
    PRIMARY KEY (id_filme, id_diretor),
    FOREIGN KEY (id_filme) REFERENCES filme(id_filme) ON DELETE CASCADE,
    FOREIGN KEY (id_diretor) REFERENCES diretor(id_diretor) ON DELETE CASCADE
);

-- Populando usuários
-- ON DUPLICATE KEY UPDATE = Em vez de gerar um erro, ele atualiza os campos específicados.
INSERT INTO usuario (nome, email, senha, tipo_usuario) 
VALUES 
    ('Admin', 'admin@starviolet.com', '$2a$12$bacSKihAXbqQrzxx3kbeJOl8/dNbuOIbcvULH7BYAEAjfI4vUkLLu', 'administrador')
ON DUPLICATE KEY UPDATE nome = 'Admin', tipo_usuario = 'administrador';

INSERT INTO usuario (nome, email, senha, tipo_usuario) 
VALUES 
    ('Usuário', 'user@starviolet.com', '$2a$12$bacSKihAXbqQrzxx3kbeJOl8/dNbuOIbcvULH7BYAEAjfI4vUkLLu', 'comum')
ON DUPLICATE KEY UPDATE nome = 'Usuário', tipo_usuario = 'comum';

-- Inserindo produtoras
INSERT INTO produtora (nome) VALUES
    ('Warner Bros.'),
    ('Universal Pictures'),
    ('Paramount Pictures'),
    ('Marvel Studios'),
    ('20th Century Studios'),
    ('Lucasfilm'),
    ('Columbia Pictures'),
    ('Pixar Animation Studios'),
    ('Lionsgate'),
    ('Netflix');

-- Inserindo gêneros
INSERT INTO genero (nome) VALUES
    ('Ação'),
    ('Aventura'),
    ('Drama'),
    ('Ficção Científica'),
    ('Comédia'),
    ('Terror'),
    ('Animação'),
    ('Romance'),
    ('Fantasia'),
    ('Suspense');

-- Inserindo diretores
INSERT INTO diretor (nome) VALUES
    ('Christopher Nolan'),
    ('Steven Spielberg'),
    ('James Cameron'),
    ('Quentin Tarantino'),
    ('Denis Villeneuve'),
    ('Peter Jackson'),
    ('Martin Scorsese'),
    ('Ridley Scott'),
    ('Patty Jenkins'),
    ('Greta Gerwig');

-- Inserindo atores
INSERT INTO ator (nome) VALUES
    ('Leonardo DiCaprio'),
    ('Tom Cruise'),
    ('Scarlett Johansson'),
    ('Brad Pitt'),
    ('Morgan Freeman'),
    ('Robert Downey Jr.'),
    ('Gal Gadot'),
    ('Keanu Reeves'),
    ('Matt Damon'),
    ('Emma Stone');

-- Inserindo filmes
INSERT INTO filme (titulo, ano, sinopse, poster, produtora_id, status_aprovacao) VALUES
    ('Inception', 2010, 'Um ladrão que invade sonhos deve realizar o impossível: plantar uma ideia na mente de alguém.', 'https://m.media-amazon.com/images/I/912AErFSBHL._AC_UF894,1000_QL80_.jpg', 1, 'aprovado'),
    ('Jurassic Park', 1993, 'Cientistas recriam dinossauros e os exibem em um parque temático — até que tudo dá errado.', 'https://m.media-amazon.com/images/I/81AGqBcpYOL._AC_UF894,1000_QL80_.jpg', 2, 'aprovado'),
    ('Titanic', 1997, 'Um romance trágico a bordo do navio mais famoso da história.', 'https://upload.wikimedia.org/wikipedia/pt/thumb/2/22/Titanic_poster.jpg/250px-Titanic_poster.jpg', 3, 'aprovado'),
    ('Avengers: Endgame', 2019, 'Os Vingadores se reúnem para derrotar Thanos e restaurar o equilíbrio do universo.', 'https://upload.wikimedia.org/wikipedia/pt/thumb/9/9b/Avengers_Endgame.jpg/250px-Avengers_Endgame.jpg', 4, 'aprovado'),
    ('Avatar', 2009, 'Um ex-fuzileiro é enviado ao planeta Pandora e se envolve em um conflito épico.', 'https://m.media-amazon.com/images/I/71LRjSVXCGL._AC_UF894,1000_QL80_.jpg', 3, 'aprovado'),
    ('The Lord of the Rings: The Return of the King', 2003, 'A batalha final pela Terra-média chega ao clímax enquanto Frodo tenta destruir o Anel.', 'https://upload.wikimedia.org/wikipedia/pt/0/0d/EsdlaIII.jpg', 5, 'aprovado'),
    ('The Matrix', 1999, 'Um hacker descobre que a realidade é uma simulação criada por máquinas.', 'https://upload.wikimedia.org/wikipedia/en/thumb/d/db/The_Matrix.png/250px-The_Matrix.png', 7, 'aprovado'),
    ('The Wolf of Wall Street', 2013, 'A história real de Jordan Belfort, um corretor ambicioso e corrupto de Wall Street.', 'https://upload.wikimedia.org/wikipedia/en/d/d8/The_Wolf_of_Wall_Street_%282013%29.png', 7, 'aprovado'),
    ('Wonder Woman', 2017, 'Diana, uma guerreira amazona, deixa sua ilha para lutar na Primeira Guerra Mundial.', 'https://m.media-amazon.com/images/I/81X2qjBYCVL._AC_UF1000,1000_QL80_.jpg', 9, 'aprovado'),
    ('La La Land', 2016, 'Um pianista e uma atriz vivem um intenso romance em meio aos sonhos de sucesso em Los Angeles.', 'https://upload.wikimedia.org/wikipedia/pt/thumb/c/c0/La_La_Land_%28filme%29.png/250px-La_La_Land_%28filme%29.png', 10, 'aprovado');

-- Ligando filmes e gêneros
INSERT INTO filme_genero VALUES
    (1, 1), (1, 4),
    (2, 2), (2, 9),
    (3, 3), (3, 8),
    (4, 1), (4, 4),
    (5, 2), (5, 4),
    (6, 2), (6, 9),
    (7, 1), (7, 4),
    (8, 3), (8, 5),
    (9, 1), (9, 9),
    (10, 3), (10, 8);

-- Ligando filmes e diretores
INSERT INTO filme_diretor VALUES
    (1, 1),
    (2, 2),
    (3, 3),
    (4, 4),
    (5, 3),
    (6, 6),
    (7, 8),
    (8, 7),
    (9, 9),
    (10, 10);

-- Ligando filmes e atores
INSERT INTO filme_ator VALUES
    (1, 1), (1, 4),
    (2, 2), (2, 5),
    (3, 1), (3, 9),
    (4, 6), (4, 3),
    (5, 9), (5, 2),
    (6, 5), (6, 8),
    (7, 8), (7, 5),
    (8, 1), (8, 4),
    (9, 7), (9, 6),
    (10, 10), (10, 1);

-- Selects
SELECT * FROM genero;
SELECT * FROM diretor;
SELECT * FROM ator;
SELECT * FROM produtora;
SELECT * FROM usuario;
SELECT * FROM filme;
SELECT * FROM filme_genero;
SELECT * FROM filme_diretor;
SELECT * FROM filme_ator;