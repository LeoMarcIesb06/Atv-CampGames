import request from 'supertest';
import app from './app.js';

describe('Testes da API de Convidados', () => {

  let convidados = [];
  app.locals.convidados = convidados; 

  // Teste 1: GET - Deve retornar uma lista vazia no início
  test('GET /convidados - Deve retornar um array vazio inicialmente e status 200', async () => {
    const response = await request(app).get('/convidados');
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(0);
  });

  // Teste 2: POST - Deve criar um novo convidado com sucesso
  test('POST /convidados - Deve criar um novo convidado e retornar o objeto com id e status 201', async () => {
    const novoConvidado = { nome: 'João Teste', jogo: 'valorant' };
    const response = await request(app)
      .post('/convidados')
      .send(novoConvidado);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.nome).toBe(novoConvidado.nome);
    expect(response.body.jogo).toBe(novoConvidado.jogo);
  });
  
  // Teste 3: POST - Não deve criar convidado com dados inválidos
  test('POST /convidados - Não deve criar um convidado com jogo inválido e deve retornar status 400', async () => {
    const convidadoInvalido = { nome: 'Ana Inválida', jogo: 'pacman' }; // jogo inválido
    const response = await request(app)
      .post('/convidados')
      .send(convidadoInvalido);

    expect(response.statusCode).toBe(400);
  });
  
  // Teste 4: PUT - Deve atualizar um convidado existente
  test('PUT /convidados/:id - Deve atualizar um convidado existente e retornar status 200', async () => {
    // Primeiro, crie um convidado para poder atualizá-lo
    const novoConvidado = { nome: 'Carlos Original', jogo: 'lol' };
    const postResponse = await request(app).post('/convidados').send(novoConvidado);
    const idDoConvidado = postResponse.body.id;

    const dadosAtualizados = { nome: 'Carlos Atualizado', jogo: 'cs' };

    // Agora, atualize o convidado
    const putResponse = await request(app)
      .put(`/convidados/${idDoConvidado}`)
      .send(dadosAtualizados);
      
    expect(putResponse.statusCode).toBe(200);
    expect(putResponse.body.nome).toBe(dadosAtualizados.nome);
    expect(putResponse.body.jogo).toBe(dadosAtualizados.jogo);
  });
  
  // Teste 5: DELETE - Deve remover um convidado existente
  test('DELETE /convidados/:id - Deve remover um convidado e retornar status 200', async () => {
    // Crie um convidado para poder removê-lo
    const novoConvidado = { nome: 'Usuario Para Deletar', jogo: 'dota' };
    const postResponse = await request(app).post('/convidados').send(novoConvidado);
    const idDoConvidado = postResponse.body.id;
    
    // Remova o convidado
    const deleteResponse = await request(app).delete(`/convidados/${idDoConvidado}`);
    
    expect(deleteResponse.statusCode).toBe(200);
    expect(deleteResponse.body.mensagem).toBe('Convidado removido com sucesso.');
    
    // Verifique se ele realmente foi removido
    const getResponse = await request(app).get(`/convidados/${idDoConvidado}`);
    expect(getResponse.statusCode).toBe(404); // Espera-se "Não encontrado" agora
  });

  // Teste 6: GET - Deve retornar 404 para um ID que não existe
  test('GET /convidados/:id - Deve retornar 404 para um ID inexistente', async () => {
    const response = await request(app).get('/convidados/9999'); // Um ID que provavelmente não existe
    expect(response.statusCode).toBe(404);
  });

});