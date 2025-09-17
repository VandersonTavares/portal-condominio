import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from './router'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import 'primeicons/primeicons.css'
import './style.css'
import App from './App.vue'

// PrimeVue Components
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Calendar from 'primevue/calendar'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import Textarea from 'primevue/textarea'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import FileUpload from 'primevue/fileupload'
import Carousel from 'primevue/carousel'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Menubar from 'primevue/menubar'
import Badge from 'primevue/badge'
import Chip from 'primevue/chip'
import Galleria from 'primevue/galleria'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: '.dark',
      cssLayer: false
    }
  }
})
app.use(ToastService)

// Register components
app.component('Button', Button)
app.component('InputText', InputText)
app.component('Calendar', Calendar)
app.component('Card', Card)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Dialog', Dialog)
app.component('Dropdown', Dropdown)
app.component('Textarea', Textarea)
app.component('Toast', Toast)
app.component('FileUpload', FileUpload)
app.component('Carousel', Carousel)
app.component('TabView', TabView)
app.component('TabPanel', TabPanel)
app.component('Menubar', Menubar)
app.component('Badge', Badge)
app.component('Chip', Chip)
app.component('Galleria', Galleria)

app.mount('#app')