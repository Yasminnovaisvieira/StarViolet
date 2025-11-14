from db import get_connection

# Função para buscar o usuário no banco
def db_buscar_usuario_por_email(email):
    try:
        # Pede uma nova conexão com o banco de dados
        conn = get_connection()

        if conn is None: 
            print("db_buscar_usuario_por_email: Falha ao conectar ao banco")
            return None
            
        cursor = conn.cursor(dictionary=True) 
        # Usa o nome da coluna do banco
        cursor.execute("SELECT * FROM usuario WHERE email = %s", (email,))
        
        user = cursor.fetchone()
        
        cursor.close()

        return user 
        
    except Exception as e:
        print(f"Erro ao buscar usuário por email: {str(e)}")
        return None