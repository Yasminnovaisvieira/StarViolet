# Busca um item (ex: Gênero) pelo nome da tabela. Se não existir, cria o novo item. Também Retorna o ID (seja o existente ou o novo).
def find_or_create(cursor, table_name, name_column, name_value):
    if not name_value or not name_value.strip():
        return None
    
    name_value = name_value.strip() # Limpa espaços em branco
    id_column = f"id_{table_name}" # Define o nome da coluna de ID por padrão
    
    try:
        # Tenta encontrar o item pelo nome
        cursor.execute(f"SELECT {id_column} FROM {table_name} WHERE {name_column} = %s", (name_value,))
        result = cursor.fetchone()
        
        if result:
            return result[0]
        else:
            # Cria se não existir
            cursor.execute(f"INSERT INTO {table_name} ({name_column}) VALUES (%s)", (name_value,))
            return cursor.lastrowid
    except Exception as e:
        print(f"Erro em find_or_create ({table_name}): {e}")
        # Tenta de novo em caso de erro de concorrência (race condition)
        cursor.execute(f"SELECT {id_column} FROM {table_name} WHERE {name_column} = %s", (name_value,))
        result = cursor.fetchone()
        if result:
            return result[0]
        return None


def get_ids_from_names_string(cursor, table_name, name_column, names_string):
    if not names_string or not names_string.strip():
        return []
    
    # Quebra a string pela vírgula e limpa os espaços de cada nome
    names = [name.strip() for name in names_string.split(',')]
    ids = []

    for name in names:
        if name: # Ignora nomes vazios
            item_id = find_or_create(cursor, table_name, name_column, name) # Para cada nome, acha ou cria o id

            if item_id:
                ids.append(item_id)

    return ids


def link_many_to_many(cursor, link_table, film_id, foreign_key_column, ids):
    # Se a lista de IDs estiver vazia, não faz nada
    if not ids:
        return
    
    try:
        sql = f"INSERT INTO {link_table} (id_filme, {foreign_key_column}) VALUES (%s, %s)"
        params = [(film_id, id_val) for id_val in ids]
        cursor.executemany(sql, params) # Usa 'executemany' para inserir todos os registros de uma vez

    except Exception as e:
        print(f"Erro ao linkar {link_table}: {e}")
        # Ignora erros de chave duplicada se a relação já existir
        pass

# Apaga todos os registros de um filme em uma tabela de intermediária. Usado antes do PATCH para limpar os links antigos
def clear_links(cursor, link_table, film_id):
    try:
        cursor.execute(f"DELETE FROM {link_table} WHERE id_filme = %s", (film_id,))
    except Exception as e:
        print(f"Erro ao limpar links {link_table}: {e}")