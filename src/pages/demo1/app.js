import Vue from 'vue'
import App from './app.vue'
import routes from './routes'
import Router from 'vue-router'
import '@/assets/css/rem.css'
console.log('改动这句话刷新')
Vue.use(Router)
new Vue({
  el: '#app',
  render: h => h(App),
  router: new Router(routes)
})
