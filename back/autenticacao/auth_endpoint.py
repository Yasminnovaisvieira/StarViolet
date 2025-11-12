import json
from autenticacao.auth_utils import verificar_senha, criar_token
from autenticacao.db_usuario import db_buscar_usuario_por_email

# Lógica de login
def logar_usuario(body):
    try:
        email = body["email"]
        senha = body["senha"]
    except KeyError:
        return json.dumps({"error": "Email e senha são obrigatórios"}), 400
    
    user = db_buscar_usuario_por_email(email)
    
    if not user:
        return json.dumps({"error": "Credenciais inválidas"}), 401
    
    if not verificar_senha(senha, user["senha"]):
        return json.dumps({"error": "Credenciais inválidas"}), 401
    
    # Cria o token
    token = criar_token(user["id_usuario"], user["tipo_usuario"], user["nome"])
    
    if not token:
        return json.dumps({"error": "Erro ao gerar token"}), 500
    
    # Retorna o JSON exato que o frontend espera
    return json.dumps({
        "access_token": token,
        "usuario": {
            "nome": user["nome"],
            "role": "admin" if user["tipo_usuario"] == "administrador" else "user"
        }
    }), 200