<template>
  <div class="cover" :style="{ background: bgTheme }">
    <img :src="imgUrl" v-if="imgUrl && !showImage" @error="showImage = true"/>
    <span v-html="icon" v-else/>
  </div>
</template>

<script lang="ts" setup>
const {type, imgUrl} = defineProps<{ type: any, imgUrl: any }>();
const showImage = ref(false)
import mem_dots_square from "~/assets/images/materials-library/mem_dots_square.svg?raw";
import material_square from "~/assets/images/materials-library/material_square.svg?raw";
import mem_wave4 from "~/assets/images/materials-library/mem_wave4.svg?raw";
import mem_arrows from "~/assets/images/materials-library/mem_arrows.svg?raw";
import triangle from "~/assets/images/materials-library/triangle.svg?raw";

const icon = computed(() => {
  switch (type) {
    case "tsok":
      return material_square;
    case "project":
      return mem_wave4;
    case "competence":
      return mem_dots_square;
    case "article":
      return mem_arrows;
    case "eor":
      return triangle;
    default:
      return material_square;
  }
});

const bgTheme = computed(() => {
  switch (type) {
    case "tsok":
      return "#E4F1FF";
    case "project":
      return "#5B7BEB";
    case "competence":
      return "#E2DAFF";
    case "article":
      return "#FFE445";
    case "eor":
      return "#D5EB77";
    default:
      return "#E4F1FF";
  }
});
</script>

<style lang="scss" scoped>
.cover {
  height: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e4f1ff;
  border-radius: 20px;

  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    border-radius: 20px;
  }
}
</style>
