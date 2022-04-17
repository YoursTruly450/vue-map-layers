<template>
  <section class="map-layer">
    <vl-map :load-tiles-while-animating="true" :load-tiles-while-interacting="true" data-projection="EPSG:4326">

      <vl-layer-tile>
        <vl-source-osm />
      </vl-layer-tile>

      <vl-view :zoom.sync="zoom" :center.sync="center" :rotation.sync="rotation"></vl-view>

      <vl-feature v-for="(country, index) in countries.features" :key="index" :properties="{id: country.id, properties: country.properties}">
        <vl-geom-polygon v-if="country.geometry.type === 'Polygon'" :coordinates="country.geometry.coordinates"></vl-geom-polygon>
        <vl-geom-multi-polygon v-if="country.geometry.type === 'MultiPolygon'" :coordinates="country.geometry.coordinates"></vl-geom-multi-polygon>
        <vl-style class="map-layer__feature">
          <vl-style-fill color="rgba(0, 0, 0, 0.01)"></vl-style-fill>
          <vl-style-stroke
            color="red"
            :width="1">
          </vl-style-stroke>
          <vl-style-text :text="country.properties.name"></vl-style-text>
        </vl-style>
      </vl-feature>

      <vl-layer-tile id="osm">
        <vl-source-osm></vl-source-osm>
      </vl-layer-tile>
    </vl-map>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  name: 'MapLayer',
  components: {},
  data() {
    return {
      zoom: 10,
      center: [50.153716, 53.212326],
      rotation: 0,
      geolocPosition: undefined,
    }
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
@import '@/assets/scss/map.scss';
</style>