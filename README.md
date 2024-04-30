# Testes utilizados para atribuição da nota da prova.

## Instruções para uso

1. Clone o repositório em seu ambiente local
   ```bash
   git clone https://github.com/satinP/esoft5-prova-cypress-nota.git
   ```

2. Instale as dependências necessárias utilizando npm:
   ```bash
   npm install
   ```

3. Modifique a primeira linha do arquivo [/cypress/e2e/spec.cy.js](https://github.com/satinP/esoft5-prova-cypress-nota/blob/main/cypress/e2e/spec.cy.js) com o link do seu site do github pages (remova a última `/`). Ex:
   ```js
     const url = 'https://github.com/satinP/esoft5-prova-cypress-nota'
   ```
  
4. Execute os testes com Cypress:
   ```bash
   npx cypress run
   ```
   ou
   ```bash
   npx cypress open
   ```
