<template>
  <div class="navbar-container">
    <Menubar :model="items" class="custom-menubar">
      <template #start>
        <div class="logo-container">
          <i class="pi pi-building text-2xl text-primary"></i>
          <span class="logo-text">Condomínio Residencial</span>
        </div>
      </template>
      <template #end>
        <div class="flex align-items-center gap-2">
          <Button 
            icon="pi pi-calendar"
            label="RESERVAR SALÃO"
            class="p-button-rounded p-button-warning reserve-button"
            @click="$router.push('/reservas')"
          />
          <Button 
            icon="pi pi-cog"
            class="p-button-rounded p-button-text"
            @click="$router.push('/admin/login')"
            v-tooltip.bottom="'Administração'"
          />
        </div>
      </template>
    </Menubar>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const items = ref([
  {
    label: 'HOME',
    icon: 'pi pi-home',
    command: () => router.push('/')
  },
  {
    label: 'RESERVAS DO SALÃO',
    icon: 'pi pi-calendar',
    command: () => router.push('/reservas')
  },
  {
    label: 'NOTÍCIAS E COMUNICADOS',
    icon: 'pi pi-megaphone',
    command: () => router.push('/noticias')
  },
  {
    label: 'DOCUMENTOS',
    icon: 'pi pi-file-pdf',
    command: () => router.push('/documentos')
  },
  {
    label: 'EVENTOS',
    icon: 'pi pi-star',
    command: () => router.push('/eventos')
  }
])
</script>

<style scoped>
.navbar-container {
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 12px rgba(0,0,0,.1);
}

.custom-menubar {
  border: none;
  border-radius: 0;
  background: ffffff;
  padding: 1rem 2rem;
}

.custom-menubar .p-menubar-root-list > .p-menuitem > .p-menuitem-link {
  color: white;
  font-weight: 600;
  letter-spacing: 0.5px;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.custom-menubar .p-menubar-root-list > .p-menuitem > .p-menuitem-link:hover {
  background: rgba(255,255,255,0.2);
  transform: translateY(-2px);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: white;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.reserve-button {
  background: linear-gradient(135deg, #ff6b6b, #ffa500) !important;
  border: none !important;
  font-weight: 600;
  letter-spacing: 0.5px;
  padding: 0.75rem 1.5rem !important;
  box-shadow: 0 4px 15px rgba(255,107,107,0.3);
  transition: all 0.3s ease;
}

.reserve-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255,107,107,0.4);
}

@media (max-width: 768px) {
  .custom-menubar {
    padding: 0.75rem 1rem;
  }
  
  .logo-text {
    display: none;
  }
  
  .reserve-button .p-button-label {
    display: none;
  }
}
</style>