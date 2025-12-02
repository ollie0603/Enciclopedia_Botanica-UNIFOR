<?php
function enciclopedia($file_path = 'enciclopedia.json') {
    if (!file_exists($file_path)) {
        return false;
    }
    $data = file_get_contents($file_path);
    return json_decode($data, true); 
}

$id = null;
$planta = null;
$erro = null;

if (isset($_GET['id'])) {
    $id = trim($_GET['id']);

    if (is_numeric($id) && $id > 0 && ctype_digit($id)) {
        $id = (int)$id;

        $data = enciclopedia();
        
        if ($data === false) {
            $erro= "❌ Erro ao carregar o arquivo da enciclopédia.";
        } elseif ($data === null) {
            $erro = "❌ Erro: O arquivo enciclopedia.json está mal formatado.";
        } else {
            foreach ($data as $especie) {
                
                if (isset($especie['id']) && $especie['id'] === $id) {
                    $planta = $especie;
                    break;
                }
            }

            if ($planta === null) {
                $erro = "O ID inserido **($id)** não corresponde a nenhuma planta na enciclopédia. Verifique se o ID que inseriu é igual ao da placa à sua frente!";
            }
        }
    } else {
        $erro = "❗ Por favor, insira um ID numérico válido.";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Enciclopédia Botânica | <?php echo $planta['nomePopular']; ?></title>
    <link href="style.css" rel="stylesheet">
</head>
<body>
    <h1>Enciclopédia Botânica</h1>
    <p><a href="flora.html">← Voltar</a></p>

    <div id="planta">
    <?php if ($erro): ?>
        <p><?php echo $erro; ?></p>
    <?php elseif ($planta):
        $nomePopular = htmlspecialchars($planta['nomePopular']);
        $nomeCientifico = htmlspecialchars($planta['nomeCientifico']);
        $familia = htmlspecialchars($planta['familia']);
        $descricao = htmlspecialchars($planta['descricao']);
        $id = htmlspecialchars($planta['id']);
?>
        <h1><?php echo $nomePopular; ?></h1>
        
        <?php if ($id == 666): ?>
            <img src="img/essaporra.gif" alt="O próprio satanás">
            <figcaption>O inimigo está mais perto do que imaginamos.</figcaption>
        <?php endif; ?>
        
        <h2>Nome Científico: <em><?php echo $nomeCientifico; ?></em></h2>
        <h2>Família: <?php echo $familia; ?></h2>
        <p><?php echo $descricao; ?></p>

        <?php if ($id == 666): ?>
            <p>Sério olha essa putinha se escondendo!</p>
            <img src="img/aputinha.webp" alt="O demônio se camuflando">
            <figcaption>Ela se acha tão esperta...</figcaption>
            <p>E se você matar elas você pode ser punido por isso!!! Cada vez que você mata algumas delas existe uma pequena chance de no próximo ciclo ela se transformar <b>NISSO</b>!!! <span style="color: #e10606"><b>E NÃO TEM VOLTA.</b></span></p>
            <img src="img/isso.webp" alt="Desgraça" width="506" height="340">
            <figcaption>Pobre slugcat sendo arrastado para o submundo.</figcaption>
            <p>Concluindo, plantas postes são desgraçadas, fudidas, filhas da puta, escrotas, vagabundas, vadias, a pior criatura que já amaldiçoou esse planeta, e o mundo seria um lugar melhor sem elas. Pelo menos a versão bombada delas, documentada na imagem acima, tem a decência de não se esconder, te agraciando com a oportunidade de saber com o que você vai ter que lidar quando entra em uma sala.<br>Em minha próxima apresentação, discutiremos porquê dropwigs são os piores seres já concebidos-</p>
        <?php endif; ?>
    <?php endif; ?>
</div> 
</body>
</html>
