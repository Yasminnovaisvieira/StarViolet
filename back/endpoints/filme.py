from db import get_connection
import json
from endpoints.helpers import find_or_create, get_ids_from_names_string, link_many_to_many, clear_links

DEFAULT_POSTER_URL = "/imgPreta.png"

# Junta todas as tabelas relacionadas ao filme para retornar um objeto "completo" em uma única consulta.
def _get_base_query():
    return """
        SELECT 
            f.*, 
            p.nome AS produtora,
            
            -- O frontend espera 'genero' como string, mas o banco permite múltiplos.
            SUBSTRING_INDEX(GROUP_CONCAT(DISTINCT g.nome SEPARATOR ', '), ',', 1) AS genero,
            
            GROUP_CONCAT(DISTINCT a.nome SEPARATOR ', ') AS atores,
            
            -- Mesmo caso do genero, o frontend só suporta 1 diretor
            SUBSTRING_INDEX(GROUP_CONCAT(DISTINCT d.nome SEPARATOR ', '), ',', 1) AS diretor
            
        FROM filme f
        LEFT JOIN produtora p ON f.produtora_id = p.id_produtora
        LEFT JOIN filme_genero fg ON f.id_filme = fg.id_filme
        LEFT JOIN genero g ON fg.id_genero = g.id_genero
        LEFT JOIN filme_ator fa ON f.id_filme = fa.id_filme
        LEFT JOIN ator a ON fa.id_ator = a.id_ator
        LEFT JOIN filme_diretor fd ON f.id_filme = fd.id_filme
        LEFT JOIN diretor d ON fd.id_diretor = d.id_diretor
    """

def _construir_query_filtro(filters, payload):
    # Verifica se o usuário logado é um admin
    is_admin = payload['role'] == 'admin'
    
    # Pega a query principal
    query = _get_base_query()
    
    where_clauses = []
    params = []
    
    # Lógica de Status
    if not is_admin:
        # Se NÃO for admin, o usuário comum SÓ PODE ver filmes 'aprovado'
        where_clauses.append("f.status_aprovacao = 'aprovado'")

    # Filtros
    if 'q' in filters and filters['q'][0]:
        where_clauses.append("f.titulo LIKE %s")
        params.append(f"%{filters['q'][0]}%") # '%' para busca 'LIKE'

    if 'ano' in filters and filters['ano'][0]:
        where_clauses.append("f.ano = %s")
        params.append(filters['ano'][0])
    
    if 'genero' in filters and filters['genero'][0]:
        where_clauses.append("g.nome = %s")
        params.append(filters['genero'][0])

    if 'diretor' in filters and filters['diretor'][0]:
        where_clauses.append("d.nome LIKE %s")
        params.append(f"%{filters['diretor'][0]}%")

    if 'ator' in filters and filters['ator'][0]:
        where_clauses.append("a.nome LIKE %s")
        params.append(f"%{filters['ator'][0]}%")
    
    # Se houver pelo menos uma condição na lista
    if where_clauses:
        query += " WHERE " + " AND ".join(where_clauses)
        
    query += " GROUP BY f.id_filme ORDER BY f.id_filme DESC"
    
    return query, tuple(params)

# GET
def get_filmes(filters, payload):
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Monta a query dinâmica com base nos filtros e permissões do usuário
        final_query, params = _construir_query_filtro(filters, payload)
        
        # Executa a query no banco
        cursor.execute(final_query, params)
        data = cursor.fetchall() # Pega todos os resultados
        
        cursor.close()
        return json.dumps(data), 200
    
    except Exception as e:
        print(f"Erro em get_filmes: {e}")
        return json.dumps({"error": str(e)}), 500

# GET por ID
def get_filme_by_id(id_filme, payload):
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        
        query = _get_base_query() + " WHERE f.id_filme = %s GROUP BY f.id_filme"
        params = (id_filme,)
        
        cursor.execute(query, params)
        data = cursor.fetchone() # Pega o (único) resultado
        cursor.close()
        
        if data:
            # Usuário comum não pode ver filme pendente
            is_admin = payload['role'] == 'admin'
            if not is_admin and data['status_aprovacao'] != 'aprovado':
                 return json.dumps({"error": "Filme não encontrado ou pendente"}), 404
            # Finge que não existe
            return json.dumps(data), 200
        else:
            return json.dumps({"error": "Filme não encontrado"}), 404
    except Exception as e:
        return json.dumps({"error": str(e)}), 500

