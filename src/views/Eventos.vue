<template>
  <div class="eventos-container">
    <div class="eventos-header">
      <div class="header-content">
        <h1 class="page-title">
          <i class="pi pi-star"></i>
          Eventos
        </h1>
        <p class="page-subtitle">Participe dos eventos e atividades do condomínio</p>
      </div>
    </div>

    <div class="content-wrapper">
      <!-- Próximos Eventos -->
      <section class="proximos-eventos">
        <h2 class="section-title">
          <i class="pi pi-calendar-plus"></i>
          Próximos Eventos
        </h2>
        
        <div class="eventos-grid">
          <Card
            v-for="evento in eventosProximos"
            :key="evento.id"
            class="evento-card proximos"
          >
            <template #header>
              <div class="evento-date-header">
                <div class="date-badge">
                  <span class="day">{{ formatDay(evento.data) }}</span>
                  <span class="month">{{ formatMonth(evento.data) }}</span>
                  <span class="year">{{ formatYear(evento.data) }}</span>
                </div>
                <div class="countdown" v-if="getDaysUntil(evento.data) >= 0">
                  <span class="countdown-number">{{ getDaysUntil(evento.data) }}</span>
                  <span class="countdown-text">{{ getDaysUntil(evento.data) === 1 ? 'dia' : 'dias' }}</span>
                </div>
              </div>
            </template>
            <template #title>
              {{ evento.titulo }}
            </template>
            <template #subtitle>
              <div class="evento-info">
                <span class="evento-local">
                  <i class="pi pi-map-marker"></i>
                  {{ evento.local }}
                </span>
                <span class="evento-horario">
                  <i class="pi pi-clock"></i>
                  {{ formatTime(evento.data) }}
                </span>
              </div>
            </template>
            <template #content>
              <p class="evento-description">{{ evento.descricao }}</p>
              
              <div class="evento-actions">
                <Button
                  label="Mais detalhes"
                  icon="pi pi-info-circle"
                  class="p-button-primary"
                  @click="showEventDetails(evento)"
                />
                <Button
                  label="Lembrar-me"
                  icon="pi pi-bell"
                  class="p-button-outlined"
                  @click="setReminder(evento)"
                />
              </div>
            </template>
          </Card>
        </div>
      </section>

      <!-- Eventos Passados -->
      <section class="eventos-passados">
        <h2 class="section-title">
          <i class="pi pi-history"></i>
          Eventos Realizados
        </h2>
        
        <div class="eventos-timeline">
          <div
            v-for="evento in eventosPassados"
            :key="evento.id"
            class="timeline-item"
          >
            <div class="timeline-marker"></div>
            <Card class="evento-card passados">
              <template #title>
                <div class="evento-title-with-date">
                  <span>{{ evento.titulo }}</span>
                  <span class="evento-date-small">{{ formatDateComplete(evento.data) }}</span>
                </div>
              </template>
              <template #content>
                <div class="evento-summary">
                  <p>{{ evento.descricao }}</p>
                  <div class="evento-gallery" v-if="evento.fotos && evento.fotos.length > 0">
                    <img
                      v-for="(foto, index) in evento.fotos.slice(0, 3)"
                      :key="index"
                      :src="foto"
                      :alt="`Foto ${index + 1} do evento`"
                      class="evento-foto"
                      @click="showGallery(evento.fotos, index)"
                    />
                    <div
                      v-if="evento.fotos.length > 3"
                      class="foto-counter"
                      @click="showGallery(evento.fotos, 0)"
                    >
                      +{{ evento.fotos.length - 3 }}
                    </div>
                  </div>
                </div>
              </template>
            </Card>
          </div>
        </div>
      </section>

      <!-- Calendário de Eventos -->
      <section class="calendario-eventos">
        <h2 class="section-title">
          <i class="pi pi-calendar"></i>
          Calendário de Eventos
        </h2>
        
        <Card class="calendario-card">
          <template #content>
            <Calendar
              v-model="selectedDate"
              view="month"
              dateFormat="dd/mm/yy"
              :inline="true"
              class="custom-calendar"
            />
            
            <div class="eventos-do-dia" v-if="eventosDoDia.length > 0">
              <h3>Eventos em {{ formatDateComplete(selectedDate) }}</h3>
              <div
                v-for="evento in eventosDoDia"
                :key="evento.id"
                class="evento-dia-item"
              >
                <div class="evento-time">{{ formatTime(evento.data) }}</div>
                <div class="evento-info-mini">
                  <div class="evento-title-mini">{{ evento.titulo }}</div>
                  <div class="evento-local-mini">{{ evento.local }}</div>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </section>
    </div>

    <!-- Dialog de Detalhes do Evento -->
    <Dialog
      v-model:visible="showEventDialog"
      :header="selectedEvent?.titulo"
      :style="{ width: '700px' }"
      maximizable
      modal
    >
      <div v-if="selectedEvent" class="event-dialog-content">
        <div class="event-header">
          <div class="event-date-big">
            <span class="day-big">{{ formatDay(selectedEvent.data) }}</span>
            <span class="month-big">{{ formatMonth(selectedEvent.data) }}</span>
            <span class="year-big">{{ formatYear(selectedEvent.data) }}</span>
          </div>
          <div class="event-info-big">
            <div class="event-time-big">
              <i class="pi pi-clock"></i>
              {{ formatTime(selectedEvent.data) }}
            </div>
            <div class="event-location-big">
              <i class="pi pi-map-marker"></i>
              {{ selectedEvent.local }}
            </div>
          </div>
        </div>
        
        <div class="event-description-full">
          <p>{{ selectedEvent.descricao }}</p>
        </div>

        <div class="event-organizer" v-if="selectedEvent.organizador">
          <h4>Organização:</h4>
          <p>{{ selectedEvent.organizador }}</p>
        </div>

        <div class="event-requirements" v-if="selectedEvent.observacoes">
          <h4>Observações:</h4>
          <p>{{ selectedEvent.observacoes }}</p>
        </div>
      </div>
    </Dialog>

    <!-- Galleria para fotos dos eventos -->
    <Dialog
      v-model:visible="showGalleryDialog"
      header="Fotos do Evento"
      :style="{ width: '80vw' }"
      maximizable
      modal
    >
      <div v-if="galleryImages.length > 0" class="gallery-container">
        <Galleria
          :value="galleryImages"
          :responsiveOptions="responsiveOptions"
          :numVisible="5"
          containerStyle="max-width: 100%"
          :circular="true"
          :fullScreen="false"
          :showItemNavigators="true"
          :showThumbnails="true"
          :activeIndex="activeImageIndex"
        >
          <template #item="slotProps">
            <img :src="slotProps.item" class="gallery-image" />
          </template>
          <template #thumbnail="slotProps">
            <div class="grid grid-nogutter justify-content-center">
              <img :src="slotProps.item" class="gallery-thumbnail" />
            </div>
          </template>
        </Galleria>
      </div>
    </Dialog>

    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { format, differenceInDays, isAfter, isBefore, isSameDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const toast = useToast()

interface Evento {
  id: string
  titulo: string
  descricao: string
  data: Date
  local: string
  organizador?: string
  observacoes?: string
  fotos?: string[]
}

const selectedDate = ref(new Date())
const showEventDialog = ref(false)
const selectedEvent = ref<Evento | null>(null)
const showGalleryDialog = ref(false)
const galleryImages = ref<string[]>([])
const activeImageIndex = ref(0)

// Dados de exemplo dos eventos
const eventos = ref<Evento[]>([
  {
    id: '1',
    titulo: 'Festa Junina do Condomínio',
    descricao: 'Grande festa junina com quadrilha, comidas típicas, música ao vivo e brincadeiras para toda a família. Venha vestido a caráter!',
    data: new Date('2024-06-15T19:00:00'),
    local: 'Salão de Festas',
    organizador: 'Comissão de Festas',
    observacoes: 'Traje caipira é opcional, mas incentivado. Haverá concurso de melhor fantasia.'
  },
  {
    id: '2',
    titulo: 'Reunião sobre Playground',
    descricao: 'Discussão sobre melhorias no playground infantil e implementação de novos equipamentos de segurança.',
    data: new Date('2024-03-10T10:00:00'),
    local: 'Salão de Festas',
    organizador: 'Síndico João Carlos',
    observacoes: 'Reunião aberta a todos os moradores, especialmente pais com crianças.'
  },
  {
    id: '3',
    titulo: 'Aula de Aqua Aeróbica',
    descricao: 'Aulas gratuitas de aqua aeróbica para moradores. Atividade voltada para todas as idades.',
    data: new Date('2024-02-20T08:00:00'),
    local: 'Piscina',
    organizador: 'Professora Maria Silva'
  },
  {
    id: '4',
    titulo: 'Bazar Beneficente',
    descricao: 'Bazar com roupas, livros e objetos doados pelos moradores. Renda revertida para melhorias do condomínio.',
    data: new Date('2023-12-10T14:00:00'),
    local: 'Área de Lazer',
    organizador: 'Comissão de Moradores',
    fotos: [
      'https://images.pexels.com/photos/6995243/pexels-photo-6995243.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/6347919/pexels-photo-6347919.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/6995257/pexels-photo-6995257.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/6347707/pexels-photo-6347707.jpeg?auto=compress&cs=tinysrgb&w=800'
    ]
  },
  {
    id: '5',
    titulo: 'Palestra sobre Segurança',
    descricao: 'Palestra sobre segurança residencial com dicas de prevenção e apresentação de novas tecnologias.',
    data: new Date('2023-11-25T19:30:00'),
    local: 'Salão de Festas',
    organizador: 'Empresa de Segurança',
    fotos: [
      'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=800'
    ]
  },
  {
    id: '6',
    titulo: 'Festa de Fim de Ano',
    descricao: 'Confraternização de fim de ano com jantar, música e sorteio de brindes para os moradores.',
    data: new Date('2023-12-30T20:00:00'),
    local: 'Salão de Festas',
    organizador: 'Administração',
    fotos: [
      'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1167355/pexels-photo-1167355.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=800'
    ]
  }
])

const eventosProximos = computed(() => {
  const now = new Date()
  return eventos.value
    .filter(evento => isAfter(evento.data, now))
    .sort((a, b) => a.data.getTime() - b.data.getTime())
})

const eventosPassados = computed(() => {
  const now = new Date()
  return eventos.value
    .filter(evento => isBefore(evento.data, now))
    .sort((a, b) => b.data.getTime() - a.data.getTime())
})

const eventosDoDia = computed(() => {
  if (!selectedDate.value) return []
  return eventos.value.filter(evento => isSameDay(evento.data, selectedDate.value))
})

const responsiveOptions = ref([
  {
    breakpoint: '1024px',
    numVisible: 3
  },
  {
    breakpoint: '768px',
    numVisible: 2
  },
  {
    breakpoint: '560px',
    numVisible: 1
  }
])

const formatDay = (date: Date) => {
  return format(date, 'dd', { locale: ptBR })
}

const formatMonth = (date: Date) => {
  return format(date, 'MMM', { locale: ptBR }).toUpperCase()
}

const formatYear = (date: Date) => {
  return format(date, 'yyyy', { locale: ptBR })
}

const formatTime = (date: Date) => {
  return format(date, 'HH:mm', { locale: ptBR })
}

const formatDateComplete = (date: Date) => {
  return format(date, 'dd/MM/yyyy', { locale: ptBR })
}

const getDaysUntil = (date: Date) => {
  return differenceInDays(date, new Date())
}

const showEventDetails = (evento: Evento) => {
  selectedEvent.value = evento
  showEventDialog.value = true
}

const setReminder = (evento: Evento) => {
  toast.add({
    severity: 'success',
    summary: 'Lembrete Definido',
    detail: `Você será lembrado sobre "${evento.titulo}"`,
    life: 3000
  })
}

const showGallery = (images: string[], startIndex: number = 0) => {
  galleryImages.value = images
  activeImageIndex.value = startIndex
  showGalleryDialog.value = true
}
</script>

<style scoped>
.eventos-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.eventos-header {
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

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.section-title i {
  color: #667eea;
}

.proximos-eventos {
  margin-bottom: 4rem;
}

.eventos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.evento-card {
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.evento-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.evento-card.proximos {
  border-left: 4px solid #667eea;
}

.evento-card.passados {
  opacity: 0.9;
}

.evento-date-header {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.date-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.day {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
}

.month {
  font-size: 1rem;
  opacity: 0.9;
}

.year {
  font-size: 0.875rem;
  opacity: 0.8;
}

.countdown {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1rem;
}

.countdown-number {
  font-size: 1.5rem;
  font-weight: 700;
}

.countdown-text {
  font-size: 0.875rem;
  opacity: 0.9;
}

.evento-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1rem 0;
}

.evento-local,
.evento-horario {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
}

.evento-description {
  line-height: 1.6;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.evento-actions {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}

.eventos-passados {
  margin-bottom: 4rem;
}

.eventos-timeline {
  position: relative;
  padding-left: 2rem;
}

.eventos-timeline::before {
  content: '';
  position: absolute;
  left: 1rem;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, #667eea, #764ba2);
}

.timeline-item {
  position: relative;
  margin-bottom: 2rem;
}

.timeline-marker {
  position: absolute;
  left: -2rem;
  top: 1rem;
  width: 12px;
  height: 12px;
  background: #667eea;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 0 0 3px #667eea;
}

.evento-title-with-date {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.evento-date-small {
  font-size: 0.875rem;
  color: #666;
  font-weight: normal;
}

.evento-gallery {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  align-items: center;
}

.evento-foto {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.evento-foto:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.foto-counter {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: rgba(102, 126, 234, 0.8);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.foto-counter:hover {
  background: rgba(102, 126, 234, 1);
  transform: scale(1.1);
}

.calendario-eventos {
  margin-bottom: 4rem;
}

.calendario-card {
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.custom-calendar {
  width: 100%;
}

.eventos-do-dia {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e9ecef;
}

.eventos-do-dia h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.evento-dia-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
  margin-bottom: 0.5rem;
}

.evento-time {
  background: #667eea;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
}

.evento-title-mini {
  font-weight: 600;
  color: #2c3e50;
}

.evento-local-mini {
  color: #666;
  font-size: 0.875rem;
}

.event-dialog-content {
  padding: 1rem 0;
}

.event-header {
  display: flex;
  gap: 2rem;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 12px;
}

.event-date-big {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.day-big {
  font-size: 3rem;
  font-weight: 700;
  line-height: 1;
}

.month-big {
  font-size: 1.25rem;
  opacity: 0.9;
}

.year-big {
  font-size: 1rem;
  opacity: 0.8;
}

.event-info-big {
  flex: 1;
}

.event-time-big,
.event-location-big {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.event-description-full {
  line-height: 1.7;
  margin-bottom: 2rem;
  color: #2c3e50;
}

.event-organizer,
.event-requirements {
  margin-bottom: 1.5rem;
}

.event-organizer h4,
.event-requirements h4 {
  color: #667eea;
  margin-bottom: 0.5rem;
}

.gallery-container {
  width: 100%;
}

.gallery-image {
  width: 100%;
  height: 500px;
  object-fit: contain;
  border-radius: 8px;
}

.gallery-thumbnail {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
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
  
  .eventos-grid {
    grid-template-columns: 1fr;
  }
  
  .section-title {
    font-size: 1.5rem;
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
  
  .evento-actions {
    flex-direction: column;
  }
  
  .eventos-timeline {
    padding-left: 1.5rem;
  }
  
  .timeline-marker {
    left: -1.5rem;
  }
  
  .event-header {
    flex-direction: column;
    text-align: center;
  }
  
  .evento-title-with-date {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}
</style>