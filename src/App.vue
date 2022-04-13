<template>
  <map-layer></map-layer>
</template>

<script>
import MapLayer from './components/MapLayer.vue';

export default {

  name: 'App',
  components: {
    MapLayer
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';
</style>
