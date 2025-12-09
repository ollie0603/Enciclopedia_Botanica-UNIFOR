// Importa o módulo 'fs' (File System) para ler o arquivo
import fs from 'fs/promises';
// Importa o módulo 'path' para resolver caminhos de arquivo
import path from 'path';

// Define a função Serverless principal que o Vercel irá executar
export default async function (req, res) {
    
    // Configura o cabeçalho para retornar HTML (como o PHP fazia)
    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    // 1. Lógica PHP: $id = $_GET['id'];
    const id = req.query.id;
    let planta = null;
    let erro = null;

    // 2. Lógica PHP: if (isset($_GET['id'])) ...
    if (id) {
        // 3. Lógica PHP: Validação do ID
        const numId = parseInt(id);
        
        if (isNaN(numId) || numId <= 0) {
            erro = "❗ Por favor, insira um ID numérico válido.";
        } else {
            try {
                // 4. Lógica PHP: Ler o enciclopedia.json
                const filePath = path.join(process.cwd(), 'enciclopedia.json');
                const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));

                // 5. Lógica PHP: Buscar a planta pelo ID
                planta = data.find(especie => especie.id === numId);

                if (!planta) {
                    erro = `O ID inserido **(${numId})** não corresponde a nenhuma planta na enciclopédia. Verifique se o ID que inseriu é igual ao da placa à sua frente!`;
                }
            } catch (e) {
                // Lidar com erros de leitura ou parsing do JSON
                erro = "❌ Erro ao carregar ou processar o arquivo da enciclopédia.";
                console.error(e);
            }
        }
    } else {
        // Mensagem se não houver ID, mas aqui vamos apenas mostrar um erro se for acessado diretamente
        erro = "Parâmetro 'id' ausente.";
    }

    // 6. Lógica PHP: Geração do HTML (Função renderHTML recriada)
    let outputHTML = '';

    if (erro) {
        // Se houver erro, renderiza a mensagem de erro
        outputHTML = `
            <div id="planta">
                <p>${erro}</p>
            </div>
        `;
    } else if (planta) {
        // Se a planta for encontrada, renderiza os detalhes
        const nomePopular = planta.nomePopular;
        const nomeCientifico = planta.nomeCientifico;
        const familia = planta.familia;
        const descricao = planta.descricao;
        const plantaId = planta.id;
        
        // Use `` para strings de template no JavaScript, que é como o PHP faz a interpolação
        outputHTML = `
            <div id="planta">
                <h1>${nomePopular}</h1>
                
                ${plantaId == 666 ? 
                    `<img src="/img/essaporra.gif" alt="O próprio satanás">
                    <figcaption>O inimigo está mais perto do que imaginamos.</figcaption>`
                    : 
                    `<img src="/img/${plantaId}.jpg" alt="${nomePopular}" width="750" height="375">`}
                
                <h2>Nome Científico: <em>${nomeCientifico}</em></h2>
                <h2>Família: ${familia}</h2>
                <p>${descricao}</p>

                ${plantaId == 666 ? 
                    `<p>Sério olha essa vagabunda se escondendo!</p>
                    <img src="/img/vagabunda.webp" alt="O demônio se camuflando">
                    <figcaption>Ela se acha tão esperta...</figcaption>
                    <p>E se você matar elas você pode ser punido por isso!!! Cada vez que você mata algumas delas existe uma pequena chance de no próximo ciclo ela se transformar <b>NISSO</b>!!! <span style="color: #e10606"><b>E NÃO TEM VOLTA.</b></span></p>
                    <img src="/img/isso.webp" alt="Desgraça" width="506" height="340">
                    <figcaption>Pobre slugcat sendo arrastado para o submundo.</figcaption>
                    <p>Concluindo, plantas postes são desgraçadas, fudidas, filhas da puta, escrotas, vagabundas, vadias, as piores criaturas que já amaldiçoaram esse planeta, e o mundo seria um lugar melhor sem elas. Pelo menos a versão bombada delas, documentada na imagem acima, tem a decência de não se esconder, te agraciando com a oportunidade de saber com o que você vai ter que lidar quando entra em uma sala.<br>Em todo o caso, em minha próxima apresentação discutiremos porquê dropwigs são os piores animais já concebidos-</p>`
                    : ''}
            </div>
        `;
    }

    // Estrutura do documento HTML (reproduzindo o cabeçalho e corpo do PHP)
    const fullHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Enciclopédia Botânica | ${planta ? planta.nomePopular : 'Detalhes'}</title>
            <link href="../style_php.css" rel="stylesheet">
        </head>
        <body>
            <div id="titulo">
                <h1>Enciclopédia Botânica</h1> 
            </div>
            <p id="voltar"><a href="index.html">Voltar</a></p>
            ${outputHTML}
            ${planta && planta.id == 666 ? `<div id="scug">...</div>` : ''}
        </body>
        </html>
    `;
    
    // Envia o HTML gerado de volta para o navegador
    res.status(200).send(fullHTML);
}
