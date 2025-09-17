<template>
  <div class="noticias-container">
    <div class="noticias-header">
      <div class="header-content">
        <h1 class="page-title">
          <i class="pi pi-megaphone"></i>
          Notícias e Comunicados
        </h1>
        <p class="page-subtitle">Mantenha-se informado sobre tudo que acontece no condomínio</p>
      </div>
    </div>

    <div class="content-wrapper">
      <!-- Filtros -->
      <Card class="filters-card">
        <template #content>
          <div class="filters-section">
            <div class="filter-group">
              <label for="search">Buscar notícias:</label>
              <InputText
                id="search"
                v-model="searchTerm"
                placeholder="Digite para buscar..."
                class="search-input"
              />
            </div>
            <div class="filter-group">
              <label for="categoria">Categoria:</label>
              <Dropdown
                id="categoria"
                v-model="selectedCategory"
                :options="categorias"
                optionLabel="label"
                optionValue="value"
                placeholder="Todas as categorias"
                class="category-filter"
                showClear
              />
            </div>
            <div class="filter-group">
              <label for="periodo">Período:</label>
              <Dropdown
                id="periodo"
                v-model="selectedPeriod"
                :options="periodos"
                optionLabel="label"
                optionValue="value"
                placeholder="Todos os períodos"
                class="period-filter"
                showClear
              />
            </div>
          </div>
        </template>
      </Card>

      <!-- Lista de Notícias -->
      <div class="noticias-grid">
        <Card
          v-for="noticia in noticiasFiltered"
          :key="noticia.id"
          class="noticia-card"
          :class="{ 'destaque': noticia.destaque }"
        >
          <template #header>
            <div class="noticia-header">
              <img v-if="noticia.imagem" :src="noticia.imagem" :alt="noticia.titulo" class="noticia-image" />
              <div class="noticia-badges">
                <Badge
                  :value="getCategoriaLabel(noticia.categoria)"
                  :class="getCategoryBadgeClass(noticia.categoria)"
                />
                <Badge
                  v-if="noticia.destaque"
                  value="DESTAQUE"
                  class="p-badge-warning destaque-badge"
                />
              </div>
            </div>
          </template>
          <template #title>
            <div class="noticia-title">{{ noticia.titulo }}</div>
          </template>
          <template #subtitle>
            <div class="noticia-meta">
              <span class="noticia-date">
                <i class="pi pi-calendar"></i>
                {{ formatDate(noticia.dataPublicacao) }}
              </span>
            </div>
          </template>
          <template #content>
            <div class="noticia-content">
              <p class="noticia-excerpt">
                {{ getExcerpt(noticia.conteudo) }}
              </p>
              <div class="noticia-actions">
                <Button
                  label="Ler mais"
                  icon="pi pi-eye"
                  class="p-button-text p-button-primary"
                  @click="openNoticia(noticia)"
                />
                <div class="noticia-attachments" v-if="noticia.anexos && noticia.anexos.length > 0">
                  <Button
                    icon="pi pi-paperclip"
                    class="p-button-text p-button-sm"
                    v-tooltip.top="`${noticia.anexos.length} anexo(s)`"
                  />
                </div>
              </div>
            </div>
          </template>
        </Card>

        <div v-if="noticiasFiltered.length === 0" class="empty-state">
          <i class="pi pi-search"></i>
          <h3>Nenhuma notícia encontrada</h3>
          <p>Tente ajustar os filtros ou buscar por outros termos</p>
        </div>
      </div>
    </div>

    <!-- Dialog de Notícia -->
    <Dialog
      v-model:visible="showNoticiaDialog"
      :header="selectedNoticia?.titulo"
      :style="{ width: '800px' }"
      maximizable
      modal
    >
      <div v-if="selectedNoticia" class="noticia-dialog-content">
        <div class="dialog-meta">
          <Badge
            :value="getCategoriaLabel(selectedNoticia.categoria)"
            :class="getCategoryBadgeClass(selectedNoticia.categoria)"
          />
          <span class="dialog-date">{{ formatDate(selectedNoticia.dataPublicacao) }}</span>
        </div>
        
        <img
          v-if="selectedNoticia.imagem"
          :src="selectedNoticia.imagem"
          :alt="selectedNoticia.titulo"
          class="dialog-image"
        />
        
        <div class="dialog-content">
          <p v-html="formatContent(selectedNoticia.conteudo)"></p>
        </div>

        <div v-if="selectedNoticia.anexos && selectedNoticia.anexos.length > 0" class="dialog-attachments">
          <h4>Documentos Anexos:</h4>
          <div class="attachments-list">
            <Button
              v-for="(anexo, index) in selectedNoticia.anexos"
              :key="index"
              :label="`Documento ${index + 1}`"
              icon="pi pi-file-pdf"
              class="p-button-outlined attachment-button"
              @click="viewAttachment(anexo)"
            />
          </div>
        </div>
      </div>
    </Dialog>

    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useNoticiasStore } from '../stores/noticias'
import { useToast } from 'primevue/usetoast'
import { format, isAfter, startOfMonth, startOfYear, subMonths, subYears } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const noticiasStore = useNoticiasStore()
const toast = useToast()

