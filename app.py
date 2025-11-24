import time
import os
from flask import Flask, render_template, jsonify
from routeros_api import RouterOsApiPool
from config import MIKROTIK_HOST, MIKROTIK_USER, MIKROTIK_PASSWORD, INTERFACE_TO_MONITOR, COLLECTION_INTERVAL_SECONDS

app = Flask(__name__)
app.config['SECRET_KEY'] = 'teste123'

def collect_traffic_data():
    """Coleta dados de tráfego do Mikrotik."""
    try:
        pool = RouterOsApiPool(
            MIKROTIK_HOST,
            username=MIKROTIK_USER,
            password=MIKROTIK_PASSWORD,
            plaintext_login=True,
            port=8728
        )
        connection = pool.get_api()
        
        traffic_data = connection.get_resource('/interface').call(
            'monitor-traffic',
            {'interface': INTERFACE_TO_MONITOR, 'once': ''}
        )
        
        if traffic_data:
            data = traffic_data[0]
            rx_bps = int(data.get('rx-bits-per-second', 0))
            tx_bps = int(data.get('tx-bits-per-second', 0))
            
            rx_bytes = rx_bps / 8
            tx_bytes = tx_bps / 8
            
            payload = {
                'rx': rx_bytes,
                'tx': tx_bytes,
                'timestamp': time.time() * 1000
            }
            
            print(f"Dados: RX={rx_bytes:.0f}B/s, TX={tx_bytes:.0f}B/s")
            pool.disconnect()
            return payload
        
        pool.disconnect()
        return None
        
    except Exception as e:
        print(f"Erro na coleta: {e}")
        return None

@app.route('/')
def index():
    """Página principal."""
    print("Página acessada - servindo index.html")
    return render_template('index.html')

@app.route('/api/traffic')
def api_traffic():
    """API para dados de tráfego."""
    print("API acessada")
    data = collect_traffic_data()
    if data:
        return jsonify(data)
    else:
        return jsonify({'rx': 0, 'tx': 0, 'timestamp': time.time() * 1000})

if __name__ == '__main__':
    print("Servidor Mikrotik Monitor rodando em http://127.0.0.1:5000")
    app.run(host='127.0.0.1', port=5000, debug=True)