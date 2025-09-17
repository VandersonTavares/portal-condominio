<template>
  <div class="admin-container">
    <div class="admin-header">
      <div class="header-content">
        <h1 class="admin-title">
          <i class="pi pi-cog"></i>
          Painel Administrativo
        </h1>
        <div class="header-actions">
          <Button
            label="Sair"
            icon="pi pi-sign-out"
            class="p-button-outlined logout-button"
            @click="logout"
          />
        </div>
      </div>
    </div>

    <div class="admin-content">
      <div class="admin-sidebar">
        <div class="sidebar-menu">
          <Button
            v-for="tab in tabs"
            :key="tab.key"
            :label="tab.label"
            :icon="tab.icon"
            :class="{ 'p-button-primary': activeTab === tab.key, 'p-button-text': activeTab !== tab.key }"
            class="menu-button"
            @click="activeTab = tab.key"
          />
        </div>
      </div>

      <div class="admin-main">
        <!-- Dashboard -->
        <div v-if="activeTab === 'dashboard'" class="tab-content">
          <div class="dashboard-grid">
            <Card class="stat-card">
              <template #content>
                <div class="stat-content">
                  <div class="stat-icon reservas-icon">
                    <i class="pi pi-calendar"></i>
                  </div>
                  <div class="stat-info">
                    <h3>{{ reservasStore.reservas.length }}</h3>
                    <p>Total de Reservas</p>
                  </div>
                </div>
              </template>
            </Card>

            <Card class="stat-card">
              <template #content>
                <div class="stat-content">
                  <div class="stat-icon noticias-icon">
                    <i class="pi pi-megaphone"></i>
                  </div>
                  <div class="stat-info">
                    <h3>{{ noticiasStore.noticias.length }}</h3>
                    <p>Notícias Publicadas</p>
                  </div>
                </div>
              </template>
            </Card>

            <Card class="stat-card">
              <template #content>
                <div class="stat-content">
                  <div class="stat-icon eventos-icon">
                    <i class="pi pi-star"></i>
                  </div>
                  <div class="stat-info">
                    <h3>{{ noticiasStore.eventos.length }}</h3>
                    <p>Eventos Cadastrados</p>
                  </div>
                </div>
              </template>
            </Card>

            <Card class="stat-card">
              <template #content>
                <div class="stat-content">
                  <div class="stat-icon receita-icon">
                    <i class="pi pi-dollar"></i>
                  </div>
                  <div class="stat-info">
                    <h3>R$ {{ totalReceita.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}</h3>
                    <p>Receita das Reservas</p>
                  </div>
                </div>
              </template>
            </Card>
          </div>

          <div class="dashboard-charts">
            <Card class="chart-card">
              <template #header>
                <h3>Reservas por Status</h3>
              </template>
              <template #content>
                <div class="status-breakdown">
                  <div
                    v-for="status in statusBreakdown"
                    :key="status.label"
                    class="status-item"
                  >
                    <div class="status-color" :style="{ backgroundColor: status.color }"></div>
                    <span class="status-label">{{ status.label }}</span>
                    <span class="status-count">{{ status.count }}</span>
                  </div>
                </div>
              </template>
            </Card>

            <Card class="chart-card">
              <template #header>
                <h3>Últimas Atividades</h3>
              </template>
              <template #content>
                <div class="activity-list">
                  <div
                    v-for="activity in recentActivities"
                    :key="activity.id"
                    class="activity-item"
                  >
                    <i :class="activity.icon" :style="{ color: activity.color }"></i>
                    <div class="activity-info">
                      <span class="activity-text">{{ activity.text }}</span>
                      <span class="activity-time">{{ formatDate(activity.date) }}</span>
                    </div>
                  </div>
                </div>
              </template>
            </Card>
          </div>
        </div>

        <!-- Gerenciar Reservas -->
        <div v-if="activeTab === 'reservas'" class="tab-content">
          <div class="section-header">
            <h2>Gerenciar Reservas</h2>
            <Button
              icon="pi pi-download"
              label="Gerar Relatório PDF"
              class="p-button-outlined"
              @click="gerarRelatorio"
            />
          </div>

          <DataTable
            :value="reservasStore.reservas"
            :paginator="true"
            :rows="10"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5,10,25]"
            currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} reservas"
            responsiveLayout="scroll"
            class="reservas-table"
          >
            <Column field="nomeCompleto" header="Nome" sortable>
              <template #body="slotProps">
                <span class="font-weight-bold">{{ slotProps.data.nomeCompleto }}</span>
              </template>
            </Column>
            <Column field="apartamento" header="Apto" sortable>
              <template #body="slotProps">
                {{ slotProps.data.apartamento }}{{ slotProps.data.bloco }}
              </template>
            </Column>
            <Column field="telefone" header="Telefone" sortable></Column>
            <Column field="dataReserva" header="Data" sortable>
              <template #body="slotProps">
                {{ formatDate(slotProps.data.dataReserva) }}
              </template>
            </Column>
            <Column field="valorTaxa" header="Taxa" sortable>
              <template #body="slotProps">
                R$ {{ slotProps.data.valorTaxa.toFixed(2).replace('.', ',') }}
              </template>
            </Column>
            <Column field="status" header="Status" sortable>
              <template #body="slotProps">
                <Chip
                  :label="getStatusLabel(slotProps.data.status)"
                  :class="getStatusClass(slotProps.data.status)"
                />
              </template>
            </Column>
            <Column header="Ações">
              <template #body="slotProps">
                <div class="table-actions">
                  <Button
                    icon="pi pi-check"
                    class="p-button-rounded p-button-success p-button-sm"
                    @click="atualizarStatus(slotProps.data.id, 'pago')"
                    v-if="slotProps.data.status === 'aguardando'"
                    v-tooltip.top="'Marcar como pago'"
                  />
                  <Button
                    icon="pi pi-times"
                    class="p-button-rounded p-button-danger p-button-sm"
                    @click="excluirReserva(slotProps.data.id)"
                    v-tooltip.top="'Excluir reserva'"
                  />
                </div>
              </template>
            </Column>
          </DataTable>
        </div>

        <!-- Gerenciar Notícias -->
        <div v-if="activeTab === 'noticias'" class="tab-content">
          <div class="section-header">
            <h2>Gerenciar Notícias</h2>
            <Button
              icon="pi pi-plus"
              label="Nova Notícia"
              @click="showNoticiaDialog = true; editingNoticia = null"
            />
          </div>

          <DataTable
            :value="noticiasStore.noticias"
            :paginator="true"
            :rows="10"
            responsiveLayout="scroll"
            class="noticias-table"
          >
            <Column field="titulo" header="Título" sortable>
              <template #body="slotProps">
                <span class="font-weight-bold">{{ slotProps.data.titulo }}</span>
              </template>
            </Column>
            <Column field="categoria" header="Categoria" sortable>
              <template #body="slotProps">
                <Badge
                  :value="getCategoriaLabel(slotProps.data.categoria)"
                  :class="getCategoryBadgeClass(slotProps.data.categoria)"
                />
              </template>
            </Column>
            <Column field="dataPublicacao" header="Data" sortable>
              <template #body="slotProps">
                {{ formatDate(slotProps.data.dataPublicacao) }}
              </template>
            </Column>
            <Column field="destaque" header="Destaque" sortable>
              <template #body="slotProps">
                <i
                  :class="slotProps.data.destaque ? 'pi pi-star-fill text-yellow-500' : 'pi pi-star text-gray-400'"
                ></i>
              </template>
            </Column>
            <Column header="Ações">
              <template #body="slotProps">
                <div class="table-actions">
                  <Button
                    icon="pi pi-pencil"
                    class="p-button-rounded p-button-info p-button-sm"
                    @click="editarNoticia(slotProps.data)"
                    v-tooltip.top="'Editar notícia'"
                  />
                  <Button
                    icon="pi pi-trash"
                    class="p-button-rounded p-button-danger p-button-sm"
                    @click="excluirNoticia(slotProps.data.id)"
                    v-tooltip.top="'Excluir notícia'"
                  />
                </div>
              </template>
            </Column>
          </DataTable>
        </div>

        <!-- Configurações -->
        <div v-if="activeTab === 'configuracoes'" class="tab-content">
          <div class="section-header">
            <h2>Configurações do Sistema</h2>
          </div>

          <div class="config-grid">
            <Card class="config-card">
              <template #header>
                <h3>Informações do Síndico</h3>
              </template>
              <template #content>
                <div class="form-grid">
                  <div class="form-group">
                    <label>Nome:</label>
                    <InputText v-model="configData.sindicoNome" />
                  </div>
                  <div class="form-group">
                    <label>Telefone:</label>
                    <InputText v-model="configData.sindicoTelefone" />
                  </div>
                  <div class="form-group">
                    <label>Email:</label>
                    <InputText v-model="configData.sindicoEmail" />
                  </div>
                </div>
              </template>
            </Card>

            <Card class="config-card">
              <template #header>
                <h3>Taxas do Salão</h3>
              </template>
              <template #content>
                <div class="form-grid">
                  <div class="form-group">
                    <label>Taxa Morador (R$):</label>
                    <InputText v-model="configData.taxaMorador" type="number" />
                  </div>
                  <div class="form-group">
                    <label>Taxa Parentes/Amigos (R$):</label>
                    <InputText v-model="configData.taxaParentes" type="number" />
                  </div>
                </div>
              </template>
            </Card>

            <Card class="config-card">
              <template #header>
                <h3>Configurações WhatsApp</h3>
              </template>
              <template #content>
                <div class="form-grid">
                  <div class="form-group">
                    <label>Número do Síndico:</label>
                    <InputText v-model="configData.whatsappSindico" />
                  </div>
                </div>
              </template>
            </Card>
          </div>

          <div class="config-actions">
            <Button
              label="Salvar Configurações"
              icon="pi pi-save"
              @click="salvarConfiguracoes"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Dialog Nova/Editar Notícia -->
    <Dialog
      v-model:visible="showNoticiaDialog"
      :header="editingNoticia ? 'Editar Notícia' : 'Nova Notícia'"
      :style="{ width: '700px' }"
      modal
    >
      <form @submit.prevent="salvarNoticia" class="noticia-form">
        <div class="form-group">
          <label>Título:</label>
          <InputText v-model="noticiaForm.titulo" required />
        </div>
        
        <div class="form-grid">
          <div class="form-group">
            <label>Categoria:</label>
            <Dropdown
              v-model="noticiaForm.categoria"
              :options="categoriaOptions"
              optionLabel="label"
              optionValue="value"
              required
            />
          </div>
          <div class="form-group">
            <label>Destaque:</label>
            <div class="checkbox-wrapper">
              <input
                type="checkbox"
                id="destaque"
                v-model="noticiaForm.destaque"
                class="destaque-checkbox"
              />
              <label for="destaque" class="checkbox-label">Marcar como destaque</label>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>URL da Imagem:</label>
          <InputText v-model="noticiaForm.imagem" placeholder="https://..." />
        </div>

        <div class="form-group">
          <label>Conteúdo:</label>
          <Textarea
            v-model="noticiaForm.conteudo"
            rows="8"
            autoResize
            required
          />
        </div>

        <div class="dialog-actions">
          <Button
            type="button"
            label="Cancelar"
            class="p-button-text"
            @click="showNoticiaDialog = false"
          />
          <Button
            type="submit"
            :label="editingNoticia ? 'Atualizar' : 'Criar'"
            :loading="savingNoticia"
          />
        </div>
      </form>
    </Dialog>

    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useReservasStore } from '../stores/reservas'
