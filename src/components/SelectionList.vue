<template>
  <div class="selection-list">
    <p class="selection-list__title">Список элементов попавших в выделенную область</p>
    <div v-if="selectedCountries.length > 0" class="selection-list__list">
      <CountryDescription 
        v-for="(country, index) in selectedCountries"
        :key="index"
        :country="country"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import CountryDescription from './CountryDescription.vue';

export default {
  name: 'SelectionList',
  components: {
    CountryDescription
  },
  data() {
    return {}
  },
  async created() {},
  computed: {
    ...mapGetters(['selectedCountries']),
  },
  methods: {},
  watch: {},
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/list.scss';
</style>