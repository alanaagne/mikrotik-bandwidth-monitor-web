# mikrotik-bandwidth-monitor-web

## 🎯 Objetivo

Este repositório contém o código-fonte de uma Interface Web de Monitoramento de Tráfego de Rede para roteadores Mikrotik.

## 📁 Estrutura de Pastas e Arquivos 

```
├── mikrotik-monitor-web/
│   ├── app.py                      # 1. Backend: Servidor Flask/Socket.IO
│   ├── config.py                   # 2. Backend: Configurações do Mikrotik
│   ├── requirements.txt            # 3. Backend: Lista de dependências Python
│   ├── static/                     # 4. Frontend: Arquivos estáticos (CSS, JS)
│   │   ├── css/
│   │   │   └── style.css           # Estilização da interface
│   │   └── js/
│   │       └── script.js           # 5. Frontend: Lógica do WebSocket e Gráfico Chart.js
│   └── templates/                  # 6. Frontend: Templates HTML
│       └── index.html              # Interface principal com o gráfico
└── README.md                       # 7. Documentação: Instruções de instalação e uso
```

## 💻 Tecnologias Utilizadas

### 🌐 Frontend & Visualização

- HTML5 / CSS3: Estrutura base da interface.
- JavaScript (ES6+): Lógica do lado do cliente para o tratamento de dados e gráficos.
- Chart.js: Biblioteca JavaScript leve e flexível, usada para a renderização do gráfico de linha dinâmico do bandwidth (Rx/Tx).
- Bootstrap (Opcional): Framework CSS para estilização rápida e layout responsivo, baseado no wireframe sugerido.

### ⚙️ Backend & Tempo Real

- Python: Linguagem principal do servidor.
- Flask: Micro-framework Python utilizado para o roteamento web e hospedagem da aplicação.
- Flask-SocketIO: Extensão crucial para o Flask, que permite a comunicação bidirecional e de tempo real (WebSockets) entre o servidor e o navegador.
- python-routeros (ou similar): Biblioteca Python para estabelecer a conexão, autenticação e comunicação via Mikrotik RouterOS API.
- Eventlet (ou gevent): Biblioteca de rede assíncrona utilizada pelo Socket.IO para lidar eficientemente com múltiplas conexões concorrentes.

### Dependências

Antes de rodar baixe:
```
pip install -r requirements.txt
```

### 🔬 Teste de Funcionamento e Comprovação

Esta seção demonstra como comprovar a funcionalidade em tempo real da interface web, atendendo ao requisito de apresentação.

- Pré-requisito
Certifique-se de que a aplicação Python (app.py) esteja rodando e que o navegador esteja aberto em http://127.0.0.1:5000/.

- Passo a Passo do Teste
1. Acesse o Mikrotik: Use o Winbox e conecte-se ao seu roteador virtual (MIKROTIK_HOST).

2. Abra o Bandwidth Test: No Winbox, navegue até Tools (Ferramentas) → Bandwidth Test.

3. Configurar o Teste:

- Interface: A interface que você está monitorando (ex: ether2 ou bridge-local).

- Protocol: Use TCP (recomendado para gerar tráfego constante).

- Direction: Escolha both (ambos: RX e TX) para simular tráfego de subida e descida.

- User/Password: Deixe em branco, ou use credenciais de teste.

- Iniciar o Teste de Tráfego: Clique em Start no Winbox.

Observação da Interface:

- Imediatamente, observe a interface web aberta no seu navegador.

- O gráfico de linha (trafficChart) deve registrar um pico nos dados de RX e TX.

- Os valores numéricos sob o gráfico (RX (Download) e TX (Upload)) devem exibir as taxas de transferência em KB/s ou MB/s.

- Parar o Teste: Clique em Stop no Winbox.

Comprovação: Após interromper o teste, o gráfico deve retornar rapidamente aos níveis de tráfego de baseline (próximo de zero), comprovando a comunicação contínua e em tempo real com o roteador.

## 👥 Equipe

**Este projeto foi desenvolvido por:**

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/alanaagne">
        <img src="https://avatars.githubusercontent.com/u/141842450?v=4" width="100px;" alt="Alana Ágne Brandao Rocha"/>
        <br/>
        <sub><b></b>Alana Ágne Brandao Rocha</sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Erica1110">
        <img src="https://avatars.githubusercontent.com/u/89529255?v=4" width="100px;" alt="Erica Meire Prates Ferreira"/>
        <br/>
        <sub><b></b>Erica Meire Prates Ferreira</sub>
      </a>
    </td>