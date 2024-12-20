import YmapPlugin from 'vue-yandex-maps';

const settings = {
  apiKey: '565027cb-40e8-42ab-bd94-c55046bd87df',
  lang: 'ru_RU',
  coordorder: 'latlong',
  version: '2.1'
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(YmapPlugin, settings)
});