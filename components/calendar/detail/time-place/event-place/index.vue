<template>
  <div class="map-box">
    <client-only>
      <yandex-map :coords="coordinates" :controls="[]" :zoom=15>
          <ymap-marker
          :coords="coordinates"
          :marker-id="1"
          :icon="markerIcon"
        ></ymap-marker>
      </yandex-map>
    </client-only>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  coordinates: {
    type: Array,
    required: true
  },
  place: {
    type: String
  }
});

const coordinates = [props.coordinates[0], props.coordinates[1]];

const markerIcon = {
  layout: 'default#imageWithContent',
  imageSize: [30, 35],
  imageOffset: [-15, -25],
  content: props.place,
  contentOffset: [25, 10],
  contentLayout: '<a style="background: #FFFFFF;">$[properties.iconContent]</a>'
}
</script>

<style lang="scss" scoped>
.map-box {
  height: 480px;
  border: 1px solid rgb(221 222 224);
  border-radius: 0.5rem;

  & > section {
    height: 100%;
  }
}
</style>
