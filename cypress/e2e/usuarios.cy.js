/// <reference types="cypress" />
import contracts from '../contracts/usuarios.contract.js'

describe('Testes da Funcionalidade Usuários', () => {
     let token

     before(() => {
          cy.token('fulano@qa.com', 'teste').then(tkn => { token = tkn })
     })

     it('Deve validar contrato de usuários', () => {
          cy.request('usuarios').then(response => {
               return contracts.validateAsync(response.body)
          })
     });

     it('Deve listar usuários cadastrados', () => {
          cy.request({
               method: 'GET',
               url: 'usuarios'
          }).then((response) => {
               expect(response.status).to.equal(200)
               expect(response.body).to.have.property('usuarios')
               //expect(response.duration).to.be.lessThan(20) //desnecessario essa validacao no momento
          })
     });

     it('Deve cadastrar um usuário com sucesso', () => {
          let user = `Usuario EBAC ${Math.floor(Math.random() * 100000000)}`
          let email = `emailteste${Math.floor(Math.random() * 10000)}`
          cy.request({
               method: 'POST',
               url: 'usuarios',
               body: {
                    "nome": user,
                    "email": email + "@qa.com.br",
                    "password": "teste",
                    "administrador": "true"
               },
               headers: { authorization: token }
          }).then((response) => {
               expect(response.status).to.equal(201)
               expect(response.body.message).to.equal('Cadastro realizado com sucesso')
          })
     });

     it('Deve validar um usuário com email inválido', () => {
          cy.cadastrarUsuario(token, 'usuario123', "beltrano@qa.com.br", "trocarasenha") //token, usuario, email, senha
               .then((response) => {
                    expect(response.body.message).to.equal('Este email já está sendo usado')
               })
     });

     it('Deve editar um usuário previamente cadastrado', () => {
          let user = `Usuario EBAC ${Math.floor(Math.random() * 100000000)}`
          let email = `emailteste${Math.floor(Math.random() * 10000)}`
          cy.cadastrarUsuario(token, user, email, "trocarasenha") //token, usuario, email, senha
               .then(response => {
                    let id = response.body._id

                    cy.request({
                         method: 'PUT',
                         url: `usuarios/${id}`,
                         headers: { authorization: token },
                         body: {
                              "nome": user,
                              "email": email + "@qa.com.br",
                              "password": "teste",
                              "administrador": "true"
                         },
                    }).then(response => {
                         expect(response.status).to.equal(201)
                         expect(response.body.message).to.equal('Cadastro realizado com sucesso')
                         // expect(response.status).to.equal(400)
                         // expect(response.body.message).to.equal('Este email já está sendo usado')
                    })
               })
     });

     it('Deve deletar um usuário previamente cadastrado', () => {
          let user = `Usuario EBAC ${Math.floor(Math.random() * 100000000)}`
          let email = `emailteste${Math.floor(Math.random() * 10000)}`
          cy.cadastrarUsuario(token, user, email, "trocarasenha") //token, usuario, email, senha
               .then(response => {
                    let id = response.body._id
                    cy.request({
                         method: 'DELETE',
                         url: `usuarios/${id}`,
                         headers: { authorization: token }
                    }).then(response => {                         
                         expect(response.status).to.equal(200)
                    })
               })
     });


});
