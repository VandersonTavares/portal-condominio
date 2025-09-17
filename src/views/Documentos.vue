<template>
  <div class="documentos-container">
    <div class="documentos-header">
      <div class="header-content">
        <h1 class="page-title">
          <i class="pi pi-file-pdf"></i>
          Documentos
        </h1>
        <p class="page-subtitle">Acesse documentos importantes do condomínio</p>
      </div>
    </div>

    <div class="content-wrapper">
      <div class="documentos-grid">
        <Card
          v-for="categoria in categorias"
          :key="categoria.id"
          class="categoria-card"
        >
          <template #header>
            <div class="categoria-header">
              <i :class="categoria.icon" class="categoria-icon"></i>
              <h3>{{ categoria.nome }}</h3>
            </div>
          </template>
          <template #content>
            <p class="categoria-description">{{ categoria.descricao }}</p>
            <div class="documentos-list">
              <div
                v-for="documento in categoria.documentos"
                :key="documento.id"
                class="documento-item"
                @click="viewDocument(documento)"
              >
                <div class="documento-info">
                  <i class="pi pi-file-pdf documento-icon"></i>
                  <div class="documento-details">
                    <span class="documento-nome">{{ documento.nome }}</span>
                    <span class="documento-data">{{ formatDate(documento.dataPublicacao) }}</span>
                  </div>
                </div>
                <Button
                  icon="pi pi-download"
                  class="p-button-text p-button-sm"
                  @click.stop="downloadDocument(documento)"
                  v-tooltip.left="'Baixar documento'"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const toast = useToast()

interface Documento {
  id: string
  nome: string
  url: string
  dataPublicacao: Date
}

interface Categoria {
  id: string
  nome: string
  descricao: string
  icon: string
  documentos: Documento[]
}

