import mysql.connector

# Variável "global" para armazenar a instância da conexão (Singleton)
_connection = None

# Conexão com o banco
def get_connection():
    global _connection
    
    # Se a conexão não existe ou não está mais ativa, cria uma nova
    if _connection is None or not _connection.is_connected():
        try:
            _connection = mysql.connector.connect(
                # Nome do banco do projeto
                database="starviolet",
                host="localhost",
                port="3306",
                user="root",
                password="root"
            )
            print("CONEXAO SINGLETON COM O BANCO CRIADA!")
            
        except mysql.connector.Error as err:
            print(f"Falha de conexão com o banco: {err}")
            return None
            
    # Retorna a conexão existente
    return _connection