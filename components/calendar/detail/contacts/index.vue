<template>
  <div class="contacts">
    <h2 class="mb-4">Контакты</h2>

    <div class="d-grid gap-4">
      <div v-if="organizer">{{ organizer.name }}</div>

      <button-url v-if="url" :url="url">
          Страница мероприятия
      </button-url>

      <icon-list v-if="organizer" class-name="d-grid gap-1">
          <icon-list-item iconName="phone" v-if="organizer.phone">
              <a :href="`tel:${organizer.phone}`" target="_blank" class="text-black">
                  {{ organizer.phone }}
              </a>
          </icon-list-item>

          <icon-list-item icon-name="globe" v-if="organizer.website">
              <a :href="organizer.website" target="_blank" class="text-black">
                  {{ getUrlHost(organizer.website) }}
              </a>
          </icon-list-item>

          <icon-list-item icon-name="mail" v-if="organizer.email">
              <a :href="`mailto:${organizer.email}`" target="_blank" class="text-black">
                  {{ organizer.email }}
              </a>
          </icon-list-item>
        </icon-list>
    </div>
  </div>
</template>

<script setup>
import ButtonUrl from "@/components/input/button-url.vue";
import IconList from "../icon-list/index.vue";
import IconListItem from "../icon-list/icon-list-item/index.vue";

const props = defineProps({
  organizer: {
    type: Object,
  },
  url: {
    type: String,
  },
});

const getUrlHost = (url) => {
  try {
      const { host } = new URL(url);

      return host;
  } catch {
      return url;
  }
};
</script>

<style lang="scss" scoped>
</style>
