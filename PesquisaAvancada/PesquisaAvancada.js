let dadosApi = []; // Variável para armazenar os dados da API
let servicoID = []; // ServiceID selecionado
let dadosFiltrados = []; // Dados filtrados (usados para exibição)


// Função para filtrar os dados por um intervalo de datas (início e fim)
async function filtrarPorPeriodo() {
    let dataInicioNF = document.getElementById('dataInicio').value;
    let dataFimNF = document.getElementById('dataFim').value;
    let prontuario = document.getElementById('filtroProntuario').value


    // Se as datas de início ou fim não forem preenchidas, usa a data atual como padrão
    if (!dataInicio || !dataFim) {
        alert('Por favor, selecione as duas datas para o período.');
        return;
    }

    // Formatar as datas antes de enviar para a API
    dataInicio = formatarData(dataInicioNF);
    dataFim = formatarData(dataFimNF);

    // Função para formatar a data no formato DD/MM/YYYY
    function formatarData(data) {
        const [ano, mes, dia] = data.split('-');
        return `${dia}/${mes}/${ano}`;
    }

    try {

        if (prontuario == null) {
            // Chama a API com o filtro de data (dataInicio, dataFim e Idservico)
            const response = await fetch(`https://localhost:7272/GetAllCheckin?startDate=${encodeURIComponent(dataInicio)}&endDate=${encodeURIComponent(dataFim)}&IdServico=${servicoID}`);
        }

        // Chama a API com o filtro de data (dataInicio, dataFim, Idservico e prontuario)
        const response = await fetch(`https://localhost:7272/GetAllCheckin?startDate=${encodeURIComponent(dataInicio)}&endDate=${encodeURIComponent(dataFim)}&prontuario=${prontuario}&IdServico=${servicoID}`);


        // Verifica se a resposta da API foi bem-sucedida (status 200)
        if (!response.ok) {
            throw new Error('Falha ao carregar os dados');
        }

        // Converte os dados recebidos da API em formato JSON
        dadosApi = await response.json();

        // Verificar os dados recebidos
        console.log('Dados recebidos da API:', dadosApi);

        // Exibe os dados filtrados na tabela
        exibirLista(dadosApi);
    } catch (error) {
        // Exibe uma mensagem de erro caso haja falha na requisição
        console.error('Erro ao carregar os dados:', error);
    }
}

// Função para filtrar a lista exibida com base no prontuário
function filtrarPorProntuario() {
    const prontuarioFiltro = document.getElementById('filtroProntuario').value.toLowerCase(); // Obtém o valor do filtro (em minúsculas)

    // Filtra os dados (dadosApi) com base no prontuário
    dadosFiltrados = dadosApi.filter(item => {
        // Se o prontuário do item incluir o valor digitado no filtro (considerando a comparação case-insensitive)
        return item.prontuario && item.prontuario.toString().toLowerCase().includes(prontuarioFiltro);
    })
};

