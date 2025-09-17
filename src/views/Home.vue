<template>
  <div class="home-container">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">Bem-vindo ao Condomínio Residencial</h1>
        <p class="hero-subtitle">Qualidade de vida e conforto para toda sua família</p>
        <Button 
          label="RESERVAR SALÃO DE FESTAS"
          icon="pi pi-calendar"
          class="hero-button"
          size="large"
          @click="$router.push('/reservas')"
        />
      </div>
      <div class="hero-image">
        <img src="https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=1200" 
             alt="Condomínio" />
      </div>
    </section>

    <div class="content-wrapper">
      <!-- Carousel de Notícias -->
      <section class="news-carousel-section">
        <div class="section-header">
          <h2 class="section-title">
            <i class="pi pi-megaphone"></i>
            Últimas Notícias
          </h2>
        </div>
        
        <Carousel 
          :value="noticiasDestaque" 
          :numVisible="1" 
          :numScroll="1"
          :autoplayInterval="5000"
          class="news-carousel"
        >
          <template #item="slotProps">
            <Card class="news-card">
              <template #header>
                <img :src="slotProps.data.imagem" :alt="slotProps.data.titulo" class="news-image" />
              </template>
              <template #title>
                {{ slotProps.data.titulo }}
              </template>
              <template #content>
                <p class="news-excerpt">{{ slotProps.data.conteudo.substring(0, 150) }}...</p>
                <div class="news-meta">
                  <Chip :label="getCategoriaLabel(slotProps.data.categoria)" class="category-chip" />
                  <span class="news-date">{{ formatDate(slotProps.data.dataPublicacao) }}</span>
                </div>
              </template>
            </Card>
          </template>
        </Carousel>
      </section>

      <!-- Informações do Síndico -->
      <section class="sindico-section">
        <Card class="sindico-card">
          <template #header>
            <div class="sindico-header">
              <i class="pi pi-user-edit sindico-icon"></i>
              <h3>Informações da Administração</h3>
            </div>
          </template>
          <template #content>
            <div class="sindico-info">
              <div class="sindico-details">
                <h4>João Carlos da Silva</h4>
                <p class="sindico-role">Síndico</p>
                <div class="contact-info">
                  <div class="contact-item">
                    <i class="pi pi-phone"></i>
                    <span>(61) 98348-6146</span>
                  </div>
                  <div class="contact-item">
                    <i class="pi pi-envelope"></i>
                    <span>sindico@condominio.com.br</span>
                  </div>
                  <div class="contact-item">
                    <i class="pi pi-clock"></i>
                    <span>Atendimento: Seg-Sex 8h às 17h</span>
                  </div>
                </div>
              </div>
              <div class="sindico-avatar">
                <img src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400" 
                     alt="Síndico" />
              </div>
            </div>
          </template>
        </Card>
      </section>

      <!-- Próximos Eventos -->
      <section class="events-section">
        <div class="section-header">
          <h2 class="section-title">
            <i class="pi pi-star"></i>
            Próximos Eventos
          </h2>
        </div>
        
        <div class="events-grid">
          <Card v-for="evento in eventosProximos" :key="evento.id" class="event-card">
            <template #content>
              <div class="event-date">
                <span class="event-day">{{ formatDay(evento.data) }}</span>
                <span class="event-month">{{ formatMonth(evento.data) }}</span>
              </div>
              <div class="event-details">
                <h4 class="event-title">{{ evento.titulo }}</h4>
                <p class="event-location">
                  <i class="pi pi-map-marker"></i>
                  {{ evento.local }}
                </p>
                <p class="event-description">{{ evento.descricao }}</p>
              </div>
            </template>
          </Card>
        </div>
      </section>

      <!-- Galeria de Áreas Comuns -->
      <section class="gallery-section">
        <div class="section-header">
          <h2 class="section-title">
            <i class="pi pi-images"></i>
            Nossas Áreas Comuns
          </h2>
        </div>
        
        <Galleria 
          :value="areasComuns" 
          :responsiveOptions="responsiveOptions"
          :numVisible="4"
          containerStyle="max-width: 100%"
          :showThumbnails="false"
          :showIndicators="true"
          :changeItemOnIndicatorHover="true"
          :autoPlay="true"
          :transitionInterval="4000"
        >
          <template #item="slotProps">
            <div class="gallery-item">
              <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt" class="gallery-image" />
              <div class="gallery-caption">
                <h4>{{ slotProps.item.title }}</h4>
                <p>{{ slotProps.item.alt }}</p>
              </div>
            </div>
          </template>
        </Galleria>
      </section>

      <!-- Mural de Avisos -->
      <section class="notices-section">
        <div class="section-header">
          <h2 class="section-title">
            <i class="pi pi-bookmark"></i>
            Mural de Avisos
          </h2>
        </div>
        
        <div class="notices-grid">
          <Card v-for="aviso in avisos" :key="aviso.id" class="notice-card">
            <template #content>
              <div class="notice-header">
                <Badge :value="aviso.tipo" :class="getBadgeClass(aviso.tipo)" />
                <span class="notice-date">{{ formatDate(aviso.data) }}</span>
              </div>
              <h4 class="notice-title">{{ aviso.titulo }}</h4>
              <p class="notice-content">{{ aviso.conteudo }}</p>
            </template>
          </Card>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useNoticiasStore } from '../stores/noticias'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const noticiasStore = useNoticiasStore()

const noticiasDestaque = computed(() => 
  noticiasStore.noticias.filter(n => n.destaque).slice(0, 3)
)