# POST
def post_filme(body, payload):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        produtora_id = find_or_create(cursor, 'produtora', 'nome', body.get('produtora'))

        if payload['role'] == 'admin':
            status = 'aprovado' # Admin cria filme já aprovado
        else:
            status = 'pendente_adicao' # Usuário comum cria filme como pendente

        poster_url = body.get('poster')
        if not poster_url or not poster_url.strip():
            poster_url = DEFAULT_POSTER_URL

        sql_filme = """
            INSERT INTO filme (titulo, ano, sinopse, poster, produtora_id, status_aprovacao) 
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        params_filme = (
            body.get('titulo'), body.get('ano'), body.get('sinopse'),
            poster_url, # Usando a variável com o default
            produtora_id, status
        )
        cursor.execute(sql_filme, params_filme)
        film_id = cursor.lastrowid

        # Gênero
        genero_id = find_or_create(cursor, 'genero', 'nome', body.get('genero'))
        if genero_id:
            link_many_to_many(cursor, 'filme_genero', film_id, 'id_genero', [genero_id])
            
        # Atores
        ator_ids = get_ids_from_names_string(cursor, 'ator', 'nome', body.get('atores'))
        link_many_to_many(cursor, 'filme_ator', film_id, 'id_ator', ator_ids)
        
        # Diretor
        diretor_id = find_or_create(cursor, 'diretor', 'nome', body.get('diretor'))
        if diretor_id:
            link_many_to_many(cursor, 'filme_diretor', film_id, 'id_diretor', [diretor_id])

        conn.commit()
        
        cursor.close()
        data, status_code = get_filme_by_id(film_id, payload)
        return data, 201

    except Exception as e:
        conn.rollback()
        cursor.close()
        print(f"Erro em post_filme: {e}")
        return json.dumps({"error": str(e)}), 500

# PATCH
def patch_filme(id_filme, body, payload):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True) # Dictionary cursor para ler
    
    try:
        # Verifica se o filme existe
        cursor.execute("SELECT * FROM filme WHERE id_filme = %s", (id_filme,))
        dados_atuais = cursor.fetchone()
        if not dados_atuais:
            raise Exception("Filme não encontrado")

        is_admin = payload['role'] == 'admin'
        
        if 'status_aprovacao' in body and is_admin:
            status = body['status_aprovacao'] # Admin aprovando/rejeitando
        elif is_admin:
            status = 'aprovado' # Admin editando
        else:
            status = 'pendente_edicao' # Usuário comum editando

        # Encontra/Cria Produtora
        produtora_nome = body.get('produtora', dados_atuais.get('produtora')) # Pega o nome
        cursor_writer = conn.cursor()
        produtora_id = find_or_create(cursor_writer, 'produtora', 'nome', produtora_nome)

        # Atualiza o Filme principal
        sql_update = """
            UPDATE filme SET 
            titulo = %s, ano = %s, sinopse = %s, poster = %s, 
            produtora_id = %s, status_aprovacao = %s
            WHERE id_filme = %s
        """
        params_update = (
            body.get('titulo', dados_atuais['titulo']),
            body.get('ano', dados_atuais['ano']),
            body.get('sinopse', dados_atuais['sinopse']),
            body.get('poster', dados_atuais['poster']),
            produtora_id,
            status,
            id_filme
        )
        cursor_writer.execute(sql_update, params_update)
        
        # Gênero
        if 'genero' in body:
            clear_links(cursor_writer, 'filme_genero', id_filme)
            genero_id = find_or_create(cursor_writer, 'genero', 'nome', body.get('genero'))
            if genero_id:
                link_many_to_many(cursor_writer, 'filme_genero', id_filme, 'id_genero', [genero_id])
        
        # Atores
        if 'atores' in body:
            clear_links(cursor_writer, 'filme_ator', id_filme)
            ator_ids = get_ids_from_names_string(cursor_writer, 'ator', 'nome', body.get('atores'))
            link_many_to_many(cursor_writer, 'filme_ator', id_filme, 'id_ator', ator_ids)
            
        # Diretor
        if 'diretor' in body:
            clear_links(cursor_writer, 'filme_diretor', id_filme)
            diretor_id = find_or_create(cursor_writer, 'diretor', 'nome', body.get('diretor'))
            if diretor_id:
                link_many_to_many(cursor_writer, 'filme_diretor', id_filme, 'id_diretor', [diretor_id])

        conn.commit() # Salva as mudanças
        cursor.close()
        cursor_writer.close()

        # Retorna o filme atualizado
        data, status_code = get_filme_by_id(id_filme, payload)
        return data, 200

    except Exception as e:
        conn.rollback() # Desfaz tudo se der erro
        cursor.close()
        print(f"Erro em patch_filme: {e}")
        return json.dumps({"error": str(e)}), 500

# DELETE
def delete_filme(id_filme):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM filme WHERE id_filme = %s", (id_filme,))
        conn.commit()
        
        # 'rowcount' diz quantas linhas foram deletadas
        if cursor.rowcount == 0:
            raise Exception("Filme não encontrado")
            
        cursor.close()
        return json.dumps({"message": "Filme excluido com sucesso"}), 200
    
    except Exception as e:
        conn.rollback() # Desfaz se der erro
        cursor.close()
        print(f"Erro em delete_filme: {e}")
        return json.dumps({"error": str(e)}), 500