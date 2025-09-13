import express from 'express';

const app = express();
app.use(express.json());

// Banco de dados em memória
let convidados = [];
let nextId = 1;

const JOGOS_VALIDOS = ["cs", "valorant", "lol", "dota"];

// GET /convidados — Retorna a lista completa
app.get('/convidados', (req, res) => {
  res.status(200).json(convidados);
});

// POST /convidados — Cria um convidado com validação
app.post('/convidados', (req, res) => {
  const { nome, jogo } = req.body;

  if (!nome || typeof nome !== 'string' || nome.trim() === '') {
    return res.status(400).json({ mensagem: 'O campo "nome" é obrigatório.' });
  }

  if (!jogo || !JOGOS_VALIDOS.includes(jogo.toLowerCase())) {
    return res.status(400).json({ mensagem: `Jogo inválido. Permitidos: ${JOGOS_VALIDOS.join(', ')}.` });
  }

  const novoConvidado = {
    id: nextId++,
    nome: nome.trim(),
    jogo: jogo.toLowerCase()
  };
  convidados.push(novoConvidado);
  res.status(201).json(novoConvidado);
});

// PUT /convidados/:id — Atualiza um convidado pelo id
app.put('/convidados/:id', (req, res) => {
    const convidadoId = parseInt(req.params.id);
    const { nome, jogo } = req.body;
    const index = convidados.findIndex(c => c.id === convidadoId);

    if (index === -1) {
        return res.status(404).json({ mensagem: "Convidado não encontrado." });
    }

    if (jogo && !JOGOS_VALIDOS.includes(jogo.toLowerCase())) {
        return res.status(400).json({ mensagem: `Jogo inválido. Permitidos: ${JOGOS_VALIDOS.join(', ')}.` });
    }

    const convidado = convidados[index];
    if (nome) {
      convidado.nome = nome.trim();
    }
    if (jogo) {
      convidado.jogo = jogo.toLowerCase();
    }
    res.status(200).json(convidado);
});

// DELETE /convidados/:id — Remove um convidado pelo id
app.delete('/convidados/:id', (req, res) => {
    const convidadoId = parseInt(req.params.id);
    const index = convidados.findIndex(c => c.id === convidadoId);

    if (index === -1) {
        return res.status(404).json({ mensagem: "Convidado não encontrado." });
    }

    convidados.splice(index, 1);
    res.status(200).json({ mensagem: "Convidado removido com sucesso." });
});


// Exporta a aplicação para que outros arquivos (como server.js e os testes) possam usá-la.
export default app;