// Função para exibir os dados na tabela
function exibirLista(dados) {
    const listaItens = document.getElementById('lista-itens');
    listaItens.innerHTML = ''; // Limpa a tabela antes de adicionar novos dados

    console.log('Exibindo dados na tabela:', dados); // Verificar dados antes de exibir

    // Itera sobre os dados e cria as linhas da tabela
    dados.forEach(item => {
        const tr = document.createElement('tr');

        // Coluna Id
        const tdId = document.createElement('td');
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = item.id;
        link.onclick = function () {
            abrirNovaJanela(item.id);  // Passa o ID para a função que abre a nova janela
        };
        tdId.appendChild(link);
        tr.appendChild(tdId);

        // Coluna Nome do Paciente
        const tdNomePaciente = document.createElement('td');
        tdNomePaciente.textContent = item.nomePaciente;
        tr.appendChild(tdNomePaciente);

        // Coluna Ambulatório
        const tdAmbulatorio = document.createElement('td');
        tdAmbulatorio.textContent = item.ambulatorio ? item.ambulatorio : 'Não disponível';
        tr.appendChild(tdAmbulatorio);

        // Coluna Unidade
        const tdUnidade = document.createElement('td');
        tdUnidade.textContent = item.unidade ? item.unidade : 'Não disponível';
        tr.appendChild(tdUnidade);


        // Coluna Data e Hora de Início
        const tdDataHoraInicio = document.createElement('td');
        if (item.dataHoraInicio) {
            const dataHoraInicioArray = item.dataHoraInicio.split(' '); // Separa data e hora
            const dataArray = dataHoraInicioArray[0].split('/'); // Separa a data
            const hora = dataHoraInicioArray[1];

            // Formata a data no formato esperado (YYYY-MM-DDTHH:mm:ss)
            const dataHoraInicioFormatada = `${dataArray[2]}-${dataArray[0]}-${dataArray[1]}T${hora}`;
            tdDataHoraInicio.textContent = new Date(dataHoraInicioFormatada).toLocaleString('pt-BR');
        } else {
            tdDataHoraInicio.textContent = 'Data inválida';
        }
        tr.appendChild(tdDataHoraInicio);

        // Coluna Prontuário
        const tdProntuario = document.createElement('td');
        tdProntuario.textContent = item.prontuario ? item.prontuario : 'Não disponível';
        tr.appendChild(tdProntuario);

        // Coluna Sucesso
        const tdSucesso = document.createElement('td');
        tdSucesso.textContent = item.sucesso === 1 ? 'Sim' : 'Não';
        tr.appendChild(tdSucesso);

        // Coluna Origem
        const tdOrigem = document.createElement('td');
        tdOrigem.textContent = item.origem ? item.origem : 'Não disponível';
        tr.appendChild(tdOrigem);

        listaItens.appendChild(tr);
    });
}

function abrirNovaJanela(id) {
    // Aqui você abre a nova janela com o ID como parâmetro na URL
    const url = `novaJanela.html?id=${id}`;  // Passando o ID como parâmetro na URL
    window.open(url, '_blank');  // Define o tamanho da janela
}


// Função para carregar as opções da API
async function carregarOpcoes() {
    const combobox = document.getElementById("myComboboxPesquisaAvancada"); // Obtém o elemento select
    combobox.innerHTML = '<option value="">Carregando...</option>'; // Exibe mensagem de carregamento

    try {
        const response = await fetch('https://localhost:7272/GetServicos'); // Substitua pela URL da sua API
        const data = await response.json(); // Supondo que a resposta seja um JSON

        // Limpa o conteúdo atual do select
        combobox.innerHTML = '';

        // Adiciona uma opção padrão
        combobox.innerHTML += '<option value="">Selecione um serviço</option>';

        // Preenche o select com as opções da API
        data.forEach(item => {
            const option = document.createElement("option");
            option.value = item.id; // Define o valor da opção (usando 'id' ou outro campo da API)
            option.textContent = item.nome; // Define o texto da opção (usando 'nome' ou outro campo da API)
            combobox.appendChild(option); // Adiciona a opção no select
        });

        // Evento de mudança do combobox para atualizar o serviço selecionado
        combobox.addEventListener('change', (event) => {
            // Atualiza a variável servicoID com o id do serviço selecionado
            servicoID = event.target.value;
            console.log('ID do serviço selecionado:', servicoID);
        });

    } catch (error) {
        console.error('Erro ao carregar os dados da API:', error);
        combobox.innerHTML = '<option value="">Erro ao carregar opções</option>'; // Caso haja erro
    }
}

// Função para exportar os dados filtrados para CSV
function exportarParaCSV() {
    const tabela = document.getElementById('lista-itens');
    const linhas = Array.from(tabela.rows);
    let csvContent = 'Nome do Paciente,Ambulatório,Unidade,Data e Hora de Início,Prontuário,Sucesso,Origem\n';

    linhas.forEach(linha => {
        const colunas = Array.from(linha.cells);
        const dados = colunas.map(coluna => coluna.textContent).join(',');
        csvContent += dados + '\n';
    });

    // Criar um link para download do arquivo CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'usuarios_exportados.csv';
    link.click();
}

// Chama a função assim que a página for carregada
window.onload = carregarOpcoes;