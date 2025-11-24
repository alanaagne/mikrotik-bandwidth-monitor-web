// MIKROTIK BANDWIDTH MONITOR - POLLING MANUAL
const MAX_DATA_POINTS = 30;
let trafficChart;

function initializeChart() {
    console.log("Inicializando gráfico...");
    const ctx = document.getElementById('trafficChart').getContext('2d');
    
    trafficChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array(MAX_DATA_POINTS).fill(''),
            datasets: [
                {
                    label: 'RX (Download) B/s',
                    data: Array(MAX_DATA_POINTS).fill(0),
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.1,
                    borderWidth: 2
                },
                {
                    label: 'TX (Upload) B/s',
                    data: Array(MAX_DATA_POINTS).fill(0),
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    tension: 0.1,
                    borderWidth: 2
                }
            ]
        },
        options: {
            animation: false,
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Tráfego (Bytes/segundo)'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: `Monitoramento em Tempo Real - Polling`
                }
            }
        }
    });
    console.log("Gráfico inicializado!");
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 B/s';
    const k = 1024;
    const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// POLLING MANUAL - Busca dados a cada segundo
async function fetchTrafficData() {
    try {
        const response = await fetch('/api/traffic');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log("Dados recebidos:", data);
        
        // Atualiza os valores numéricos
        document.getElementById('rx-value').textContent = formatBytes(data.rx);
        document.getElementById('tx-value').textContent = formatBytes(data.tx);
        document.getElementById('interface-name').textContent = 'ether1 (Ativo)';

        // Atualiza o gráfico
        if (trafficChart) {
            // Remove o ponto mais antigo
            trafficChart.data.labels.shift();
            trafficChart.data.datasets[0].data.shift();
            trafficChart.data.datasets[1].data.shift();

            // Adiciona novos dados
            const now = new Date(data.timestamp);
            trafficChart.data.labels.push(now.toLocaleTimeString('pt-BR'));
            trafficChart.data.datasets[0].data.push(data.rx);
            trafficChart.data.datasets[1].data.push(data.tx);

            // Atualiza o gráfico sem animação
            trafficChart.update('none');
        }
        
        return true;
        
    } catch (error) {
        console.log("Erro ao buscar dados:", error);
        document.getElementById('interface-name').textContent = 'ether1 (Erro)';
        return false;
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    console.log("Página carregada - inicializando Polling Manual...");
    
    // Inicia o gráfico
    initializeChart();
    document.getElementById('interface-name').textContent = 'ether1 (Conectando...)';

    // Inicia o polling a cada segundo
    setInterval(fetchTrafficData, 1000);
    
    // Primeira busca imediata
    setTimeout(fetchTrafficData, 500);
    
    console.log("Polling Manual Iniciado - Dados a cada 1 segundo");
});

// Função para teste manual
function testManual() {
    if (trafficChart) {
        trafficChart.data.datasets[0].data.push(1000000);
        trafficChart.data.datasets[1].data.push(500000);
        trafficChart.update();
        console.log("Teste manual aplicado!");
    }
}