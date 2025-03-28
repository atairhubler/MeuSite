let graficoLinhas = null;
let graficoBarras = null;
let barColors = [];

let dataHoje = new Date();
let dia = dataHoje.getDate();
let mes = dataHoje.getMonth() + 1;
let ano = dataHoje.getFullYear();
let dataFormatada = `${dia}/${mes}/${ano}`;

fetchData();
fetchDataLine();

async function fetchData() {
    try {

        const response = await fetch(`https://localhost:7272/EstatisticaCheckin?startDate=${dataFormatada}&endDate=${dataFormatada}`);
        //const response = await fetch(`https://api-paineljornada-tst.accamargo.org.br/EstatisticaCheckin?startDate=${dataFormatada}&endDate=${dataFormatada}`); 



        if (!response.ok) {
            throw new Error('Erro ao buscar dados');
        }

        const data = await response.json();
        const todayData = filterTodayData(data);
        const clientes = todayData.map(item => item.cliente);
        const checkinsDia = todayData.map(item => item.quantidadeCheckin);

        generateBarColors(todayData);
        if (graficoBarras) {
            graficoBarras.data.labels = clientes;
            graficoBarras.data.datasets[0].data = checkinsDia;
            graficoBarras.data.datasets[0].backgroundColor = barColors;
            graficoBarras.update();
        } else {
            const ctxBar = document.getElementById('graficoCheckinsDia').getContext('2d');
            graficoBarras = new Chart(ctxBar, {
                type: 'bar',
                data: {
                    labels: clientes,
                    datasets: [{
                        label: clientes,
                        data: checkinsDia,
                        backgroundColor: barColors,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]

                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            title: {
                                display: false,
                                text: 'Clientes'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Quantidade de Check-ins'
                            },
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        updateTable(clientes, checkinsDia);

    } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
    }
}

async function fetchDataLine() {
    try {
        const response = await fetch('https://localhost:7272/EstatisticaCheckin?startDate=10%2F03%2F2024&endDate=20%2F03%2F2025');

        if (!response.ok) {
            throw new Error('Erro ao buscar dados');
        }

        const data = await response.json();

        const groupedData = groupByMonth(data);

        const months = Object.keys(groupedData[Object.keys(groupedData)[0]]);
        const datasets = [];

        Object.keys(groupedData).forEach(cliente => {
            const checkins = months.map(month => groupedData[cliente][month] || 0);

            datasets.push({
                label: cliente,
                data: checkins,
                fill: false,
                borderColor: getRandomColor(),
                tension: 0.1
            });
        });

        if (graficoLinhas) {
            graficoLinhas.data.labels = months;
            graficoLinhas.data.datasets = datasets;
            graficoLinhas.update();
        } else {
            const ctxLine = document.getElementById('graficoEstatisticas').getContext('2d');
            graficoLinhas = new Chart(ctxLine, {
                type: 'line',
                data: {
                    labels: months,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Mês/Ano'
                            },
                            ticks: {
                                autoSkip: true,
                                maxTicksLimit: 6,
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Quantidade de Check-ins'
                            },
                            beginAtZero: true
                        }
                    }
                }
            });
        }

    } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
    }
}

function groupByMonth(data) {
    const groupedData = {};

    data.forEach(item => {
        const cliente = item.cliente;
        const date = item.data;
        const [year, month] = date.split("-");
        const monthKey = `${year}-${month}`;

        if (!groupedData[cliente]) {
            groupedData[cliente] = {};
        }

        if (!groupedData[cliente][monthKey]) {
            groupedData[cliente][monthKey] = 0;
        }

        groupedData[cliente][monthKey] += item.quantidadeCheckin;
    });

    return groupedData;
}

function filterTodayData(data) {

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfDayStr = today.toISOString().split('T')[0];


    return data.filter(item => {
        const itemDate = item.data;
        return itemDate == startOfDayStr;
    });
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function generateBarColors(data) {
    if (barColors.length === 0) {
        barColors = data.map(() => getRandomColor());
    }
}

function updateTable(clientes, checkinsDia) {
    const tabelaBody = document.getElementById('tabelaCheckins').getElementsByTagName('tbody')[0];
    tabelaBody.innerHTML = '';

    clientes.forEach((cliente, index) => {
        const row = tabelaBody.insertRow();
        const cellCliente = row.insertCell(0);
        const cellCheckins = row.insertCell(1);


        // Criando um link dinâmico com base no nome do cliente
        const link = document.createElement('a');
        link.href = `#${cliente}`;  // O link pode apontar para uma URL relacionada ao cliente
        link.textContent = cliente;

        // Adicionando o link à célula
        cellCliente.appendChild(link);


        cellCheckins.textContent = checkinsDia[index];
    });
}


setInterval(fetchData, 5000);
setInterval(fetchDataLine, 3600000);












//MODO FESTA!
const logo = document.querySelector('.logobe3');
const graficocheckinsdia = document.getElementById('graficoCheckinsDia');
let mp3Audio = new Audio('/assets/darude.mp3'); // Cria um objeto de áudio com o MP3


// Inicialize o contador de cliques
let clickCount = 0;

// Adicione um evento de clique ao logo
logo.addEventListener('click', () => {
    clickCount++; // Incrementa o contador a cada clique


    // Verifique se o número de cliques é 7
    if (clickCount === 7) {
        graficocheckinsdia.classList.add('festa'); // Adiciona a classe "festa" ao elemento
        alert('AGORA A FESTA VAI COMEÇAR !!!!!')

        // Começar a adicionar o GIF a cada 2 segundos
        gifInterval = setInterval(addGif, 2000);

        // Iniciar a reprodução do MP3
        mp3Audio.loop = true; // Faz a música tocar em loop
        mp3Audio.play(); // Começa a tocar o MP3

    }
    else if (clickCount === 8) {
        graficocheckinsdia.classList.remove('festa'); // Adiciona a classe "festa" ao elemento

        // Parar de adicionar o GIF
        clearInterval(gifInterval);
        // Remover todos os GIFs da tela
        removeGifs();

        // Parar a reprodução do MP3
        mp3Audio.pause(); // Pausa a música
        mp3Audio.currentTime = 0; // Reseta a música para o início
    }
});

// Função para adicionar o GIF na tela
function addGif() {
    const gif = document.createElement('img');
    gif.src = '../assets/sapinho.webp'; // Caminho para o seu GIF
    gif.alt = 'GIF Sapinho';
    gif.classList.add('sapinho-gif');
    //document.body.appendChild(gif); // Adiciona o GIF ao body da página

    // Geração de posições aleatórias para top e left
    const maxX = window.innerWidth - 100; // Largura da tela - largura do GIF
    const maxY = window.innerHeight - 100; // Altura da tela - altura do GIF

    const randomX = Math.random() * maxX; // Gera um valor aleatório para X
    const randomY = Math.random() * maxY; // Gera um valor aleatório para Y

    // Aplica a posição aleatória
    gif.style.left = `${randomX}px`;
    gif.style.top = `${randomY}px`;


    document.body.appendChild(gif); // Adiciona o GIF ao body da página
}

// Função para remover todos os GIFs da tela
function removeGifs() {
    const gifs = document.querySelectorAll('.sapinho-gif');
    gifs.forEach(gif => gif.remove());
}
