import os
from dotenv import load_dotenv

# Carrega as variáveis de ambiente do arquivo .env
load_dotenv()

# Dados de conexão com o Mikrotik (lidos do .env)
MIKROTIK_HOST = os.getenv("MIKROTIK_HOST", "192.168.88.1")
MIKROTIK_USER = os.getenv("MIKROTIK_USER", "admin")
MIKROTIK_PASSWORD = os.getenv("MIKROTIK_PASSWORD", "")
MIKROTIK_PORT = 8728

# Parâmetros de monitoramento (lidos do .env)
INTERFACE_TO_MONITOR = os.getenv("INTERFACE_TO_MONITOR", "ether2")
COLLECTION_INTERVAL_SECONDS = 1