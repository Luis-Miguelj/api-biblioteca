import { PrismaClient } from '@prisma/client'
import { Livro } from '../lib/types'

const prisma = new PrismaClient()

export class Livros {
  async create(data: Livro) {
    if (!data.nome) {
      return { error: 'O nome do livro é obrigatório' }
    }

    const livro = await prisma.livros.create({
      data: {
        nome: data.nome,
        status: data.status,
        autor: data.autor,
        editora: data.editora
      }
    })

    if (!livro) {
      return { error: 'Erro ao criar livro' }
    }

    return livro
  }

  async getAllLivros() {
    const livros = await prisma.livros.findMany()
    if (!livros) {
      return { error: 'Erro ao buscar livros' }
    }
    return livros
  }

  async getLivroFilter(filter: string) {
    if (!filter) {
      return { error: 'Filtro inválido' }
    }

    const livro = await prisma.livros.findMany({
      where: {
        nome: {
          contains: filter
        }
      }
    })

    if (!livro) {
      return { error: 'Livro não encontrado' }
    }

    return livro
  }
}