import { useNoticiasStore } from '../stores/noticias'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const router = useRouter()
const toast = useToast()
const reservasStore = useReservasStore()
const noticiasStore = useNoticiasStore()

const activeTab = ref('dashboard')
const showNoticiaDialog = ref(false)
const editingNoticia = ref(null)
const savingNoticia = ref(false)

const tabs = [
  { key: 'dashboard', label: 'Dashboard', icon: 'pi pi-chart-bar' },
  { key: 'reservas', label: 'Reservas', icon: 'pi pi-calendar' },
  { key: 'noticias', label: 'Notícias', icon: 'pi pi-megaphone' },
  { key: 'configuracoes', label: 'Configurações', icon: 'pi pi-cog' }
]

const configData = reactive({
  sindicoNome: 'João Carlos da Silva',
  sindicoTelefone: '(61) 98348-6146',
  sindicoEmail: 'sindico@condominio.com.br',
  taxaMorador: '100',
  taxaParentes: '300',
  whatsappSindico: '5561983486146'
})

const noticiaForm = reactive({
  titulo: '',
  categoria: '',
  conteudo: '',
  imagem: '',
  destaque: false
})

const categoriaOptions = [
  { label: 'Geral', value: 'geral' },
  { label: 'Jurídico', value: 'juridico' },
  { label: 'Financeiro', value: 'financeiro' },
  { label: 'Manutenção', value: 'manutencao' }
]

