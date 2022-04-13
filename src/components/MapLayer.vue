<template>
  <section>
    <div v-if="countries.length">
      {{ countries }}
    </div>
    <div v-else>Data loading ...</div>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  name: 'MapLayer',
  components: {},
  data() {
    return {}
  },
  async created() {
    await this.getCountries();
  },
  computed: {
    ...mapGetters(['countries']),
  },
  methods: {
    ...mapActions(['getCountries']),
  },
  watch: {},
}
</script>

<style lang="scss" scoped>
</style>