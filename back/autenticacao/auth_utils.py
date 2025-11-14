import bcrypt # Senhas criptografadas
import jwt # Cria e verifica JWT
import datetime

# Chave secreta para "assinar" e verificar os tokens, e algoritmo de criptografia usada para o JWT
JWT_SECRET = "SENHASECRETA_STARVIOLET"
JWT_ALGORITHM = "HS256"

# Função para verificar a senha no banco
def verificar_senha(senha, hash_armazenado):
    try:
        if isinstance(hash_armazenado, bytes):
            hash_armazenado = hash_armazenado.decode('utf-8')
            
        return bcrypt.checkpw(senha.encode('utf-8'), hash_armazenado.encode('utf-8'))
    
    except Exception as e:
        print(f"Erro ao verificar senha: {e}")
        return False

# Criação do token
def criar_token(id_usuario, tipo_usuario, nome):
    try:
        # Dados que serão armazenados dentro do token
        payload = {
            "sub": str(id_usuario),
            "role": "admin" if tipo_usuario == "administrador" else "user", # Mapeia 'administrador' (banco) para 'admin' (frontend)
            "nome": nome,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24) # Quando o token expira
        }
        token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
        return token.decode('utf-8') if isinstance(token, bytes) else token
    
    except Exception as e:
        print(f"Erro ao criar token: {e}")
        return None

# Verifica se o token enviado é igual ao do login
def verificar_token(token):
    try:
        # Tenta decodificar o token usando a chave secreta
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    
    except Exception as e:
        return None

# Busca o token do header
def obter_token_do_header(headers):
    auth_header = headers.get('Authorization') or headers.get('authorization')

    if not auth_header:
        return None
    
    parts = auth_header.split(' ')

    if len(parts) != 2 or parts[0].lower() != 'bearer':
        return None
    
    # Retorna apenas a segunda parte, que é o token
    return parts[1]