const totalReceita = computed(() => {
  return reservasStore.reservas
    .filter(r => r.status === 'pago')
    .reduce((total, r) => total + r.valorTaxa, 0)
})

const statusBreakdown = computed(() => [
  {
    label: 'Aguardando',
    count: reservasStore.reservas.filter(r => r.status === 'aguardando').length,
    color: '#f39c12'
  },
  {
    label: 'Pago',
    count: reservasStore.reservas.filter(r => r.status === 'pago').length,
    color: '#27ae60'
  },
  {
    label: 'Cancelado',
    count: reservasStore.reservas.filter(r => r.status === 'cancelado').length,
    color: '#e74c3c'
  }
])

const recentActivities = computed(() => [
  ...reservasStore.reservas.slice(0, 3).map(r => ({
    id: `reserva-${r.id}`,
    icon: 'pi pi-calendar',
    color: '#3498db',
    text: `Nova reserva: ${r.nomeCompleto}`,
    date: r.createdAt
  })),
  ...noticiasStore.noticias.slice(0, 2).map(n => ({
    id: `noticia-${n.id}`,
    icon: 'pi pi-megaphone',
    color: '#9b59b6',
    text: `Notícia publicada: ${n.titulo.substring(0, 30)}...`,
    date: n.dataPublicacao
  }))
].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5))

