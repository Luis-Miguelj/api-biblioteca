import fastify from "fastify"
import cors from '@fastify/cors'

import { Livros } from '../moders/livros'
import { Livro } from '../lib/types'

const app = fastify()

app.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
})

app.listen({
  port: 3333,
})

const livros = new Livros()

app.get('/livros', async (request, reply) => {
  const data = await livros.getAllLivros()
  return reply.status(200).send(data)
})

app.get('/livros/:filter', async (request, reply) => {
  const { filter } = request.params as { filter: string }

  if (!filter) {
    return reply.status(400).send({ error: 'Filtro inválido' })
  }

  const data = await livros.getLivroFilter(filter)

  if (!data) {
    return reply.status(404).send({ error: 'Livro não encontrado' })
  }

  return reply.status(200).send(data)
})

app.post('/livros', async (request, reply) => {
  const data = request.body as Livro
  if (!data.nome) {
    return { error: 'O nome do livro é obrigatório' }
  }

  switch (data.status) {
    case 'd':
      await livros.create({
        nome: data.nome,
        status: 'disponível',
        autor: data.autor,
        editora: data.editora
      })
      break
    case 'i':
      await livros.create({
        nome: data.nome,
        status: 'indisponível',
        autor: data.autor,
        editora: data.editora
      })
      break
    case 'e':
      await livros.create({
        nome: data.nome,
        status: 'emprestado',
        autor: data.autor,
        editora: data.editora
      })
      break
    default:
      return reply.status(400).send({ error: 'Status inválido' })
  }

  return reply.status(201).send({ message: 'Livro criado com sucesso' })
})