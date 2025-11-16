<div align="center">
  <img src="front/public/logoStarViolet.svg" alt="Logo StarViolet" width="150px" />
  
  <h1>💜StarViolet💜</h1>
  <p>Uma plataforma web completa para gerenciamento de filmes, com sistema de aprovação e autenticação de usuários.</p>

  <p>
    <img src="https://img.shields.io/badge/React-8A2BE2?style=for-the-badge&logo=react&logoColor=white" alt="React" />
    <img src="https://img.shields.io/badge/Python-008527?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
    <img src="https://img.shields.io/badge/MySQL-2773F5?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
    <img src="https://img.shields.io/badge/JWT-851717?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
  </p>
</div>


## 🎬 Contexto do Projeto

**StarViolet** é um projeto acadêmico full-stack desenvolvido durante o curso de **Desenvolvimento de Sistema** no **SENAI Roberto Mange**.
O objetivo era construir um gerenciador de filmes (CRUD) com uma página inicial atrativa, sistema de busca/filtros e um sistema de autenticação robusto que diferenciasse usuários `comuns` de `administradores`, implementando um fluxo de aprovação de conteúdo.


## ✨ Funcionalidades

### 👤 Autenticação e Segurança
* **Login de Usuário:** Sistema de login seguro usando `bcrypt` para hash de senhas e `PyJWT` para geração de tokens.
* **Rotas Protegidas:** O frontend (`App.jsx`) protege todas as rotas, redirecionando usuários não autenticados para a página de login.
* **Níveis de Acesso:** Diferenciação clara entre `usuário comum` e `administrador`, controlando o que cada um pode ver e fazer.

### 🎬 Funcionalidades de Filmes (CRUD)
* **Listagem e Home:** Página inicial com carrossel de destaques (`Swiper.js`), seções de "Novidades" e "Categorias".
* **Catálogo Completo:** Página (`/filmes`) com listagem paginada de todos os filmes aprovados.
* **Busca e Filtros:** Um componente `Filtro` permite buscar por **título**, **ano**, **diretor** e **ator**. A navegação por categorias também filtra os resultados.
* **Adicionar Filme:** Usuários (`usuário comum` e `administrador`) podem adicionar novos filmes.
* **Editar Filme:** Usuários podem editar filmes existentes.
* **Feedback Visual:** Todas as ações (Adicionar, Editar, Excluir) utilizam `Modais` para dar feedback claro de sucesso, erro ou confirmação ao usuário.

### 🛠️ Painel de Administração
* **Aprovação de Conteúdo:** O backend marca filmes adicionados por `usuários comuns` como `pendente_adicao` e edições como `pendente_edicao`.
* **Fila de Análise:** O painel `/admin` possui uma aba "Aprovar Pendências" onde o `administrador` pode ver, analisar e aprovar ou rejeitar (excluir) pedidos.
* **Permissão de Exclusão:** Apenas o `administrador` pode excluir filmes. A rota `DELETE /filmes/{id}` é protegida no backend e o botão de excluir só aparece para o administrador.


## 🚀 Tecnologias Utilizadas

### Backend (Python)
* **Servidor:** Construído em Python PURO, utilizando os módulos `http.server` (BaseHTTPRequestHandler) e `urllib.parse` para roteamento e handling de requisições.
* **Banco de Dados:** `MySQL`, acessado através do `mysql-connector-python`.
* **Padrão de Conexão:** Utiliza o padrão **Singleton** para gerenciar a conexão com o banco de dados, garantindo que apenas uma instância de conexão seja usada.
* **Autenticação:**
    * **JWT:** `PyJWT` para criar e verificar tokens de sessão.
    * **Senhas:** `bcrypt` para o hash e verificação de senhas de usuário.

