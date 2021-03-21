import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus';

const app = createApp(App)
app.use(ElementPlus);
app.use(store).use(router).mount('#app')
