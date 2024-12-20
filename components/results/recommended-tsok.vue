<template>
  <transition name="transition-fade">
    <div
      v-if="target && items.length"
      class="mt-5 pt-3 results-recommended-tsok">
      <div class="mb-4 d-flex align-items-center justify-content-between">
        <h4>
          Рекомендуемые материалы
        </h4>
        <div v-tooltip="{ title: 'Материалы из Библиотеки цифрового образовательного контента ФГИС «Моя школа»' }">
          <svg-icon name="info" />
        </div>
      </div>
      <recomended-materials :items="items"/>
      <button
        v-if="showBtn"
        class="w-100 py-1 btn border mt-3"
        :disabled="disableBtn"
        @click="addItems">
        Показать еще
      </button>
    </div>
  </transition>
</template>

<script>
  import useResultsStore from '~/stores/results';

  export default {
    setup() {
      const store = useResultsStore();
      const target = computed(() => store.target.tsok);
      const items = computed(() => {
        const arr = store.target.tsok?.items || [];
        const list = arr.map((el) => {
          const item = el;
          const s = store.subjectByID[item.parent_subject_id];
          return {
            classes: store.grade,
            link: item.externalContentLink,
            subject: item.subject_name,
            subjectClass: s.idName,
            subjectLogo: `subject-${s.idName}`,
            title: item.name
          };
        });
        return list;
      });

      const disableBtn = ref(false);
      const showBtn = computed(() => store.target.tsok.total > items.value.length);
      const page = computed(() => store.target.tsok?.page || 1)

      async function addItems() {
        disableBtn.value = true;
        store.target.tsok.page++
        await store.fetchTsok(page.value);
        disableBtn.value = false;
      }

      watch(() => store.target.tsok, () => {
        if (!store.target.tsok) {
          store.fetchTsok(page.value);
        }
      });

      onMounted(() => {
        if (!store.target.tsok) {
          store.fetchTsok(page.value);
        }
      });

      return {
        target,
        items,
        addItems,
        disableBtn,
        showBtn
      };
    }
  };
</script>

<style lang="scss">
.results-recommended-tsok {
  h1 {
    display: none !important;
  }
}
</style>
