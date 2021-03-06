<template>
    <div ref="map-root" class="map-layer">
      <div v-show="isOverlayVisible" id="popup" class="map-layer__overlay">
        <p class="map-layer__title">{{title}}</p>
        <p class="__mt4">широта: {{coordinates[1].toFixed(2)}} долгота: {{coordinates[0].toFixed(2)}}</p>
        <p class="__mt4">{{randomText}}</p>
      </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import * as olExtent from 'ol/extent';
import View from 'ol/View';
import Map from 'ol/Map';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Overlay from 'ol/Overlay';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import {DragBox, Select} from 'ol/interaction';
import {Fill, Stroke, Style, Icon} from 'ol/style';
import {shiftKeyOnly} from 'ol/events/condition';

// importing the OpenLayers stylesheet is required for having
// good looking buttons!
import 'ol/ol.css';

export default {
  name: 'MapLayer',
  components: {},
  data() {
    return {
      isOverlayVisible: false,
      title: '',
      coordinates: [0, 0],
      randomText: '',
      features: [],
      olMap: null,
      vectorSource: null,
      selected: null,
      iconStyle: new Style({
        image: new Icon({
        anchor: [0.5, 1],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: './icons/Vector.png',
        }),
      }),
      iconFeature: new Feature({
        geometry: new Point([0, 0])
      }),
      markerSource: new VectorSource({
        features: [],
      }),
      popup: new Overlay({
        element: null,
        positioning: 'bottom-left',
        stopEvent: false,
        offset: [0, -36]
      })
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

      // Icon/Marker layer creating
      this.iconFeature.setStyle(this.iconStyle);

      const markerLayer = new VectorLayer({
        source: this.markerSource,
      });

      //create OpenLayers map
      this.olMap = new Map({
        target: this.$refs['map-root'],
        layers: [
          //background tiled layer
          new TileLayer({
            source: new OSM()
          }),
          vectorLayer,
          markerLayer
        ],
        // the map view will initially show the whole world
        view: new View({
          zoom: 2,
          center: [0, 0],
          constrainResolution: true
        }),
      });

      // Set overlay element
      const element = document.getElementById('popup');
      this.popup.element = element;
      this.popup.setPosition(undefined);
      this.olMap.addOverlay(this.popup);
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
          const color = feature.get('COLOR_BIO') || 'rgba(255, 255, 255, 0.7)';
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
        condition: shiftKeyOnly,
      });

      this.olMap.addInteraction(dragBox);

      dragBox.on('boxstart', () => {
        if (this.selected) this.selected.clear();
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
      this.olMap.on('click', (event) => {
        const selectedFeatures = this.olMap.forEachFeatureAtPixel(event.pixel, (feature) => feature);
        let features = [];
        if (selectedFeatures) {
          this.selected.extend([selectedFeatures, this.iconFeature]);
          features = this.createFeatureArray([selectedFeatures]);
          this.createMarker(event, selectedFeatures);
        } else {
          this.markerSource.clear();
          this.popup.setPosition(undefined);
          this.isOverlayVisible = false;
        }
        this.setSelectedCountries({selectedFeatures: features});
      })
    },
    createFeatureArray(features) {
      let arr = [];
      if (features.length > 0) {
        features.forEach(async (feature) => {
          let obj = {};
          await this.getrandomText({type: 'sentence', number: 3})
            .then((result) => {
              const extent = feature.getGeometry().transform('EPSG:3857', 'EPSG:4326').getExtent(); // transform coordinates to geographic
              obj.coordinates = olExtent.getCenter(extent).reverse(); // lon/lat to lat/lon
              obj.name = feature.values_.name;
              obj.description = result;
              feature.getGeometry().transform('EPSG:4326', 'EPSG:3857'); // tranform coordinates to default
            })
          arr.push(obj);
        });
      }
      return arr;
    },
    createMarker(event, feature) {
      this.isOverlayVisible = true;
      this.markerSource.clear();
      this.iconFeature.getGeometry().setCoordinates(event.coordinate);
      this.markerSource.addFeature(this.iconFeature);
      this.popup.setPosition(event.coordinate);
      this.getrandomText({type: 'sentence', number: 1})
        .then((response) => {
          this.randomText = response;
          this.coordinates = this.iconFeature.getGeometry().transform('EPSG:3857', 'EPSG:4326').getCoordinates();
          this.iconFeature.getGeometry().transform('EPSG:4326', 'EPSG:3857').getCoordinates();
          this.title = feature.values_.name;
        });
    }
  },
  watch: {},
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/map.scss';
</style>