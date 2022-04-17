import axios from 'axios';

export default ({
  state: {
    countries: [],
    selectedCountries: []
  },
  getters: {
    countries(state) {
      return state.countries;
    },
    selectedCountries(state) {
      return state.selectedCountries;
    },
  },
  mutations: {
    updateCountries(state, countries) {
      state.countries = countries;
    },
    updateSelectedCountries(state, selectedCountries) {
      state.selectedCountries = selectedCountries;
    },
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
    },

    setSelectedCountries(ctx, {selectedFeatures}) {
      ctx.commit('updateSelectedCountries', selectedFeatures);
    }
  }
})