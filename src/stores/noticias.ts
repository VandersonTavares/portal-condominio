import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Noticia {
  id: string
  titulo: string
  conteudo: string
  categoria: 'geral' | 'juridico' | 'financeiro' | 'manutencao'
  imagem?: string
  anexos?: string[]
  dataPublicacao: Date
  destaque: boolean
}

export const useNoticiasStore = defineStore('noticias', () => {
  const noticias = ref<Noticia[]>([
    {
      id: '1',
      titulo: 'Assembleia Geral Ordinária 2024',
      conteudo: 'Convocamos todos os condôminos para a Assembleia Geral Ordinária que será realizada no próximo dia 15 de fevereiro de 2024, às 19h00, no salão de festas do condomínio.',
      categoria: 'geral',
      imagem: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800',
      dataPublicacao: new Date('2024-01-20'),
      destaque: true
    },
    {
      id: '2',
      titulo: 'Atualização das Taxas de Condomínio',
      conteudo: 'Informamos que as taxas condominiais foram reajustadas conforme aprovado em assembleia. O novo valor entrará em vigor a partir de março de 2024.',
      categoria: 'financeiro',
      dataPublicacao: new Date('2024-01-18'),
      destaque: true
    },
    {
      id: '3',
      titulo: 'Manutenção da Piscina',
      conteudo: 'A piscina estará fechada para manutenção preventiva entre os dias 25 e 30 de janeiro. Agradecemos a compreensão.',
      categoria: 'manutencao',
      dataPublicacao: new Date('2024-01-15'),
      destaque: false
    }
  ])

  const eventos = ref([
    {
      id: '1',
      titulo: 'Festa Junina do Condomínio',
      data: new Date('2024-06-15'),
      local: 'Salão de Festas',
      descricao: 'Grande festa junina com quadrilha, comidas típicas e muito mais!'
    },
    {
      id: '2',
      titulo: 'Reunião de Pais - Playground',
      data: new Date('2024-03-10'),
      local: 'Salão de Festas',
      descricao: 'Discussão sobre melhorias no playground infantil'
    }
  ])

  const adicionarNoticia = (noticia: Omit<Noticia, 'id'>) => {
    const novaNoticia: Noticia = {
      ...noticia,
      id: Date.now().toString()
    }
    noticias.value.unshift(novaNoticia)
    return novaNoticia
  }

  const atualizarNoticia = (id: string, dadosAtualizados: Partial<Noticia>) => {
    const index = noticias.value.findIndex(n => n.id === id)
    if (index !== -1) {
      noticias.value[index] = { ...noticias.value[index], ...dadosAtualizados }
    }
  }

  const excluirNoticia = (id: string) => {
    const index = noticias.value.findIndex(n => n.id === id)
    if (index !== -1) {
      noticias.value.splice(index, 1)
    }
  }

  return {
    noticias,
    eventos,
    adicionarNoticia,
    atualizarNoticia,
    excluirNoticia
  }
})