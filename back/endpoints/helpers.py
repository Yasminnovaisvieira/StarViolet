def find_or_create(cursor, table_name, name_column, name_value):
    if not name_value or not name_value.strip():
        return None
    
    name_value = name_value.strip()
    id_column = f"id_{table_name}"
    
    try:
        # Tenta encontrar
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
    
    names = [name.strip() for name in names_string.split(',')]
    ids = []
    for name in names:
        if name:
            item_id = find_or_create(cursor, table_name, name_column, name)
            if item_id:
                ids.append(item_id)
    return ids


def link_many_to_many(cursor, link_table, film_id, foreign_key_column, ids):
    if not ids:
        return
    try:
        sql = f"INSERT INTO {link_table} (id_filme, {foreign_key_column}) VALUES (%s, %s)"
        params = [(film_id, id_val) for id_val in ids]
        cursor.executemany(sql, params)
    except Exception as e:
        print(f"Erro ao linkar {link_table}: {e}")
        # Ignora erros de chave duplicada se a relação já existir
        pass


def clear_links(cursor, link_table, film_id):
    try:
        cursor.execute(f"DELETE FROM {link_table} WHERE id_filme = %s", (film_id,))
    except Exception as e:
        print(f"Erro ao limpar links {link_table}: {e}")