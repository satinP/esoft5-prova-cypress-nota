# Testes utilizados para atribuição da nota da prova.

## Instruções para uso

1. Clone o repositório em seu ambiente local

   ```bash
   git clone https://github.com/satinP/esoft5-prova-cypress-nota.git
   ```

1. Acesse a pasta do repositório clonado

   ```bash
   cd esoft5-prova-cypress-nota
   ```

1. Utilize a branch referente ao bimestre que deseja testar

   ```bash
   git checkout primeiro-bimestre
   ```

   ou

   ```bash
   git checkout segundo-bimestre
   ```

1. Instale as dependências necessárias utilizando npm:

   ```bash
   npm install
   ```

1. Modifique a primeira linha do arquivo [/cypress/e2e/spec.cy.js](https://github.com/satinP/esoft5-prova-cypress-nota/blob/main/cypress/e2e/spec.cy.js) com o link do seu site do github pages (remova a última `/`).
   Exemplo certo:

   ```js
   const url = 'https://github.com/satinP/esoft5-prova-cypress-nota'
   ```

   Exemplo errado:

   ```js
   const url = 'https://github.com/satinP/esoft5-prova-cypress-nota/'
   ```

1. Execute os testes com Cypress:
   ```bash
   npx cypress run
   ```
   ou
   ```bash
   npx cypress open
   ```
