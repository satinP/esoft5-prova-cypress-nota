const url = ''

const apiUrl = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados'

let municipiosUrl = ''
let favoritosUrl = ''

describe('Prova de Programação Web', () => {
  describe('Estrutura da Página (2 pontos)', () => {
    beforeEach(() => {
      cy.visit(url)
    })

    it('Salva favoritosUrl', () => {
      cy.get('a')
        .contains('favoritos', {
          matchCase: false,
        })
        .parents('header, nav')
        .find('a')
        .invoke('attr', 'href')
        .then((href) => {
          if (href.startsWith('.')) {
            favoritosUrl = href.replace(/[.]/, '').split('=')[0]
          } else {
            favoritosUrl = '/' + href.split('=')[0]
          }
        })
    })

    it('(0.5) Utilize a seguinte estrutura de projeto, onde a Home ficará no index.html e as outras páginas ficarão em pastas separadas, também com index.html: Página principal: ./index.html; Página de municípios: ./municipios/index.html; Página de favoritos: ./favoritos/index.html', () => {
      // index.html
      cy.request('GET', `${url}/index.html`).then((res) => {
        expect(res.status).to.equal(200)
      })

      // municipios/index.html
      cy.request('GET', `${url}/municipios/index.html`).then((res) => {
        expect(res.status).to.equal(200)
      })

      // favoritos/index.html
      cy.request('GET', `${url}/favoritos/index.html`).then((res) => {
        expect(res.status).to.equal(200)
      })
    })

    it('(1) Utilize uma grid para organizar o conteúdo da página, onde o conteúdo principal (main) ocupa a maior parte do espaço', () => {
      cy.get('main').parent().should('have.css', 'display', 'grid')
    })

    it('(0.25) O header tem cor de fundo #0074d9 e o footer tem cor de fundo #333', () => {
      cy.get('header').should(
        'have.css',
        'background-color',
        'rgb(0, 116, 217)'
      )

      cy.get('footer').should('have.css', 'background-color', 'rgb(51, 51, 51)')
    })

    it('(0.25) Adicione o texto "© 2024 Prova de Programação Web" no footer', () => {
      cy.get('footer').contains('© 2024 Prova de Programação Web', {
        matchCase: false,
      })
    })
  })

  describe('Página de Estados (./index.html) (2.5 pontos)', () => {
    beforeEach(() => {
      cy.intercept('GET', `${apiUrl}*`).as('ibgeRequest')

      cy.visit(url)
    })

    it('(1) Utilize a API do IBGE para buscar dados dos estados brasileiros', () => {
      cy.wait('@ibgeRequest', { timeout: 10000 })
        .its('response.statusCode')
        .should('eq', 200)
    })

    it('(0.25) Liste o nome de cada estado dentro de uma lista (ul/li).', () => {
      cy.get('main ul li').should('exist')
      cy.get('main ul > li').should('have.length.above', 1)
    })

    it('(0.25) Remova os bullet points da lista', () => {
      cy.get('main ul').should('exist')
      cy.get('main ul').should('satisfy', ($ul) => {
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

    it('(0.5) Cada estado deve ser um link (âncora) que direciona para a página de municípios (./municipios/index.html), passando o UF do estado via querystring', () => {
      cy.get('main ul a').should('exist')

      cy.get('main ul a:first-of-type').should(($a) => {
        let href = $a.attr('href')

        if (href.startsWith('.')) {
          municipiosUrl = href.replace(/[.]/, '').split('=')[0]
        } else {
          municipiosUrl = '/' + href.split('=')[0]
        }
      })

      cy.get('main ul a').should('have.attr', 'href').and('match', /[?=]/)
    })

    it('(0.5) Os links (âncoras) devem ter cor #333 com uma transição no hover para alterar a opacidade para 0.8', () => {
      cy.get('main ul a').should('have.css', 'color', 'rgb(51, 51, 51)')
      cy.get('main ul a').should('have.css', 'transition')
    })

    it('Valida e atualiza minicipios url', () => {
      cy.request({
        method: 'GET',
        url: `${url}${municipiosUrl}=AP`,
        failOnStatusCode: false,
      }).then((response) => {
        if (response.status === 404) {
          municipiosUrl = `/municipios/index.html?uf`
        }
      })
    })
  })

  describe('Página de Municípios (./municipios/index.html) (4 pontos)', () => {
    beforeEach(() => {
      cy.intercept('GET', `${apiUrl}/*/municipios`).as('ibgeMunicipiosRequest')

      cy.visit(`${url}${municipiosUrl}=AP`)
    })

    it('(1) Utilize a API do IBGE para buscar os municípios de um estado específico, baseado no UF passado via querystring', () => {
      cy.wait('@ibgeMunicipiosRequest', { timeout: 10000 })
        .its('response.statusCode')
        .should('eq', 200)
    })

    it('(0.5) Exiba o título da página como "Municípios de {UF}", onde {UF} é substituído pelo UF recebido na querystring', () => {
      cy.get('h1').should(($h1) => {
        const text = $h1
          .text()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
        expect(text.toLowerCase()).to.match(/munic[ií]pios de ap/i)
      })
    })

    it('(0.25) Liste os municípios dentro de uma lista não ordenada (ul)', () => {
      cy.get('main ul').should('exist')
      cy.get('main ul > li').should('have.length.above', 1)
    })

    it('(0.25) Remova os bullet points da lista', () => {
      cy.get('main ul').should('satisfy', ($ul) => {
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

    it('(0.25) Cada município deve ser exibido como um item de lista (li) com o nome do município e um botão para favoritar', () => {
      cy.get('main ul').should('exist')
      cy.get('main ul > li')
        .should('have.length.above', 1)
        .should(($lis) => {
          const button = $lis.first().find('button')[0]
          expect(button).to.exist
          button.innerText.includes('Favoritar', { matchCase: false })
        })
    })

    it('(0.25) O botão de favoritar deve ter cor de fundo #ff4136 e uma transição no hover para alterar a opacidade para 0.8', () => {
      cy.get('main ul').should('exist')

      cy.get('main ul > li:first-of-type button')
        .should('have.css', 'background-color', 'rgb(255, 65, 54)')
        .and('have.css', 'transition')
    })

    it('(1.5) Ao clicar no botão de favoritar, o objeto do município deve ser adicionado a uma lista de favoritos no localStorage. Utilize favoritos como nome da chave localStorage', () => {
      cy.get('main ul > li:first-child').within(($li) => {
        $li.find('button').click()
        cy.window()
          .its('localStorage')
          .invoke('getItem', 'favoritos')
          .should('include', 'Serra do Navio')
      })
    })
  })

  describe('Página de Favoritos (./favoritos/index.html) (1 ponto)', () => {
    it('(1) Buscar a lista de favoritos salva em localStorage e exibir o nome do municipio em uma ul/li cada município favoritado.', () => {
      cy.visit(`${url}${municipiosUrl}=AP`)
      const municipios = ['Serra do Navio', 'Amapá', 'Pedra Branca do Amapari']

      cy.get('main ul > li:nth-child(1)').within(($li) => {
        //Serra do Navio
        $li.find('button').click()
      })

      cy.get('main ul > li:nth-child(2)').within(($li) => {
        // 'Amapá'
        $li.find('button').click()
      })

      cy.get('main ul > li:nth-child(3)').within(($li) => {
        // 'Pedra Branca do Amapari'
        $li.find('button').click()
      })

      cy.visit(`${url}${favoritosUrl}`)

      cy.window()
        .its('localStorage')
        .invoke('getItem', 'favoritos')
        .then((favoritos) => {
          const favoritosArray = JSON.parse(favoritos)
          cy.get('main ul li').should('have.length', 3)
          favoritosArray.forEach((_, index) => {
            cy.get('main ul > li').eq(index).contains(municipios[index])
          })
        })
    })
  })

  describe('Funcionalidades Extras (0.5 pontos)', () => {
    it('(0.25) Adicione um link (âncora) com o texto "Ver favoritos", no header da página principal e na página de municípios, o link deve direcionar para a página de favoritos (./favoritos/index.html)', () => {
      cy.visit(url)

      cy.get('header a')
        .should('exist')
        .should(($anchors) => {
          const filteredAnchors = $anchors.filter((_, anchor) => {
            return anchor.textContent
              .trim()
              .toLowerCase()
              .includes('favorito', { matchCase: false })
          })

          expect(filteredAnchors).to.have.length.above(0)

          const href = filteredAnchors[0].getAttribute('href')
          expect(href).to.include('favoritos/index.html')
        })

      cy.visit(`${url}${municipiosUrl}=AP`)

      cy.get('header a')
        .should('exist')
        .should(($anchors) => {
          const filteredAnchors = $anchors.filter((_, anchor) => {
            return anchor.textContent
              .trim()
              .toLowerCase()
              .includes('favorito', { matchCase: false })
          })

          expect(filteredAnchors).to.have.length.above(0)

          const href = filteredAnchors[0].getAttribute('href')
          expect(href).to.include('favoritos/index.html')
        })
    })

    it('(0.25) Adicione um link (âncora) com o texto "Ir para a home", no header das páginas de municípios e de favoritos, que direciona para a página principal (./index.html)', () => {
      cy.visit(`${url}${municipiosUrl}=AP`)

      cy.get('header a')
        .should('exist')
        .should(($anchors) => {
          const filteredAnchors = $anchors.filter((_, anchor) => {
            return anchor.textContent
              .trim()
              .toLowerCase()
              .includes('home', { matchCase: false })
          })

          expect(filteredAnchors).to.have.length.above(0)

          const href = filteredAnchors[0].getAttribute('href')
          expect(href).to.include('../index.html')
        })

      cy.visit(`${url}${favoritosUrl}`)

      cy.get('header a')
        .should('exist')
        .should(($anchors) => {
          const filteredAnchors = $anchors.filter((_, anchor) => {
            return anchor.textContent
              .trim()
              .toLowerCase()
              .includes('home', { matchCase: false })
          })

          expect(filteredAnchors).to.have.length.above(0)

          const href = filteredAnchors[0].getAttribute('href')
          expect(href).to.include('../index.html')
        })
    })
  })
})
