<template>
  <div class="reservas-container">
    <div class="reservas-header">
      <div class="header-content">
        <h1 class="page-title">
          <i class="pi pi-calendar"></i>
          Reserva do Salão de Festas
        </h1>
        <p class="page-subtitle">Reserve o salão para suas celebrações especiais</p>
      </div>
    </div>

    <div class="content-wrapper">
      <div class="reservas-grid">
        <!-- Formulário de Reserva -->
        <div class="form-section">
          <Card class="form-card">
            <template #header>
              <div class="form-header">
                <h3>
                  <i class="pi pi-user"></i>
                  Nova Reserva
                </h3>
              </div>
            </template>
            <template #content>
              <form @submit.prevent="submitReserva" class="reservation-form">
                <div class="form-row">
                  <div class="form-group">
                    <label for="nomeCompleto">Nome Completo do Proprietário *</label>
                    <InputText
                      id="nomeCompleto"
                      v-model="formData.nomeCompleto"
                      placeholder="Digite seu nome completo"
                      :class="{ 'p-invalid': errors.nomeCompleto }"
                      required
                    />
                    <small v-if="errors.nomeCompleto" class="p-error">{{ errors.nomeCompleto }}</small>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="apartamento">Número do Apartamento *</label>
                    <InputText
                      id="apartamento"
                      v-model="formData.apartamento"
                      placeholder="Ex: 101"
                      :class="{ 'p-invalid': errors.apartamento }"
                      required
                    />
                    <small v-if="errors.apartamento" class="p-error">{{ errors.apartamento }}</small>
                  </div>
                  <div class="form-group">
                    <label for="bloco">Bloco *</label>
                    <Dropdown
                      id="bloco"
                      v-model="formData.bloco"
                      :options="blocos"
                      placeholder="Selecione o bloco"
                      :class="{ 'p-invalid': errors.bloco }"
                      required
                    />
                    <small v-if="errors.bloco" class="p-error">{{ errors.bloco }}</small>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="telefone">Telefone com DDD *</label>
                    <InputText
                      id="telefone"
                      v-model="formData.telefone"
                      placeholder="(61)99999-9999"
                      :class="{ 'p-invalid': errors.telefone }"
                      required
                    />
                    <small v-if="errors.telefone" class="p-error">{{ errors.telefone }}</small>
                  </div>
                  <div class="form-group">
                    <label for="tipoTaxa">Tipo de Evento *</label>
                    <Dropdown
                      id="tipoTaxa"
                      v-model="formData.tipoTaxa"
                      :options="tiposTaxa"
                      optionLabel="label"
                      optionValue="value"
                      placeholder="Selecione o tipo"
                      :class="{ 'p-invalid': errors.tipoTaxa }"
                      required
                    />
                    <small v-if="errors.tipoTaxa" class="p-error">{{ errors.tipoTaxa }}</small>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group full-width">
                    <label for="dataReserva">Data da Reserva *</label>
                    <Calendar
                      id="dataReserva"
                      v-model="formData.dataReserva"
                      :minDate="minDate"
                      :maxDate="maxDate"
                      :disabledDates="diasOcupados"
                      dateFormat="dd/mm/yy"
                      placeholder="Selecione a data"
                      :class="{ 'p-invalid': errors.dataReserva }"
                      showIcon
                      required
                    />
                    <small v-if="errors.dataReserva" class="p-error">{{ errors.dataReserva }}</small>
                  </div>
                </div>

                <div class="taxa-info" v-if="formData.tipoTaxa">
                  <div class="taxa-card">
                    <div class="taxa-header">
                      <i class="pi pi-info-circle"></i>
                      <h4>Taxa de Limpeza</h4>
                    </div>
                    <div class="taxa-value">
                      R$ {{ getTaxaValue().toFixed(2).replace('.', ',') }}
                    </div>
                    <p class="taxa-description">
                      {{ formData.tipoTaxa === 'morador' ? 'Taxa para moradores' : 'Taxa para parentes e amigos' }}
                    </p>
                  </div>
                </div>

                <div class="form-actions">
                  <Button
                    type="submit"
                    label="Confirmar Reserva"
                    icon="pi pi-check"
                    class="confirm-button"
                    :loading="loading"
                    size="large"
                  />
                </div>
              </form>

              <div class="info-section">
                <Card class="info-card">
                  <template #content>
                    <div class="info-header">
                      <i class="pi pi-exclamation-triangle"></i>
                      <h4>Informação Importante</h4>
                    </div>
                    <p>
                      A coleta das chaves do salão de festas será entregue na portaria no dia escolhido mediante pagamento da taxa de limpeza.
                    </p>
                    <div class="taxa-lista">
                      <div class="taxa-item">
                        <span class="taxa-tipo">Morador:</span>
                        <span class="taxa-valor">R$ 100,00</span>
                      </div>
                      <div class="taxa-item">
                        <span class="taxa-tipo">Parentes e amigos:</span>
                        <span class="taxa-valor">R$ 300,00</span>
                      </div>
                    </div>
                  </template>
                </Card>
              </div>
            </template>
          </Card>
        </div>

        <!-- Lista de Reservas -->
        <div class="list-section">
          <Card class="reservas-list-card">
            <template #header>
              <div class="list-header">
                <h3>
                  <i class="pi pi-list"></i>
                  Reservas por Mês
                </h3>
                <Button
                  icon="pi pi-download"
                  label="Baixar PDF"
                  class="p-button-outlined download-button"
                  @click="gerarPDFCompleto"
                />
              </div>
            </template>
            <template #content>
              <div class="reservas-por-mes">
                <div 
                  v-for="(reservasMes, mesAno) in reservasPorMes"
                  :key="mesAno"
                  class="mes-section"
                >
                  <div class="mes-header">
                    <h4 class="mes-title">{{ formatMesAno(mesAno) }}</h4>
                    <Button
                      icon="pi pi-file-pdf"
                      class="p-button-text p-button-sm"
                      @click="gerarPDFMes(mesAno)"
                      v-tooltip.top="'Baixar PDF do mês'"
                    />
                  </div>
                  <div class="reservas-mes-list">
                    <div 
                      v-for="reserva in reservasMes"
                      :key="reserva.id"
                      class="reserva-item"
                    >
                      <div class="reserva-data">
                        <span class="dia">{{ formatDia(reserva.dataReserva) }}</span>
                        <span class="mes-abrev">{{ formatMesAbrev(reserva.dataReserva) }}</span>
                      </div>
                      <div class="reserva-info">
                        <div class="reserva-nome">{{ getPrimeiroNome(reserva.nomeCompleto) }}</div>
                        <div class="reserva-apt">Apt {{ reserva.apartamento }}{{ reserva.bloco }}</div>
                      </div>
                      <div class="reserva-status">
                        <Chip 
                          :label="getStatusLabel(reserva.status)"
                          :class="getStatusClass(reserva.status)"
                        />
                        <div class="reserva-taxa">R$ {{ reserva.valorTaxa.toFixed(2).replace('.', ',') }}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="Object.keys(reservasPorMes).length === 0" class="empty-state">
                  <i class="pi pi-calendar"></i>
                  <h4>Nenhuma reserva encontrada</h4>
                  <p>Seja o primeiro a reservar o salão de festas!</p>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>

    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useReservasStore } from '../stores/reservas'