const categorias = ref<Categoria[]>([
  {
    id: '1',
    nome: 'Atas de Reunião',
    descricao: 'Atas das assembleias e reuniões do condomínio',
    icon: 'pi pi-users',
    documentos: [
      {
        id: '1-1',
        nome: 'Ata da Assembleia Ordinária 2024',
        url: '/docs/ata-assembleia-2024.pdf',
        dataPublicacao: new Date('2024-01-15')
      },
      {
        id: '1-2',
        nome: 'Ata da Reunião Síndicos Janeiro 2024',
        url: '/docs/ata-sindicos-jan-2024.pdf',
        dataPublicacao: new Date('2024-01-08')
      },
      {
        id: '1-3',
        nome: 'Ata da Assembleia Extraordinária Dezembro 2023',
        url: '/docs/ata-extraordinaria-dez-2023.pdf',
        dataPublicacao: new Date('2023-12-20')
      }
    ]
  },
  {
    id: '2',
    nome: 'Regulamento Interno',
    descricao: 'Regras e normas de convivência do condomínio',
    icon: 'pi pi-book',
    documentos: [
      {
        id: '2-1',
        nome: 'Regulamento Interno Atualizado 2024',
        url: '/docs/regulamento-interno-2024.pdf',
        dataPublicacao: new Date('2024-01-01')
      },
      {
        id: '2-2',
        nome: 'Normas de Uso da Piscina',
        url: '/docs/normas-piscina.pdf',
        dataPublicacao: new Date('2023-12-01')
      },
      {
        id: '2-3',
        nome: 'Regulamento do Salão de Festas',
        url: '/docs/regulamento-salao-festas.pdf',
        dataPublicacao: new Date('2023-11-15')
      }
    ]
  },
  {
    id: '3',
    nome: 'Documentos Financeiros',
    descricao: 'Balancetes, demonstrações e relatórios financeiros',
    icon: 'pi pi-chart-line',
    documentos: [
      {
        id: '3-1',
        nome: 'Balancete Dezembro 2023',
        url: '/docs/balancete-dez-2023.pdf',
        dataPublicacao: new Date('2024-01-05')
      },
      {
        id: '3-2',
        nome: 'Orçamento Anual 2024',
        url: '/docs/orcamento-2024.pdf',
        dataPublicacao: new Date('2023-12-10')
      },
      {
        id: '3-3',
        nome: 'Relatório de Inadimplência Janeiro',
        url: '/docs/inadimplencia-jan-2024.pdf',
        dataPublicacao: new Date('2024-01-20')
      }
    ]
  },
  {
    id: '4',
    nome: 'Documentos Jurídicos',
    descricao: 'Contratos, escrituras e documentos legais',
    icon: 'pi pi-shield',
    documentos: [
      {
        id: '4-1',
        nome: 'Convenção do Condomínio',
        url: '/docs/convencao-condominio.pdf',
        dataPublicacao: new Date('2020-05-15')
      },
      {
        id: '4-2',
        nome: 'Contrato de Administração',
        url: '/docs/contrato-administracao.pdf',
        dataPublicacao: new Date('2023-01-01')
      },
      {
        id: '4-3',
        nome: 'Alvará de Funcionamento',
        url: '/docs/alvara-funcionamento.pdf',
        dataPublicacao: new Date('2023-06-01')
      }
    ]
  },
  {
    id: '5',
    nome: 'Manutenção e Obras',
    descricao: 'Relatórios de manutenção, obras e melhorias',
    icon: 'pi pi-wrench',
    documentos: [
      {
        id: '5-1',
        nome: 'Relatório de Manutenção Janeiro 2024',
        url: '/docs/manutencao-jan-2024.pdf',
        dataPublicacao: new Date('2024-01-25')
      },
      {
        id: '5-2',
        nome: 'Projeto Reforma da Piscina',
        url: '/docs/projeto-reforma-piscina.pdf',
        dataPublicacao: new Date('2023-12-15')
      },
      {
        id: '5-3',
        nome: 'Orçamentos Pintura Prédio',
        url: '/docs/orcamentos-pintura.pdf',
        dataPublicacao: new Date('2024-01-10')
      }
    ]
  },
  {
    id: '6',
    nome: 'Seguros e Apólices',
    descricao: 'Documentos de seguro predial e responsabilidade civil',
    icon: 'pi pi-umbrella',
    documentos: [
      {
        id: '6-1',
        nome: 'Apólice de Seguro Predial 2024',
        url: '/docs/apolice-predial-2024.pdf',
        dataPublicacao: new Date('2024-01-01')
      },
      {
        id: '6-2',
        nome: 'Seguro Responsabilidade Civil',
        url: '/docs/seguro-responsabilidade-civil.pdf',
        dataPublicacao: new Date('2024-01-01')
      },
      {
        id: '6-3',
        nome: 'Relatório de Vistoria de Segurança',
        url: '/docs/vistoria-seguranca-2023.pdf',
        dataPublicacao: new Date('2023-12-01')
      }
    ]
  }
])

const formatDate = (date: Date) => {
  return format(date, 'dd/MM/yyyy', { locale: ptBR })
}

const viewDocument = (documento: Documento) => {
  toast.add({
    severity: 'info',
    summary: 'Visualizar Documento',
    detail: `Abrindo: ${documento.nome}`,
    life: 3000
  })
  // Simular abertura do documento
  console.log('Visualizando documento:', documento)
}

const downloadDocument = (documento: Documento) => {
  toast.add({
    severity: 'success',
    summary: 'Download Iniciado',
    detail: `Baixando: ${documento.nome}`,
    life: 3000
  })
  // Simular download do documento
  console.log('Baixando documento:', documento)
}
</script>

<style scoped>
.documentos-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.documentos-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 0;
  text-align: center;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.page-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.page-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.documentos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.categoria-card {
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.categoria-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.categoria-header {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.categoria-icon {
  font-size: 2rem;
}

.categoria-header h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.categoria-description {
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.documentos-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.documento-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.documento-item:hover {
  background: #e9ecef;
  border-color: #667eea;
  transform: translateX(5px);
}

.documento-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.documento-icon {
  color: #dc3545;
  font-size: 1.5rem;
}

.documento-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.documento-nome {
  font-weight: 600;
  color: #2c3e50;
  font-size: 1rem;
}

.documento-data {
  color: #666;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 2rem;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .documentos-grid {
    grid-template-columns: 1fr;
  }
  
  .categoria-header {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }
  
  .documento-item {
    padding: 0.75rem;
  }
  
  .documento-info {
    gap: 0.75rem;
  }
  
  .documento-nome {
    font-size: 0.9rem;
  }
}
</style>