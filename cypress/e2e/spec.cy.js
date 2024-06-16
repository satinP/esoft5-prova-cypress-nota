//  Trocar a url
const url = 'https://satinp.github.io/portal-ibge'

const apiUrl = 'https://servicodados.ibge.gov.br/api/v3/noticias'

describe('Prova de Programação Web 2o bimestre', () => {
  beforeEach(() => {
    cy.visit(url)
    cy.intercept('GET', `${apiUrl}*`).as('getNoticias')
  })

  describe('(0.5) Estrutura de Grid na Página, Cor do Header, Main e Footer', () => {
    it('(0.2) Utilize um sistema de grid, como o CSS Grid para estruturar a página', () => {
      cy.get('body').should('have.css', 'display', 'grid')
    })

    it('(0.1) Utilize a cor #4682b4 para o background do <header> e <footer>, a cor #f0f0f0 para o background do <main>', () => {
      cy.get('header').should(
        'have.css',
        'background-color',
        'rgb(70, 130, 180)'
      )
      cy.get('footer').should(
        'have.css',
        'background-color',
        'rgb(70, 130, 180)'
      )
      cy.get('main').should(
        'have.css',
        'background-color',
        'rgb(240, 240, 240)'
      )
    })

    it('(0.2) Defina 100ch como tamanho máximo do conteúdo principal', () => {
      // 100ch = 100 * width of the '0' character
      // 100ch no tamanho de fonte padrão do navegador é aproximadamente 890px
      cy.get('main ul').should(($element) => {
        const maxWidth = parseFloat($element.css('max-width'))

        // Verificando se o valor está no intervalo desejado
        expect(maxWidth).to.be.gte(880)
        expect(maxWidth).to.be.lte(900)
      })
    })
  })

  describe('(0.6) Form de busca', () => {
    it('(0.1) Crie um formulário (<form>) para o campo de busca, no header', () => {
      cy.get('header form').should('exist')
    })

    it('(0.2) Deixe o input centralizado', () => {
      cy.get('header form')
        .parent()
        .should('have.css', 'justify-content', 'center')
    })

    it('(0.1) Adicione um botão dentro do input de busca, para ser o submit. Utilize o ícone 🔍. Adicionar cursor pointer', () => {
      cy.get('header form button')
        .should('contain.text', '🔍')
        .and('have.css', 'cursor', 'pointer')
    })

    it('(0.2) Alinhe o botão dentro do campo de busca utilizando position: absolute', () => {
      cy.get('header form button').should('have.css', 'position', 'absolute')
    })
  })

  describe('(1.65) Filtro', () => {
    it('(0.1) Utilize a tag <svg> com o código SVG fornecido para criar o ícone de filtro', () => {
      cy.get('header button svg').should('exist')
    })

    it('(0.1) Alinhe o ícone de filtro à direita do header', () => {
      cy.get('header div > button')
        .should('have.css', 'position', 'absolute')
        .and('have.css', 'right', '10px')
    })

    it('(0.1) O ícone deve ser clicável e abrir um modal (<dialog>) com os filtros. Adicionar cursor pointer', () => {
      cy.get('dialog').should('not.be.visible')
      cy.get('header svg').click()
      cy.get('dialog').should('be.visible')
    })

    it('(1) Exiba o número de filtros ativos, baseado na query string, ao lado do ícone de filtro (não contar page e busca)', () => {
      cy.visit(`${url}?tipo=noticia&qtd=5&de=2021-01-01&ate=2021-12-31`)
      cy.get('header svg').siblings().should('contain.text', '4')
    })

    it('(0.35) Caso exista filtros na querystring, eles deverão ser aplicados nos inputs', () => {
      cy.visit(`${url}?qtd=20&tipo=release&de=2024-06-14&ate=2024-06-15`)

      cy.contains('dialog form label', 'Tipo:')
        .next('select')
        .then(($select) => {
          // Busca a option pelo texto "Release" dentro do select encontrado
          cy.wrap($select)
            .contains('option', 'Release')
            .then(($option) => {
              // Armazena o value da option em uma constante
              const optionValue = $option.val()

              // Verifica se o value do select é igual ao value da option
              cy.wrap($option).parent().should('have.value', optionValue)
            })
        })

      cy.contains('dialog form label', 'Quantidade:')
        .next('select')
        .then(($select) => {
          cy.wrap($select)
            .contains('option', '20')
            .then(($option) => {
              // Armazena o value da option em uma constante
              const optionValue = $option.val()

              cy.wrap($option).parent().should('have.value', optionValue)
            })
        })

      cy.contains('dialog form label', 'De:')
        .next('input')
        .then(($input) => {
          cy.wrap($input).should('have.value', '2024-06-14')
        })

      cy.contains('dialog form label', 'Até:')
        .next('input')
        .then(($input) => {
          cy.wrap($input).should('have.value', '2024-06-15')
        })
    })
  })

  describe('(2.85) Filtros em um Dialog HTML', () => {
    it('(0.5) Utilize a tag <dialog> do HTML para criar o modal de filtros', () => {
      cy.get('dialog').should('exist')
    })

    it('(0.25) Inclua os campos de filtro "Tipo", "Quantidade", "De" e "Até" dentro do dialog', () => {
      cy.contains('dialog form label', 'Tipo:').should('exist')
      cy.contains('dialog form label', 'Quantidade:').should('exist')
      cy.contains('dialog form label', 'De:').should('exist')
      cy.contains('dialog form label', 'Até:').should('exist')
    })

    it('(0.25) Os filtros deverão ficar em um form', () => {
      cy.get('dialog form').should('exist')
    })

    it('(0.25) Inicie sempre a quantidade com 10, e as options sendo múltiplos de 5', () => {
      cy.contains('dialog form label', 'Quantidade:')
        .next('select')
        .then(($select) => {
          cy.wrap($select).should('have.value', '10')
        })
    })

    it('(0.25) Adicione um ícone de "X" no canto superior direito do modal para fechá-lo', () => {
      cy.get('dialog').then(($dialog) => {
        if ($dialog.find(':contains("×")').length > 0) {
          cy.wrap($dialog).contains('×').should('exist')
        } else if ($dialog.find(':contains("X")').length > 0) {
          cy.wrap($dialog).contains('X').should('exist')
        } else if ($dialog.find(':contains("x")').length > 0) {
          cy.wrap($dialog).contains('x').should('exist')
        }
      })
    })

    it('(0.25) Adicione um botão "Aplicar" para aplicar os filtros e fechar o modal', () => {
      cy.get('dialog button').should('contain.text', 'Aplicar')
    })

    it('(1) Ao aplicar, os filtros devem ser refletidos na URL da página, com query string, e os dados devem ser atualizados', () => {
      cy.get('header svg').click()

      cy.contains('dialog form label', 'Tipo:')
        .next('select')
        .then(($select) => {
          cy.wrap($select).select('Release')
        })
      cy.get('dialog button').click()
      cy.url().should('include', '=release')
    })
  })

  describe('(1.5) Buscar as Notícias da API do IBGE', () => {
    it('(0.15) Utilize a API http://servicodados.ibge.gov.br/api/v3/noticias para buscar as notícias', () => {
      cy.wait('@getNoticias').its('response.statusCode').should('eq', 200)
    })

    it('(0.25) Utilize a documentação https://servicodados.ibge.gov.br/api/docs/noticias?versao=3, atualize o input de "Tipo" para os valores possíveis', () => {
      cy.contains('dialog form label', 'Tipo:')
        .nextAll('select')
        .first()
        .find('option')
        .then((options) => {
          const values = [...options].map((o) => o.value)
          expect(values).to.include.members(['noticia', 'release'])
        })
    })

    it('(0.1) Por padrão, busque somente 10 notícias', () => {
      cy.intercept('GET', `${apiUrl}`).as('getNoticias')
      cy.visit(url)
      cy.wait('@getNoticias')
        .its('response.body.items')
        .should('have.length', 10)
    })

    it('(1) A api deve ser chamada com os filtros da query string, filtrados pelo usuário', () => {
      cy.visit('https://satinp.github.io/portal-ibge?qtd=5&tipo=release')
      cy.wait('@getNoticias')
        .its('request.url')
        .should('include', 'tipo=release')
        .and('include', 'qtd=5')
    })
  })

  describe('(1.3) Listar as Notícias Dentro de uma <ul> <li>', () => {
    it('(0.25) Após obter os dados das notícias da API, itere sobre esses dados e crie elementos <li> para cada notícia', () => {
      cy.wait('@getNoticias')
        .its('response.body.items')
        .each((item) => {
          cy.get('main > ul li').should('contain.text', item.titulo)
        })
    })

    it('(0.1) Liste esses elementos dentro de uma <ul>', () => {
      cy.get('main > ul').children('li').should('have.length.greaterThan', 1)
    })

    it('(0.1) Cada notícia deve conter a imagem da noticia, o título em um h2, introdução em um parágrafo', () => {
      cy.get('main > ul li')
        .first()
        .within(() => {
          cy.get('img').should('exist')
          cy.get('h2').should('exist')
          cy.get('p').should('exist')
        })
    })

    it('(0.3) A imagem fica em um objeto stringified, e precisa ser concatenada com a url de noticias do IBGE', () => {
      cy.get('main > ul li img')
        .first()
        .should('have.attr', 'src')
        .and('include', 'https://agenciadenoticias.ibge.gov.br/')
    })

    it('(0.2) Mostrar as editorias da notícia com prefixo #', () => {
      cy.get('main > ul li').first().should('contain.text', '#')
    })

    it('(0.25) Mostrar a quanto tempo a notícia foi publicada', () => {
      // Validação da data anulada, pois a api foi alterada.
      cy.get('main > ul li').first().should('contain.text', 'Publicado')
    })

    it('(0.1) Adicione um botão "Leia Mais" ao final de cada notícia', () => {
      cy.get('main > ul li').contains(/leia mais/i)
    })
  })

  describe('(0.7) Botões de Paginação no Final das Notícias', () => {
    it('(0.1) Crie botões de paginação no final das notícias utilizando elementos <button> dentro de <ul> <li>', () => {
      cy.get('main ul:last li button').should('exist')
    })

    it('(0.25) Mostre no máximo 10 botões de páginas', () => {
      cy.get('main ul').last().find('li').should('have.length', 10)
    })

    it('(0.1) Indique visualmente a página atual com uma cor de fundo #4682b4', () => {
      cy.get('main > ul')
        .last() // Seleciona o último <ul> dentro de <main>
        .find('li')
        .first() // Seleciona o primeiro <li> dentro desse <ul>
        .children()
        .first() // Seleciona o primeiro filho dessa última <li>
        .should('have.css', 'background-color', 'rgb(70, 130, 180)')
    })

    it('(0.25) Atualizar a querystring da página ao clicar em um botão de paginação', () => {
      cy.url().should('not.include', 'page=2')
      cy.get('main > ul')
        .last() // Seleciona o último <ul> dentro de <main>
        .find('li')
        .contains('2')
        .click()
      cy.url().should('include', 'page=2')
    })
  })

  describe('(0.1) Remover Todos os Bullet Points de <ul> <li>', () => {
    it('(0.1) Utilize CSS para remover os bullet points padrão de listas não ordenadas (<ul>)', () => {
      cy.get('main > ul')
        .first()
        .should('satisfy', ($ul) => {
          const listStyleType = $ul.css('list-style-type')
          const listStyle = $ul.css('list-style')
          const listItemStyle = $ul.find('li').css('list-style-type')
          return (
            listStyleType === 'none' ||
            listStyle === 'none' ||
            listItemStyle === 'none'
          )
        })

      cy.get('main > ul')
        .last()
        .should('satisfy', ($ul) => {
          const listStyleType = $ul.css('list-style-type')
          const listStyle = $ul.css('list-style')
          const listItemStyle = $ul.find('li').css('list-style-type')
          return (
            listStyleType === 'none' ||
            listStyle === 'none' ||
            listItemStyle === 'none'
          )
        })
    })
  })

  describe('(0.7) Responsividade', () => {
    it('(0.2) Garanta que a página seja responsiva e não quebre em resoluções menores', () => {
      cy.viewport('iphone-6')
      cy.screenshot('iphone-6')
      cy.get('body').should('be.visible')
    })

    it('(0.5) Utilize CSS Grid para organizar os campos de filtro em duas colunas em resoluções maiores que 760px e em uma coluna em resoluções menores', () => {
      cy.viewport(1024, 768)
      cy.get('dialog form')
        .should('have.css', 'grid-template-columns')
        .and(
          'match',
          /(repeat\(2, (auto|1fr|100%))|(auto auto|1fr 1fr|50% 50%| 100% 100%)/
        )

      cy.viewport(760, 500)
      cy.get('dialog form')
        .should('have.css', 'grid-template-columns')
        .and('match', /(auto|1fr|100%)/)
    })
  })
})