import { format, startOfYear, endOfYear } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const reservasStore = useReservasStore()
const toast = useToast()

const loading = ref(false)

const formData = reactive({
  nomeCompleto: '',
  apartamento: '',
  bloco: '',
  telefone: '',
  dataReserva: null as Date | null,
  tipoTaxa: '' as 'morador' | 'parentes' | ''
})

const errors = reactive({
  nomeCompleto: '',
  apartamento: '',
  bloco: '',
  telefone: '',
  dataReserva: '',
  tipoTaxa: ''
})

const blocos = ['A', 'B', 'C', 'D']

const tiposTaxa = [
  { label: 'Morador (R$ 100,00)', value: 'morador' },
  { label: 'Parentes e amigos (R$ 300,00)', value: 'parentes' }
]

const minDate = ref(new Date())
const maxDate = ref(endOfYear(new Date()))

const diasOcupados = computed(() => {
  return reservasStore.diasOcupados.map(dia => new Date(dia))
})

const reservasPorMes = computed(() => reservasStore.reservasPorMes)

const getTaxaValue = () => {
  return formData.tipoTaxa === 'morador' ? 100 : 300
}

const validateForm = () => {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  if (!formData.nomeCompleto.trim()) {
    errors.nomeCompleto = 'Nome completo é obrigatório'
    isValid = false
  }

  if (!formData.apartamento.trim()) {
    errors.apartamento = 'Número do apartamento é obrigatório'
    isValid = false
  }

  if (!formData.bloco) {
    errors.bloco = 'Bloco é obrigatório'
    isValid = false
  }

  if (!formData.telefone.trim()) {
    errors.telefone = 'Telefone é obrigatório'
    isValid = false
  } else {
    const phoneRegex = /^\(\d{2}\)\d{4,5}-\d{4}$/
    if (!phoneRegex.test(formData.telefone)) {
      errors.telefone = 'Formato inválido. Use (XX)XXXXX-XXXX'
      isValid = false
    }
  }

  if (!formData.dataReserva) {
    errors.dataReserva = 'Data da reserva é obrigatória'
    isValid = false
  }

  if (!formData.tipoTaxa) {
    errors.tipoTaxa = 'Tipo de evento é obrigatório'
    isValid = false
  }

  return isValid
}

