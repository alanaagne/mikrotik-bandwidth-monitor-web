import time
import os
import eventlet
from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from routeros.api import Api # Importa a biblioteca da API do Mikrotik
from config import MIKROTIK_HOST, MIKROTIK_USER, MIKROTIK_PASSWORD, INTERFACE_TO_MONITOR, COLLECTION_INTERVAL_SECONDS
# Configuração inicial do Flask e SocketIO
app = Flask(__name__)
# A chave secreta é lida do ambiente (do arquivo .env, via config.py ou diretamente)
app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY', 'default_fallback_key') # Use um valor fallback, mas priorize o .env
# Usa o Eventlet como servidor (recomendado para SocketIO)
socketio = SocketIO(app, async_mode='eventlet') 

# Variável de controle para o loop de monitoramento
thread = None

#  Funções de Conexão e Coleta de Dados 

def connect_to_mikrotik():
    """Tenta conectar ao Mikrotik e retorna o objeto de conexão da API."""
    try:
        # Tenta se conectar ao host Mikrotik usando as credenciais do config.py
        connection = Api(MIKROTIK_HOST, MIKROTIK_USER, MIKROTIK_PASSWORD)
        print(">>> Conexão com Mikrotik estabelecida com sucesso.")
        return connection
    except Exception as e:
        print(f"!!! ERRO ao conectar ao Mikrotik: {e}")
        return None

def background_traffic_collector():
    """Rotina em background que coleta e envia dados de tráfego."""
    global thread

    # Conecta-se à API do Mikrotik uma vez
    mt_connection = connect_to_mikrotik()
    if not mt_connection:
        print("!!! Coletor não iniciado: Falha na conexão com Mikrotik.")
        return

    print(">>> Iniciando rotina de coleta de tráfego...")
    
    while True:
        # Pausa o loop pelo tempo definido (ex: 1 segundo)
        eventlet.sleep(COLLECTION_INTERVAL_SECONDS)
        
        try:
            # Comando API para monitorar o tráfego da interface em tempo real (apenas uma leitura)
            # O 'once=True' faz uma única leitura em vez de um stream contínuo
            traffic_data = mt_connection.talk(
                "/interface/monitor-traffic",
                "=interface=" + INTERFACE_TO_MONITOR,
                "=once="
            )

            if traffic_data and isinstance(traffic_data, list):
                # Pega o primeiro (e único) resultado da lista
                data = traffic_data[0]
                
                # Extrai RX e TX (em bytes/segundo)
                # Os valores são strings, convertemos para inteiro
                rx_bytes = int(data.get('rx-byte'))
                tx_bytes = int(data.get('tx-byte'))
                
                # Prepara o objeto de dados a ser enviado para o frontend
                payload = {
                    'rx': rx_bytes,
                    'tx': tx_bytes,
                    'timestamp': time.time() * 1000  # Timestamp em milissegundos para JS
                }
                
                # Envia (emite) os dados para TODOS os clientes conectados via SocketIO
                socketio.emit('new_traffic_data', payload, namespace='/traffic')

                print(f"Dados enviados: RX={rx_bytes}, TX={tx_bytes}")

        except Exception as e:
            print(f"!!! ERRO durante a coleta/emissão de dados: {e}")
            mt_connection = connect_to_mikrotik() # Tenta reconectar em caso de erro

# Rotas Web e Eventos SocketIO 

@app.route('/')
def index():
    """Rota principal que renderiza o template HTML do dashboard."""
    return render_template('index.html')

@socketio.on('connect', namespace='/traffic')
def handle_connect():
    """Lida com a conexão de um novo cliente SocketIO."""
    global thread
    print("Cliente conectado via SocketIO.")
    
    # Inicia o thread de coleta se for o primeiro cliente a se conectar
    if thread is None:
        # Cria e inicia o thread de background
        thread = socketio.start_background_task(target=background_traffic_collector)

# Execução Principal 

if __name__ == '__main__':
    # Inicia a aplicação usando o Eventlet
    # A porta padrão 5000 é usada, mas você pode mudar se necessário
    socketio.run(app, host='0.0.0.0', port=5000)