const logout = () => {
  localStorage.removeItem('admin_logged_in')
  router.push('/')
  
  toast.add({
    severity: 'info',
    summary: 'Logout realizado',
    detail: 'Até logo!',
    life: 3000
  })
}

const formatDate = (date: Date) => {
  return format(date, 'dd/MM/yyyy', { locale: ptBR })
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    aguardando: 'Aguardando',
    pago: 'Pago',
    cancelado: 'Cancelado'
  }
  return labels[status] || status
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    aguardando: 'status-aguardando',
    pago: 'status-pago',
    cancelado: 'status-cancelado'
  }
  return classes[status] || ''
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

const atualizarStatus = (id: string, status: 'pago' | 'cancelado') => {
  reservasStore.atualizarStatusReserva(id, status)
  
  toast.add({
    severity: 'success',
    summary: 'Status atualizado',
    detail: `Reserva marcada como ${status}`,
    life: 3000
  })
}

const excluirReserva = (id: string) => {
  reservasStore.excluirReserva(id)
  
  toast.add({
    severity: 'info',
    summary: 'Reserva excluída',
    detail: 'Reserva removida do sistema',
    life: 3000
  })
}

const gerarRelatorio = () => {
  reservasStore.gerarPDF()
  
  toast.add({
    severity: 'success',
    summary: 'Relatório gerado',
    detail: 'Download iniciado',
    life: 3000
  })
}

const editarNoticia = (noticia: any) => {
  editingNoticia.value = noticia
  Object.assign(noticiaForm, {
    titulo: noticia.titulo,
    categoria: noticia.categoria,
    conteudo: noticia.conteudo,
    imagem: noticia.imagem || '',
    destaque: noticia.destaque
  })
  showNoticiaDialog.value = true
}

const excluirNoticia = (id: string) => {
  noticiasStore.excluirNoticia(id)
  
  toast.add({
    severity: 'info',
    summary: 'Notícia excluída',
    detail: 'Notícia removida do sistema',
    life: 3000
  })
}

const salvarNoticia = async () => {
  savingNoticia.value = true
  
  try {
    if (editingNoticia.value) {
      noticiasStore.atualizarNoticia(editingNoticia.value.id, { ...noticiaForm })
      toast.add({
        severity: 'success',
        summary: 'Notícia atualizada',
        detail: 'Alterações salvas com sucesso',
        life: 3000
      })
    } else {
      noticiasStore.adicionarNoticia({
        ...noticiaForm,
        dataPublicacao: new Date()
      })
      toast.add({
        severity: 'success',
        summary: 'Notícia criada',
        detail: 'Nova notícia publicada com sucesso',
        life: 3000
      })
    }
    
    showNoticiaDialog.value = false
    
    // Reset form
    Object.assign(noticiaForm, {
      titulo: '',
      categoria: '',
      conteudo: '',
      imagem: '',
      destaque: false
    })
    editingNoticia.value = null
    
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao salvar notícia',
      life: 3000
    })
  } finally {
    savingNoticia.value = false
  }
}

