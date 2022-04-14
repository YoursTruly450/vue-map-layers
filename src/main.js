import App from './App.vue';

import Vue from 'vue';
import store from './store';
import VueLayers from 'vuelayers';
import 'vuelayers/dist/vuelayers.css';

Vue.use(VueLayers);

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App)
}).$mount('#app');