const eventosProximos = computed(() => 
  noticiasStore.eventos
    .filter(e => e.data >= new Date())
    .sort((a, b) => a.data.getTime() - b.data.getTime())
    .slice(0, 3)
)

const areasComuns = ref([
  {
    itemImageSrc: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Piscina com área de lazer completa',
    title: 'Piscina'
  },
  {
    itemImageSrc: 'https://images.pexels.com/photos/1552617/pexels-photo-1552617.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Academia equipada com aparelhos modernos',
    title: 'Academia'
  },
  {
    itemImageSrc: 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Salão de festas para eventos',
    title: 'Salão de Festas'
  },
  {
    itemImageSrc: 'https://images.pexels.com/photos/1104007/pexels-photo-1104007.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Playground infantil seguro e divertido',
    title: 'Playground'
  }
])

const avisos = ref([
  {
    id: '1',
    tipo: 'IMPORTANTE',
    titulo: 'Limpeza da Caixa d\'Água',
    conteudo: 'Será realizada a limpeza da caixa d\'água no próximo sábado. Pode haver interrupção no fornecimento.',
    data: new Date('2024-01-22')
  },
  {
    id: '2',
    tipo: 'LEMBRETE',
    titulo: 'Coleta de Lixo',
    conteudo: 'Lembrem-se: coleta de lixo reciclável às terças e quintas-feiras.',
    data: new Date('2024-01-20')
  },
  {
    id: '3',
    tipo: 'URGENTE',
    titulo: 'Vazamento no 3º Andar',
    conteudo: 'Identificado vazamento no 3º andar. Equipe de manutenção já foi acionada.',
    data: new Date('2024-01-21')
  }
])

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

const formatDate = (date: Date) => {
  return format(date, 'dd/MM/yyyy', { locale: ptBR })
}

const formatDay = (date: Date) => {
  return format(date, 'dd', { locale: ptBR })
}

const formatMonth = (date: Date) => {
  return format(date, 'MMM', { locale: ptBR }).toUpperCase()
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

const getBadgeClass = (tipo: string) => {
  const classes: Record<string, string> = {
    IMPORTANTE: 'p-badge-warning',
    LEMBRETE: 'p-badge-info',
    URGENTE: 'p-badge-danger'
  }
  return classes[tipo] || 'p-badge-secondary'
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
}

.hero-section {
  position: relative;
  height: 70vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  padding: 2rem 4rem;
  flex: 1;
  color: white;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.1;
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-button {
  background: linear-gradient(135deg, #ff6b6b, #ffa500) !important;
  border: none !important;
  padding: 1rem 2rem !important;
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  box-shadow: 0 8px 32px rgba(255, 107, 107, 0.3);
  transition: all 0.3s ease;
}

.hero-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(255, 107, 107, 0.4);
}

.hero-image {
  position: relative;
  z-index: 2;
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
}

.hero-image img {
  width: 100%;
  height: 80%;
  object-fit: cover;
  border-radius: 20px 0 0 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.content-wrapper {
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.section-title i {
  color: #667eea;
}

.news-carousel-section {
  margin-bottom: 4rem;
}

.news-carousel {
  margin: 0 auto;
}

.news-card {
  margin: 1rem;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.news-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.news-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.news-excerpt {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.news-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-chip {
  background: #667eea;
}

.news-date {
  color: #888;
  font-size: 0.9rem;
}

.sindico-section {
  margin-bottom: 4rem;
}

.sindico-card {
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.sindico-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.sindico-icon {
  font-size: 2rem;
}

.sindico-info {
  display: flex;
  gap: 2rem;
  align-items: center;
  padding: 1.5rem;
}

.sindico-details {
  flex: 1;
}

.sindico-details h4 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.sindico-role {
  color: #667eea;
  font-weight: 600;
  margin-bottom: 1rem;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #666;
}

.contact-item i {
  color: #667eea;
}

.sindico-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.sindico-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.events-section {
  margin-bottom: 4rem;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.event-card {
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.event-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.event-card .p-card-content {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.event-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 12px;
  padding: 1rem;
  min-width: 80px;
  text-align: center;
}

.event-day {
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1;
}

.event-month {
  font-size: 0.9rem;
  opacity: 0.9;
}

.event-details {
  flex: 1;
}

.event-title {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.event-location {
  color: #667eea;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.event-description {
  color: #666;
  line-height: 1.5;
}

.gallery-section {
  margin-bottom: 4rem;
}

.gallery-item {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
}

.gallery-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.gallery-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  padding: 2rem;
  text-align: center;
}

.gallery-caption h4 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.notices-section {
  margin-bottom: 4rem;
}

.notices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.notice-card {
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.notice-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.notice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.notice-date {
  color: #888;
  font-size: 0.9rem;
}

.notice-title {
  color: #2c3e50;
  margin-bottom: 0.75rem;
}

.notice-content {
  color: #666;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .hero-section {
    flex-direction: column;
    height: auto;
    text-align: center;
  }
  
  .hero-content {
    padding: 2rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
  }
  
  .hero-image {
    width: 100%;
    padding: 1rem;
  }
  
  .hero-image img {
    border-radius: 16px;
    height: 250px;
  }
  
  .content-wrapper {
    padding: 2rem 1rem;
  }
  
  .section-title {
    font-size: 2rem;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .sindico-info {
    flex-direction: column;
    text-align: center;
  }
  
  .event-card .p-card-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style>