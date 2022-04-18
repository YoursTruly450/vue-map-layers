<template>
  <div ref="map-root" class="map-layer">
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import * as olExtent from 'ol/extent';
import View from 'ol/View';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
// we’ll need these additional imports
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import {DragBox, Select} from 'ol/interaction';
import {Fill, Stroke, Style} from 'ol/style';
import {platformModifierKeyOnly} from 'ol/events/condition';

// importing the OpenLayers stylesheet is required for having
// good looking buttons!
import 'ol/ol.css';

export default {
  name: 'MapLayer',
  components: {},
  data() {
    return {
      features: [],
      olMap: null,
      vectorSource: null,
      selected: null
    }
  },
  async mounted() {  
    await this.getCountries();
    this.createFeatures(); //add fetures from geojson
    this.createMap();
    this.addSelectInteraction();
    this.addDragBoxinteraction();
    this.addClickInteraction();
  },
  computed: {
    ...mapGetters(['countries']),
  },
  methods: {
    ...mapActions(['getCountries', 'setSelectedCountries', 'getrandomText']),
    createFeatures() {
      this.countries.features.forEach((feature => {
        this.features.push(
          new GeoJSON().readFeature(feature, {
            // this is required since GeoJSON uses latitude/longitude,
            // but the map is rendered using “Web Mercator”
            featureProjection: 'EPSG:3857'
          })
        )
      }))
    },
    createMap() {
      // a new vector layer is created with the feature
      this.vectorSource = new VectorSource({
        features: this.features,
      });
      const vectorLayer = new VectorLayer({
        source: this.vectorSource
      });

      //create OpenLayers map
      this.olMap = new Map({
        target: this.$refs['map-root'],
        layers: [
          //background tiled layer
          new TileLayer({
            source: new OSM()
          }),
          vectorLayer
        ],
        // the map view will initially show the whole world
        view: new View({
          zoom: 2,
          center: [0, 0],
          constrainResolution: true
        }),
      });
    },
    addSelectInteraction() {
      const selectedStyle = new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.6)',
        }),
        stroke: new Stroke({
          color: 'rgba(255, 255, 255, 0.7)',
          width: 2,
        }),
      });

      // a normal select interaction to handle click
      const select = new Select({
        style: function (feature) {
          const color = feature.get('COLOR_BIO') || '#eeeeee';
          selectedStyle.getFill().setColor(color);
          return selectedStyle;
        },
      });
      this.olMap.addInteraction(select);
      this.selected = select.getFeatures();
    },
    addDragBoxinteraction() {
      // a DragBox interaction used to select features by drawing boxes
      const dragBox = new DragBox({
        condition: platformModifierKeyOnly,
      });

      this.olMap.addInteraction(dragBox);

      dragBox.on('boxstart', () => {
        this.selected.clear();
      });

      dragBox.on('boxend', () => {
        const extent = dragBox.getGeometry().getExtent();
        const boxFeatures = this.vectorSource
          .getFeaturesInExtent(extent)
          .filter((feature) => feature.getGeometry().intersectsExtent(extent)) || [];
        this.selected.extend(boxFeatures);
        const features = this.createFeatureArray(boxFeatures);
        this.setSelectedCountries({selectedFeatures: features});
      });
    },
    addClickInteraction() {
      this.selected.clear();
      this.olMap.on('click', (event) => {
        const selectedFeatures = this.olMap.forEachFeatureAtPixel(event.pixel, (feature) => feature);
        let features = [];
        if (selectedFeatures) {
          features = this.createFeatureArray([selectedFeatures]);
          this.selected.extend([selectedFeatures]);
        }
        this.setSelectedCountries({selectedFeatures: features});
      })
    },
    createFeatureArray(features) {
      let arr = [];
      if (features.length > 0) {
        arr = features.map(async (feature) => {
          let obj = {};
          const extent = feature.getGeometry().transform('EPSG:3857', 'EPSG:4326').getExtent(); // transform coordinates to geographic
          obj.coordinates = olExtent.getCenter(extent).reverse(); // lon/lat to lat/lon
          obj.name = feature.values_.name;
          obj.description = await this.getrandomText({type: 'sentence', number: 3});
          feature.getGeometry().transform('EPSG:4326', 'EPSG:3857'); // tranform coordinates to default
          return obj;
        });
      }
      return arr;
    },
  },
  watch: {},
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/map.scss';
</style>