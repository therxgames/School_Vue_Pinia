<template>
  <div class="my-4 uploads-file-panels">
    <div
      v-for="panel in data"
      class="d-flex flex-column">
      <h4 class="mb-3">
        {{ panel.title }}
      </h4>
      <div class="uploads-file-panel flex-grow-1">
        <div v-for="item in panel.items">
          <span
            v-if="item.value !== ''"
            class="text-muted">{{ item.name }}</span> <span class="upload-value">
              {{ item.value }}
              <span
                class="d-inline-flex align-items-center"
                v-if="item.value2">(<svg-icon
                  name="tag"
                  style="font-size: 0.5em;"/>{{ item.value2 }})</span>
            </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    data: {
      type: Array,
      default: () => []
    }
  });
</script>

<style lang="scss">
  @import '~/assets/scss/theme';

  .uploads-file-panels {
    display: flex;

    & > div {
      flex-basis: 50%;

      .uploads-file-panel {
        background-color: $color-black-10;
        border-radius: 8px;
        padding: 17px;

        .upload-value {
          font-weight: 500;
        }
      }

      &:first-child {
        margin-right: 2em;
      }
    }
  }
</style>
