<template>
  <div class="admin-login-container">
    <Card class="login-card">
      <template #header>
        <div class="login-header">
          <i class="pi pi-shield login-icon"></i>
          <h2>Acesso Administrativo</h2>
          <p>Entre com suas credenciais de administrador</p>
        </div>
      </template>
      <template #content>
        <form @submit.prevent="login" class="login-form">
          <div class="form-group">
            <label for="username">Usuário:</label>
            <InputText
              id="username"
              v-model="credentials.username"
              placeholder="Digite seu usuário"
              :class="{ 'p-invalid': errors.username }"
              required
            />
            <small v-if="errors.username" class="p-error">{{ errors.username }}</small>
          </div>

          <div class="form-group">
            <label for="password">Senha:</label>
            <InputText
              id="password"
              type="password"
              v-model="credentials.password"
              placeholder="Digite sua senha"
              :class="{ 'p-invalid': errors.password }"
              required
            />
            <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
          </div>

          <Button
            type="submit"
            label="Entrar"
            icon="pi pi-sign-in"
            class="login-button"
            :loading="loading"
            size="large"
          />

          <div class="demo-credentials">
            <h4>Credenciais de demonstração:</h4>
            <p><strong>Usuário:</strong> admin</p>
            <p><strong>Senha:</strong> admin123</p>
          </div>
        </form>
      </template>
    </Card>

    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const toast = useToast()

const loading = ref(false)

const credentials = reactive({
  username: '',
  password: ''
})

const errors = reactive({
  username: '',
  password: ''
})

const validateForm = () => {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  if (!credentials.username.trim()) {
    errors.username = 'Usuário é obrigatório'
    isValid = false
  }

  if (!credentials.password.trim()) {
    errors.password = 'Senha é obrigatória'
    isValid = false
  }

  return isValid
}

const login = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    // Simular autenticação
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      localStorage.setItem('admin_logged_in', 'true')
      
      toast.add({
        severity: 'success',
        summary: 'Login realizado',
        detail: 'Bem-vindo ao painel administrativo!',
        life: 3000
      })

      router.push('/admin')
    } else {
      toast.add({
        severity: 'error',
        summary: 'Erro de autenticação',
        detail: 'Usuário ou senha incorretos',
        life: 3000
      })
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro interno do servidor',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.admin-login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-card {
  width: 100%;
  max-width: 450px;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.login-header {
  background: linear-gradient(135deg, #2c3e50, #34495e);
  color: white;
  padding: 3rem 2rem 2rem;
  text-align: center;
}

.login-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  color: #3498db;
}

.login-header h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
  font-weight: 700;
}

.login-header p {
  margin: 0;
  opacity: 0.8;
  font-size: 1rem;
}

.login-form {
  padding: 2rem;
}

.form-group {
  margin-bottom: 2rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.form-group .p-inputtext {
  width: 100%;
  padding: 1rem;
  border-radius: 10px;
  border: 2px solid #e0e6ed;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group .p-inputtext:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.form-group .p-inputtext.p-invalid {
  border-color: #e74c3c;
}

.login-button {
  width: 100%;
  background: linear-gradient(135deg, #667eea, #764ba2) !important;
  border: none !important;
  padding: 1rem !important;
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  border-radius: 10px !important;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
}

.demo-credentials {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid #3498db;
}

.demo-credentials h4 {
  color: #2c3e50;
  margin: 0 0 1rem 0;
  font-size: 1rem;
}

.demo-credentials p {
  margin: 0.5rem 0;
  color: #666;
  font-size: 0.9rem;
}

@media (max-width: 480px) {
  .admin-login-container {
    padding: 1rem;
  }
  
  .login-header {
    padding: 2rem 1.5rem 1.5rem;
  }
  
  .login-icon {
    font-size: 3rem;
  }
  
  .login-header h2 {
    font-size: 1.5rem;
  }
  
  .login-form {
    padding: 1.5rem;
  }
}
</style>