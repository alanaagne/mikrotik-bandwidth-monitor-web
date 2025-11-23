// 1. Variáveis de Configuração do Gráfico 

// Constantes para o número de pontos a serem exibidos no gráfico
const MAX_DATA_POINTS = 30; // Exibe os últimos 30 segundos de dados
let trafficChart; // Variável global para o objeto Chart.js

// 2. Função de Inicialização do Gráfico 

function initializeChart() {
    // Configuração inicial do gráfico de linha
    const ctx = document.getElementById('trafficChart').getContext('2d');
    
    trafficChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array(MAX_DATA_POINTS).fill(''), // Inicializa com rótulos vazios
            datasets: [
                {
                    label: 'RX (Download) B/s',
                    data: Array(MAX_DATA_POINTS).fill(0),
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    tension: 0.1
                },
                {
                    label: 'TX (Upload) B/s',
                    data: Array(MAX_DATA_POINTS).fill(0),
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    tension: 0.1
                }
            ]
        },
        options: {
            animation: false, // Desativa animações para melhor desempenho em tempo real
            responsive: true,
            maintainAspectRatio: false, // Permite que o CSS controle o tamanho
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Tráfego (B/s)'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: `Monitoramento em Tempo Real - Últimos ${MAX_DATA_POINTS} segundos`
                }
            }
        }
    });
}

//  3. Função Auxiliar para Conversão de Bytes 

function formatBytes(bytes) {
    if (bytes === 0) return '0 B/s';
    const k = 1024;
    const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    // Retorna o valor com 2 casas decimais e a unidade
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}


//  4. Lógica de Conexão Socket.IO e Atualização 

document.addEventListener('DOMContentLoaded', () => {
    // Inicia o Gráfico quando a página carrega
    initializeChart(); 

    //  Conecta ao Socket.IO
    // Conecta ao namespace /traffic que definimos no app.py
    const socket = io('/traffic'); 

    //  Ouvinte para novos dados de tráfego
    socket.on('new_traffic_data', (data) => {
        // Formata o timestamp para um label mais legível 
        const now = new Date(data.timestamp);
        const label = now.toLocaleTimeString('pt-BR');
        
        //  Atualiza os valores numéricos na interface
        document.getElementById('rx-value').textContent = formatBytes(data.rx);
        document.getElementById('tx-value').textContent = formatBytes(data.tx);

        //  Atualiza os DataSets do Chart.js
        
        // Remove o ponto mais antigo do eixo X
        trafficChart.data.labels.shift(); 
        // Adiciona o novo timestamp ao eixo X
        trafficChart.data.labels.push(label); 

        // Remove o ponto mais antigo do RX e adiciona o novo valor
        trafficChart.data.datasets[0].data.shift();
        trafficChart.data.datasets[0].data.push(data.rx);

        // Remove o ponto mais antigo do TX e adiciona o novo valor
        trafficChart.data.datasets[1].data.shift();
        trafficChart.data.datasets[1].data.push(data.tx);

        //  Desenha o gráfico novamente
        trafficChart.update();
    });

    //  Exibe a interface monitorada
    // para mostrar a interface monitorada, pode fazer uma chamada API no Flask
    // para enviar essa informação. Por simplicidade, definir o nome da interface aqui.
    document.getElementById('interface-name').textContent = 'Interface Mikrotik (ether2)'; 
});