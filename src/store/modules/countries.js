import axios from 'axios';

export default ({
  state: {
    countries: []
  },
  getters: {
    countries(state) {
      return state.countries;
    }
  },
  mutations: {
    updateCountries(state, countries) {
      state.countries = countries.features;
    }
  },
  actions: {
    getCountries(ctx) {
      const url = '/api/countries.json';
      return axios({
        method: 'GET',
        url: url
      })
        .then(response => {
          const countries = response.data;
          ctx.commit('updateCountries', countries);
        })
        .catch(error => console.error(error));
    }
  }
})