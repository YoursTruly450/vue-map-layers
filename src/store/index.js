import countries from './modules/countries';

import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
    alert('Something going wrong...');
    return Promise.reject(error);
});

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    countries
  }
})
