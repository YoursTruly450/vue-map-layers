<template>
  <div class="country">
    <p class="country__name">{{country.name}}</p>
    <p class="country__coordinates __mt8">Центр координат:</p>
    <p class="__mt8">широта: {{country.coordinates[0]}} долгота: {{country.coordinates[1]}}</p>
    <p class="__mt8">Описание:</p>
    <p class="__mt8">{{country.description}}</p>
  </div>
</template>

<script>
export default {
  name: 'CountryDescription',
  components: {},
  props: {
    country: Object
  },
  data() {
    return {}
  },
  async created() {},
  computed: {},
  methods: {},
  watch: {},
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/country.scss';
</style>