const searchTerm = ref('')
const selectedCategory = ref('')
const selectedPeriod = ref('')
const showNoticiaDialog = ref(false)
const selectedNoticia = ref(null)

const categorias = [
  { label: 'Todas as categorias', value: '' },
  { label: 'Geral', value: 'geral' },
  { label: 'Jurídico', value: 'juridico' },
  { label: 'Financeiro', value: 'financeiro' },
  { label: 'Manutenção', value: 'manutencao' }
]

const periodos = [
  { label: 'Todos os períodos', value: '' },
  { label: 'Este mês', value: 'month' },
  { label: 'Últimos 3 meses', value: '3months' },
  { label: 'Este ano', value: 'year' },
  { label: 'Ano passado', value: 'lastyear' }
]

const noticiasFiltered = computed(() => {
  let filtered = noticiasStore.noticias

  // Filtro por termo de busca
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(noticia =>
      noticia.titulo.toLowerCase().includes(term) ||
      noticia.conteudo.toLowerCase().includes(term)
    )
  }

  // Filtro por categoria
  if (selectedCategory.value) {
    filtered = filtered.filter(noticia => noticia.categoria === selectedCategory.value)
  }

  // Filtro por período
  if (selectedPeriod.value) {
    const now = new Date()
    let dateLimit: Date

    switch (selectedPeriod.value) {
      case 'month':
        dateLimit = startOfMonth(now)
        break
      case '3months':
        dateLimit = subMonths(now, 3)
        break
      case 'year':
        dateLimit = startOfYear(now)
        break
      case 'lastyear':
        dateLimit = startOfYear(subYears(now, 1))
        filtered = filtered.filter(noticia => {
          const noticiaYear = noticia.dataPublicacao.getFullYear()
          return noticiaYear === now.getFullYear() - 1
        })
        return filtered.sort((a, b) => b.dataPublicacao.getTime() - a.dataPublicacao.getTime())
      default:
        return filtered.sort((a, b) => b.dataPublicacao.getTime() - a.dataPublicacao.getTime())
    }

    filtered = filtered.filter(noticia => isAfter(noticia.dataPublicacao, dateLimit))
  }

  return filtered.sort((a, b) => b.dataPublicacao.getTime() - a.dataPublicacao.getTime())
})

const formatDate = (date: Date) => {
  return format(date, 'dd/MM/yyyy', { locale: ptBR })
}

const getCategoriaLabel = (categoria: string) => {
  const labels: Record<string, string> = {
    geral: 'Geral',
    juridico: 'Jurídico',
    financeiro: 'Financeiro',
    manutencao: 'Manutenção'
  }
  return labels[categoria] || categoria
}

const getCategoryBadgeClass = (categoria: string) => {
  const classes: Record<string, string> = {
    geral: 'p-badge-info',
    juridico: 'p-badge-warning',
    financeiro: 'p-badge-success',
    manutencao: 'p-badge-secondary'
  }
  return classes[categoria] || 'p-badge-info'
}

const getExcerpt = (conteudo: string, maxLength: number = 150) => {
  if (conteudo.length <= maxLength) {
    return conteudo
  }
  return conteudo.substring(0, maxLength) + '...'
}

const formatContent = (conteudo: string) => {
  return conteudo.replace(/\n/g, '<br>')
}

const openNoticia = (noticia: any) => {
  selectedNoticia.value = noticia
  showNoticiaDialog.value = true
}

const viewAttachment = (anexo: string) => {
  // Simular visualização de anexo
  toast.add({
    severity: 'info',
    summary: 'Documento',
    detail: 'Visualização de documento não implementada neste demo',
    life: 3000
  })
}
</script>

<style scoped>
.noticias-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.noticias-header {
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.filters-card {
  margin-bottom: 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.filters-section {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 1.5rem;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 600;
  color: #2c3e50;
}

.search-input,
.category-filter,
.period-filter {
  padding: 0.75rem;
  border-radius: 8px;
}

.noticias-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.noticia-card {
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
}

.noticia-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.noticia-card.destaque {
  border: 2px solid #ffa500;
  box-shadow: 0 10px 30px rgba(255, 165, 0, 0.2);
}

.noticia-header {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.noticia-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.noticia-badges {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
}

.destaque-badge {
  font-weight: 700;
  letter-spacing: 0.5px;
}

.noticia-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1.4;
}

.noticia-meta {
  margin: 0.5rem 0;
}

.noticia-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.noticia-content {
  padding: 0;
}

.noticia-excerpt {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.noticia-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.noticia-attachments {
  display: flex;
  align-items: center;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
}

.empty-state i {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.3;
}

.empty-state h3 {
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.noticia-dialog-content {
  padding: 1rem 0;
}

.dialog-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.dialog-date {
  color: #666;
  font-size: 0.9rem;
}

.dialog-image {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.dialog-content {
  line-height: 1.7;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.dialog-attachments {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.dialog-attachments h4 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.attachments-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.attachment-button {
  border-radius: 8px;
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
  
  .filters-section {
    grid-template-columns: 1fr;
  }
  
  .noticias-grid {
    grid-template-columns: 1fr;
  }
  
  .noticia-header {
    height: 150px;
  }
  
  .noticia-title {
    font-size: 1.1rem;
  }
}
</style>