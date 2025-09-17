<template>
  <div class="app">
    <Navbar />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import Navbar from './components/Navbar.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #2c3e50;
  background-color: #ffffff;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}

/* PrimeVue customizations */
.p-button {
  border-radius: 8px;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.p-button:hover {
  transform: translateY(-2px);
}

.p-card {
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: none;
}

.p-inputtext {
  border-radius: 8px;
  border: 2px solid #e0e6ed;
  transition: all 0.3s ease;
}

.p-inputtext:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.p-dropdown {
  border-radius: 8px;
  border: 2px solid #e0e6ed;
}

.p-calendar {
  border-radius: 8px;
}

.p-calendar .p-inputtext {
  border-radius: 8px 0 0 8px;
}

.p-datatable {
  border-radius: 12px;
  overflow: hidden;
}

.p-datatable .p-datatable-header {
  background: #f8f9fa;
  border: none;
  padding: 1.5rem;
}

.p-datatable .p-datatable-tbody > tr:hover {
  background: #f8f9fa;
}

.p-toast {
  z-index: 9999;
}

.p-toast .p-toast-message {
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.p-carousel .p-carousel-indicators .p-carousel-indicator {
  background-color: rgba(255, 255, 255, 0.5);
}

.p-carousel .p-carousel-indicators .p-carousel-indicator.p-highlight {
  background-color: #667eea;
}

.p-galleria .p-galleria-indicators .p-galleria-indicator {
  background-color: rgba(255, 255, 255, 0.5);
}

.p-galleria .p-galleria-indicators .p-galleria-indicator.p-highlight {
  background-color: #667eea;
}

/* Responsive utilities */
@media (max-width: 768px) {
  .p-card {
    margin: 0.5rem;
  }
  
  .p-dialog {
    width: 95vw !important;
    margin: 1rem;
  }
  
  .p-datatable {
    font-size: 0.875rem;
  }
  
  .p-button {
    padding: 0.75rem 1rem;
  }
}

/* Loading animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #667eea;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #5a6fd8;
}

/* Focus styles */
.p-button:focus,
.p-inputtext:focus,
.p-dropdown:focus {
  outline: none;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

/* Utility classes */
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

.mb-1 { margin-bottom: 0.5rem; }
.mb-2 { margin-bottom: 1rem; }
.mb-3 { margin-bottom: 1.5rem; }
.mb-4 { margin-bottom: 2rem; }

.mt-1 { margin-top: 0.5rem; }
.mt-2 { margin-top: 1rem; }
.mt-3 { margin-top: 1.5rem; }
.mt-4 { margin-top: 2rem; }

.p-1 { padding: 0.5rem; }
.p-2 { padding: 1rem; }
.p-3 { padding: 1.5rem; }
.p-4 { padding: 2rem; }

.font-weight-bold { font-weight: 700; }
.font-weight-normal { font-weight: 400; }

.text-primary { color: #667eea; }
.text-secondary { color: #6c757d; }
.text-success { color: #28a745; }
.text-warning { color: #ffc107; }
.text-danger { color: #dc3545; }

.bg-primary { background-color: #667eea; }
.bg-light { background-color: #f8f9fa; }
.bg-white { background-color: #ffffff; }
</style>