### Frontend (React.js)
* **React:** Base da interface.
* **Vite:** Mantém o projeto leve e rápido.
* **Navegação:** `react-router-dom` para trocar de páginas sem recarregar.
* **Carrossel:** `Swiper.js` para deslizar os filmes na página inicial.
* **CSS:** Estilização simples e organizada por componentes, usando variáveis de cor (``variaveis.css`) para manter o visual consistente.

## ⚙️ Configuração e Instalação

Siga os passos abaixo para rodar o projeto localmente.

### 1. Pré-requisitos
* [Python 3](https://www.python.org/)
* [Node.js (LTS)](https://nodejs.org/)
* [MySQL Server](https://dev.mysql.com/downloads/mysql/)

### 2. Banco de Dados (MySQL Workbench)

1.  Inicie o seu servidor MySQL e abra o **MySQL Workbench**.
2.  Conecte-se à sua instância do MySQL (a conexão padrão geralmente é `localhost` na porta 3306).
3.  No menu superior, vá em **File** > **Open SQL Script...**.
4.  Navegue até a pasta do projeto e selecione o arquivo `banco/banco_filmes.sql`.
5.  O script será aberto em uma nova aba. Clique no **ícone de raio (⚡)** (Execute SQL Script) na barra de ferramentas para executar o script completo.
6.  Este único script fará tudo:
    * Criará o banco de dados `starviolet` (se ele não existir).
    * Selecionará o banco `starviolet`.
    * Criará todas as tabelas (`filme`, `usuario`, `genero`, etc.).
    * Inserirá os dados iniciais (contas de admin/usuário, filmes de exemplo, etc.).
7.  Quando a execução terminar (verifique o painel "Action Output" na parte inferior), clique no **ícone de "refresh"** (duas setas circulares) no painel "SCHEMAS" à esquerda. Você deverá ver o novo banco `starviolet` aparecer na lista.
8.  **Importante:** O backend está configurado para se conectar como `user="root"` e `password="root"` no `localhost:3306`. Se as credenciais que você usa no Workbench forem diferentes, **você deve** ajustar o arquivo `back/db.py` com essas mesmas credenciais para que o servidor Python consiga se conectar.

### 3. Backend (Servidor Python)
1.  Dentro do VSCode, navegue até a pasta do backend:
    ```bash
    cd .\back\
    ```
2.  (Opcional, mas recomendado) Crie um ambiente virtual:
    ```bash
    python -m venv env
    cd .\env\Scripts
    .\activate
    cd ..
    cd ..

3.  Instale as dependências:
    ```bash
    pip install -r requirements.txt
    ```
   
4.  Inicie o servidor:
    ```bash
    python main.py
    ```
   
5.  O servidor estará rodando em `http://localhost:8080`.

### 4. Frontend (Cliente React)
1.  Abra um **novo terminal** e navegue até a pasta do frontend:
    ```bash
    cd .\front\
    ```
2.  Instale os pacotes NPM:
    ```bash
    npm install
    ```
3.  Inicie a aplicação de desenvolvimento:
    ```bash
    npm run dev
    ```
   
4.  A aplicação estará acessível (provavelmente em `http://localhost:5173` - verifique o output do seu terminal).

## 🔑 Contas de Teste

Você pode usar as seguintes contas para testar os diferentes níveis de acesso:

* **Administrador:**
    * **Email:** `admin@starviolet.com`
    * **Senha:** `senha123`
* **Usuário Comum:**
    * **Email:** `user@starviolet.com`
    * **Senha:** `senha123`


## 🎨 Protótipo (Figma)

O design da interface e os protótipos de média/alta fidelidade do projeto `StarViolet` foram desenvolvidos no Figma. Você pode visualiza-lo clicando no emblema abaixo:

<a href="https://www.figma.com/design/R2VMr5cdw08ziJFXH8CU8m/StarViolet?node-id=0-1&p=f&t=NodUcD2RSPvDxP3c-0" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/Figma-910F60?style=for-the-badge&logo=figma&logoColor=white" alt="Ver Protótipo no Figma" />
</a>