const salvarConfiguracoes = () => {
  toast.add({
    severity: 'success',
    summary: 'Configurações salvas',
    detail: 'Alterações aplicadas com sucesso',
    life: 3000
  })
}
</script>

<style scoped>
.admin-container {
  min-height: 100vh;
  background: #f8f9fa;
}

.admin-header {
  background: linear-gradient(135deg, #2c3e50, #34495e);
  color: white;
  padding: 1.5rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.admin-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logout-button {
  background: transparent !important;
  border-color: white !important;
  color: white !important;
}

.logout-button:hover {
  background: rgba(255, 255, 255, 0.1) !important;
}

.admin-content {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  min-height: calc(100vh - 100px);
}

.admin-sidebar {
  width: 250px;
  background: white;
  border-right: 1px solid #e0e6ed;
  padding: 2rem 0;
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0 1rem;
}

.menu-button {
  justify-content: flex-start !important;
  text-align: left !important;
  padding: 1rem !important;
  border-radius: 8px !important;
}

.menu-button.p-button-primary {
  background: linear-gradient(135deg, #667eea, #764ba2) !important;
  border: none !important;
}

.admin-main {
  flex: 1;
  padding: 2rem;
}

.tab-content {
  max-width: 100%;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-header h2 {
  color: #2c3e50;
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  border: none;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.reservas-icon { background: #3498db; }
.noticias-icon { background: #9b59b6; }
.eventos-icon { background: #f39c12; }
.receita-icon { background: #27ae60; }

.stat-info h3 {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.stat-info p {
  color: #666;
  margin: 0;
  font-weight: 500;
}

.dashboard-charts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.chart-card {
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.chart-card h3 {
  color: #2c3e50;
  margin: 0;
  padding: 1.5rem;
  background: #f8f9fa;
  font-size: 1.2rem;
  font-weight: 600;
}

.status-breakdown {
  padding: 1.5rem;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e9ecef;
}

.status-item:last-child {
  border-bottom: none;
}

.status-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.status-label {
  flex: 1;
  font-weight: 500;
}

.status-count {
  font-weight: 600;
  color: #2c3e50;
}

.activity-list {
  padding: 1.5rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e9ecef;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-item i {
  font-size: 1.2rem;
}

.activity-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.activity-text {
  font-weight: 500;
  color: #2c3e50;
}

.activity-time {
  font-size: 0.875rem;
  color: #666;
}

.reservas-table,
.noticias-table {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.table-actions {
  display: flex;
  gap: 0.5rem;
}

.status-aguardando {
  background-color: #fff3e0 !important;
  color: #f57c00 !important;
}

.status-pago {
  background-color: #e8f5e8 !important;
  color: #2e7d32 !important;
}

.status-cancelado {
  background-color: #ffebee !important;
  color: #c62828 !important;
}

.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.config-card {
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.config-card h3 {
  color: #2c3e50;
  margin: 0;
  padding: 1.5rem;
  background: #f8f9fa;
  font-size: 1.2rem;
  font-weight: 600;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.form-group label {
  font-weight: 600;
  color: #2c3e50;
}

.form-group .p-inputtext,
.form-group .p-dropdown,
.form-group .p-inputtextarea {
  padding: 0.75rem;
  border-radius: 8px;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.destaque-checkbox {
  width: 20px;
  height: 20px;
}

.checkbox-label {
  margin: 0 !important;
  font-weight: normal !important;
  cursor: pointer;
}

.config-actions {
  text-align: center;
}

.noticia-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

@media (max-width: 1024px) {
  .admin-content {
    flex-direction: column;
  }
  
  .admin-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e0e6ed;
  }
  
  .sidebar-menu {
    flex-direction: row;
    overflow-x: auto;
    padding: 0 1rem;
  }
  
  .menu-button {
    min-width: 150px;
    text-align: center !important;
    justify-content: center !important;
  }
  
  .dashboard-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
  
  .dashboard-charts {
    grid-template-columns: 1fr;
  }
  
  .config-grid {
    grid-template-columns: 1fr;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .header-content {
    padding: 0 1rem;
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .admin-title {
    font-size: 1.5rem;
  }
  
  .admin-main {
    padding: 1rem;
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>