# Teste Will Bank

## Projeto de contingência de envio de transações

Dado um problema que foi ocorrido durante o envio das transações de dois bancos, e as mesmas foram para a área de contingência, foi realizada uma rotina para verificar se há transaões não tratadas e realiza-las novamente.

## Instruções para rodar o projeto

- Dentro da raiz do projeto, rodar o comando "docker build -t gabrielsartorato/will .", com isso será criada uma imagem do projeto;

- Em seguida executar o comando "docker run -p 3000:3000 gabrielsartorato/will" para executar o servidor;

- Por padrão, foi feito uma rotina que a cada 5 minutos ele ira verifica na lista de contingência, se há transações a serem realizadas;

- Caso deseje fazer manualmente, enviar uma requisição POST para a rota /pix, sera retornado um array com todas as transações realizadas;

- Os resultados de todas as transações que conseguiram ser realizadas irá aparecer no terminal, caso haja algum erro também será alertado no terminal.

## Testes

- Foram realizados testes no PixService, rodar o comando yarn test --coverage ou npm run test --coverage'

- Será criado a pasta coverage e dentro dela ira conter um arquivo index.html onde será mostrado o coverage de teste