const submitReserva = async () => {
  if (!validateForm()) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Por favor, corrija os campos obrigatórios',
      life: 3000
    })
    return
  }

  loading.value = true

  try {
    await reservasStore.adicionarReserva({
      nomeCompleto: formData.nomeCompleto,
      apartamento: formData.apartamento,
      bloco: formData.bloco,
      telefone: formData.telefone,
      dataReserva: formData.dataReserva!,
      tipoTaxa: formData.tipoTaxa,
      valorTaxa: getTaxaValue(),
      status: 'aguardando'
    })

    toast.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Reserva realizada com sucesso! Notificação enviada ao síndico.',
      life: 5000
    })

    // Reset form
    Object.assign(formData, {
      nomeCompleto: '',
      apartamento: '',
      bloco: '',
      telefone: '',
      dataReserva: null,
      tipoTaxa: ''
    })

  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao realizar reserva. Tente novamente.',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

const gerarPDFCompleto = () => {
  reservasStore.gerarPDF()
  toast.add({
    severity: 'info',
    summary: 'PDF Gerado',
    detail: 'Download do relatório completo iniciado',
    life: 3000
  })
}

const gerarPDFMes = (mesAno: string) => {
  reservasStore.gerarPDF(mesAno)
  toast.add({
    severity: 'info',
    summary: 'PDF Gerado',
    detail: `Download do relatório de ${formatMesAno(mesAno)} iniciado`,
    life: 3000
  })
}

const formatMesAno = (mesAno: string) => {
  const [ano, mes] = mesAno.split('-')
  const nomesMeses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]
  return `${nomesMeses[parseInt(mes) - 1]} de ${ano}`
}

const formatDia = (date: Date) => {
  return format(date, 'dd', { locale: ptBR })
}

const formatMesAbrev = (date: Date) => {
  return format(date, 'MMM', { locale: ptBR }).toUpperCase()
}

const getPrimeiroNome = (nomeCompleto: string) => {
  return nomeCompleto.split(' ')[0]
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
</script>

<style scoped>
.reservas-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.reservas-header {
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

.reservas-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;
}

.form-card, .reservas-list-card {
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.form-header, .list-header {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-header h3, .list-header h3 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
}

.reservation-form {
  padding: 2rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 600;
  color: #2c3e50;
}

.form-group .p-inputtext,
.form-group .p-dropdown,
.form-group .p-calendar {
  padding: 0.75rem;
  border-radius: 8px;
}

.taxa-info {
  margin: 2rem 0;
}

.taxa-card {
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
}

.taxa-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.taxa-header h4 {
  color: #1976d2;
  margin: 0;
}

.taxa-header i {
  color: #1976d2;
  font-size: 1.2rem;
}

.taxa-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1976d2;
  margin-bottom: 0.5rem;
}

.taxa-description {
  color: #666;
  margin: 0;
}

.form-actions {
  text-align: center;
  margin-top: 2rem;
}

.confirm-button {
  background: linear-gradient(135deg, #4caf50, #66bb6a) !important;
  border: none !important;
  padding: 1rem 2rem !important;
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
  transition: all 0.3s ease;
}

.confirm-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(76, 175, 80, 0.4);
}

.info-section {
  margin-top: 2rem;
}

.info-card {
  background: #fff3e0;
  border: 1px solid #ffb74d;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  color: #f57c00;
}

.info-header h4 {
  margin: 0;
}

.taxa-lista {
  margin-top: 1rem;
}

.taxa-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #ffcc02;
}

.taxa-item:last-child {
  border-bottom: none;
}

.taxa-tipo {
  font-weight: 600;
  color: #f57c00;
}

.taxa-valor {
  font-weight: 700;
  color: #2c3e50;
}

.download-button {
  background: white !important;
  color: #667eea !important;
  border-color: #667eea !important;
}

.reservas-por-mes {
  padding: 1.5rem;
}

.mes-section {
  margin-bottom: 2rem;
}

.mes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #667eea;
}

.mes-title {
  color: #2c3e50;
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.reservas-mes-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.reserva-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.reserva-item:hover {
  background: #e9ecef;
  transform: translateX(5px);
}

.reserva-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 8px;
  padding: 0.75rem;
  min-width: 60px;
  text-align: center;
}

.dia {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
}

.mes-abrev {
  font-size: 0.8rem;
  opacity: 0.9;
}

.reserva-info {
  flex: 1;
}

.reserva-nome {
  font-weight: 600;
  color: #2c3e50;
  font-size: 1.1rem;
}

.reserva-apt {
  color: #666;
  font-size: 0.9rem;
}

.reserva-status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.reserva-taxa {
  font-weight: 600;
  color: #2c3e50;
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

.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  color: #666;
}

.empty-state i {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.3;
}

.empty-state h4 {
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

@media (max-width: 1024px) {
  .reservas-grid {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .page-title {
    font-size: 2.5rem;
  }
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
  
  .reservation-form {
    padding: 1.5rem;
  }
  
  .reservas-por-mes {
    padding: 1rem;
  }
  
  .form-header, .list-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>