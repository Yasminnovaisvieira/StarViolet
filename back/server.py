# server.py
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs
import json

import endpoints.filme as filme
# Importa APENAS logar_usuario
from autenticacao.auth_endpoint import logar_usuario
from autenticacao.auth_utils import obter_token_do_header, verificar_token

class MyHandler(BaseHTTPRequestHandler):

    def _send_json(self, data, status=200):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()
        self.wfile.write(data.encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(204) 
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def do_GET(self):
        token = obter_token_do_header(self.headers)
        payload = verificar_token(token)
        if not payload:
            self._send_json(json.dumps({"error": "Token inválido ou ausente"}), 401)
            return
            
        parsed = urlparse(self.path)
        path_parts = parsed.path.split('/')
        query_params = parse_qs(parsed.query)
        
        try:
            # Rota: GET /filmes
            if parsed.path.startswith("/filmes") and len(path_parts) == 2:
                data, status = filme.get_filmes(query_params, payload)
                self._send_json(data, status)
                return
                
            # Rota: GET /filmes/{id}
            elif len(path_parts) == 3 and path_parts[1] == "filmes" and path_parts[2].isdigit():
                id_filme = int(path_parts[2])
                data, status = filme.get_filme_by_id(id_filme, payload)
                self._send_json(data, status)
                return
            
            self._send_json(json.dumps({"error": "Rota GET não encontrada"}), 404)
        except Exception as e:
            self._send_json(json.dumps({"error": f"Erro interno no servidor: {e}"}), 500)
        
    def do_POST(self):
        parsed = urlparse(self.path)
        
        try:
            length = int(self.headers["Content-Length"])
            body = json.loads(self.rfile.read(length).decode('utf-8'))
        except:
            self._send_json(json.dumps({"error": "Corpo da requisição inválido"}), 400)
            return

        # --- Rota Pública (Apenas Login) ---
        if parsed.path == "/login":
            data, status = logar_usuario(body)
            self._send_json(data, status)
            return

        # --- Rotas Privadas (Exigem Token) ---
        token = obter_token_do_header(self.headers)
        payload = verificar_token(token)
        if not payload:
            self._send_json(json.dumps({"error": "Token inválido ou ausente"}), 401)
            return
            
        # Rota: POST /filmes
        if parsed.path == "/filmes":
            data, status = filme.post_filme(body, payload)
            self._send_json(data, status)
            return

        self._send_json(json.dumps({"error": "Rota POST não encontrada"}), 404)
   
    def do_PATCH(self):
        token = obter_token_do_header(self.headers)
        payload = verificar_token(token)
        if not payload:
            self._send_json(json.dumps({"error": "Token inválido ou ausente"}), 401)
            return
            
        parsed = urlparse(self.path)
        path_parts = parsed.path.split('/')
        
        try:
            length = int(self.headers["Content-Length"])
            body = json.loads(self.rfile.read(length).decode('utf-8'))
        except:
            self._send_json(json.dumps({"error": "Corpo da requisição inválido"}), 400)
            return
    
        # Rota: PATCH /filmes/{id} (Usado para Editar e Aprovar)
        if len(path_parts) == 3 and path_parts[1] == "filmes" and path_parts[2].isdigit():
            id_filme = int(path_parts[2])
            data, status = filme.patch_filme(id_filme, body, payload)
            self._send_json(data, status)
            return
        
        self._send_json(json.dumps({"error": "Rota PATCH não encontrada"}), 404)
   
    def do_DELETE(self):
        token = obter_token_do_header(self.headers)
        payload = verificar_token(token)
        
        # Proteção: Apenas Admin pode deletar (Req)
        if not payload or payload['role'] != 'admin':
            self._send_json(json.dumps({"error": "Acesso negado: Requer privilégios de Administrador"}), 403)
            return
        
        parsed = urlparse(self.path)
        path_parts = parsed.path.split('/')
        
        # Rota: DELETE /filmes/{id}
        if len(path_parts) == 3 and path_parts[1] == "filmes" and path_parts[2].isdigit():
            id_filme = int(path_parts[2])
            data, status = filme.delete_filme(id_filme)
            self._send_json(data, status)
            return
            
        self._send_json(json.dumps({"error": "Rota DELETE não encontrada"}), 404)

# --- Ponto de Entrada ---
def run_server(host="localhost", port=8080):
    server_address = (host, port)
    httpd = HTTPServer(server_address, MyHandler)
    print(f"Servidor StarViolet (Python Puro) rodando em http://{host}:{port}")
    httpd.serve_forever()