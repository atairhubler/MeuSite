 // Variáveis para armazenar os dados da API
 let dadosApi = [];

 // Função para buscar os dados da API
 async function filtrarPorPeriodo() {
     let dataInicio = document.getElementById('dataInicio').value;
     let dataFim = document.getElementById('dataFim').value;

     // Se as datas de início ou fim não forem preenchidas, usa a data atual como padrão
     if (!dataInicio || !dataFim) {
         alert('Por favor, selecione as duas datas para o período.');
         return;
     }

     // Formatar as datas antes de enviar para a API
     dataInicio = formatarData(dataInicio);
     dataFim = formatarData(dataFim);

     // Função para formatar a data no formato DD/MM/YYYY
     function formatarData(data) {
     const [ano, mes, dia] = data.split('-');
     return `${dia}/${mes}/${ano}`;
     }

     
     try {
         
         // CHAMA A API DE QUANTIDADE DE CHECK-IN COM FILTRO DE DATA (startDate e endDate)
         const response = await fetch(`https://localhost:7272/GetQuantidadeCheckin?startDate=${dataInicio}&endDate=${dataFim}`);
         
         // Verifica se alguma resposta da API não foi bem-sucedida (status 200)
         if (!response.ok) {
             throw new Error('Falha ao carregar response');
         }
         
         
         // Converte os dados recebidos da API em formato JSON
         dadosApi = await response.json();
         
         const quantidadeCheckin = dadosApi[0]?.quantidadeCheckin;
         
          // Verificar os dados recebidos
         console.log('Dados recebidos da API após converter para json :', dadosApi);
         
         // Exibe os dados filtrados na tabela
         exibirLista(quantidadeCheckin);
     
          
     } catch (error) {
         console.error('Erro ao carregar os dados:', error);
     }
 }

 // Função para atualizar as tabelas com os dados da API
 function exibirLista(quantidadeCheckin) {

     const quantidadeCheckinElemento = document.getElementById('quantidadeCheckin');

     if (quantidadeCheckinElemento) {
         quantidadeCheckinElemento.textContent = quantidadeCheckin || '0'; // Caso não exista dado, mostrar '0'
     }
  };
 
  // Função para exportar os dados para CSV
 function exportarCSV() {
     const wb = XLSX.utils.book_new();

     // Adiciona as abas
     const tabelaCheckin = document.getElementById('tabelaCheckin');
     const checkinData = XLSX.utils.table_to_sheet(tabelaCheckin);
     XLSX.utils.book_append_sheet(wb, checkinData, "Check-ins");

     const tabelaWebcheckin = document.getElementById('tabelaWebcheckin');
     const webcheckinData = XLSX.utils.table_to_sheet(tabelaWebcheckin);
     XLSX.utils.book_append_sheet(wb, webcheckinData, "Webcheck-ins");

     const tabelaDocumentosAssinados = document.getElementById('tabelaDocumentosAssinados');
     const documentosAssinadosData = XLSX.utils.table_to_sheet(tabelaDocumentosAssinados);
     XLSX.utils.book_append_sheet(wb, documentosAssinadosData, "Documentos Assinados");

     const tabelaSenhasGeradas = document.getElementById('tabelaSenhasGeradas');
     const senhasGeradasData = XLSX.utils.table_to_sheet(tabelaSenhasGeradas);
     XLSX.utils.book_append_sheet(wb, senhasGeradasData, "Senhas Geradas");

     XLSX.writeFile(wb, "Dashboard_Resultado.xlsx");
 }

 // Chama a função para carregar os dados assim que a página for carregada
 //window.onload = filtrarPorPeriodo();


 document.addEventListener("DOMContentLoaded", function () {
    // URL da sua API
    //const apiUrl = "https://exemplo.com/api/dados"; // Substitua pela sua URL da API

    // Função para preencher o combobox
    function populateCombobox(data) {
        const combobox = document.getElementById('myCombobox');
        
        // Limpa o carregando
        combobox.innerHTML = '';
        
        // Adiciona a primeira opção (pode ser uma opção vazia ou informativa)
        const option = document.createElement('option');
        option.value = "";
        option.textContent = "Selecione uma opção";
        combobox.appendChild(option);
        
        // Preenche o combobox com os dados da API
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id; // Pode ser outro campo da resposta da API
            option.textContent = item.nome; // Substitua por um campo real da resposta
            combobox.appendChild(option);
        });
    }

    // Fazendo o fetch para pegar os dados da API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            populateCombobox(data); // Preenche o combobox com os dados
        })
        .catch(error => {
            console.error("Erro ao carregar os dados da API:", error);
        });
});