<template>
  <div class="main-block">
    <map-layer></map-layer>
    <selection-list></selection-list>
  </div>
</template>

<script>
import MapLayer from './MapLayer.vue';
import SelectionList from './SelectionList.vue';

export default {
  name: 'MainBlock',
  components: {
    MapLayer,
    SelectionList
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
</style>