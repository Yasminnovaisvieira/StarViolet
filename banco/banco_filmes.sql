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
    status_aprovacao ENUM('aprovado', 'pendente_adicao', 'pendente_edicao') NOT NULL DEFAULT 'pendente_adicao',
    FOREIGN KEY (produtora_id) REFERENCES produtora(id_produtora)
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
('Admin', 'admin@starviolet.com', '$2b$12$d/oMMzhEwilEcpkKzRZkuOdRGJ2X2YxT2QC5wLERhqQoOL2xuOf3i', 'administrador')
ON DUPLICATE KEY UPDATE nome = 'Admin', tipo_usuario = 'administrador';

INSERT INTO usuario (nome, email, senha, tipo_usuario) 
VALUES 
('Usuário', 'user@starviolet.com', '$2b$12$g.lG8oY.f29iY/14zNJjLOz1xblqyiG..3qYJ./JtN02.FkGjb6Wy', 'comum')
ON DUPLICATE KEY UPDATE nome = 'Usuário', tipo_usuario = 'comum';

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