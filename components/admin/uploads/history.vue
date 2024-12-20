<template>
  <div
    v-if="currentList.length"
    class="uploads-history mb-5">
    <h5 class="mt-5">
      История загрузок
    </h5>
    <div class="my-5">
      <div
        v-for="item in currentList"
        :key="item.id"
        class="file">
        <div class="file-id text-muted ">
          <svg-icon
            name="tag"
            style="height: 1rem;width: 1rem;"/>
          <span>{{ item.id }}</span>
        </div>
        <div
          class="file-name text-cut admin-link"
          style="cursor: pointer;"
          @click="fileClick(item.id)">
          {{ item.file_name }}
        </div>
        <div class="file-username">
          {{ item.user_name }}
        </div>
        <div class="file-date text-muted">
          Загружено {{ formatDate(item.created_at, 'd MMMM yyyy') }} г.
        </div>
      </div>
    </div>
    <common-pagination
      :list="currentList"
      :pagination="pagination"
      :per-page="PER_PAGE"
      :per-page-add="PER_PAGE"
      @page="getHistory"
      @show-more="onShowMore"/>
  </div>
</template>

<script setup>
  import useAdminFilesStore from '~/stores/admin-files';
  import {steps} from './consts';

  const store = useAdminFilesStore();
  const router = useRouter();

  const item = ref(null);
  const currentPage = ref(1);
  const currentList = ref([]);
  const PER_PAGE = 5;

  const fetch = async (page = 1) => {
    try {
      const response = await useApi(`/api/uploads`, {
        method: 'GET',
        query: {
          page
        }
      });
      if (response.data.done) {
        item.value = response.data;
        currentPage.value = page;
      }
    } catch (e) {
      console.error('Ошибка получения списка загруженных файлов', e);
    }
  };

  const getHistory = async (page = 1) => {
    await fetch(page);
    currentList.value = item.value.uploads;
  };

  await getHistory();

  const pagination = computed(() => ({
    current: currentPage.value,
    last_page: item.value.last_page,
    per_page: PER_PAGE,
    total: item.value.total
  }));

  const onShowMore = async (n) => {
    await fetch(n);
    currentList.value = [...currentList.value, ...item.value.uploads];
  };

  watch(() => store.step, (val) => {
    if (val === steps.INIT) {
      getHistory();
    }
  });

  const fileClick = (id) => {
    router.push(`/admin/uploads/${id}`);
  };
</script>

<style lang="scss">
  .uploads-history {
    .file {
      display: flex;
      padding: 0.5em;
      margin: 0.75em;
      white-space: nowrap;

      &-id {
        flex-basis: 6%;
        display: flex;
        align-items: center;
      }

      &-name {
        flex-basis: 9%;
        flex-grow: 1;
        padding: 0 0.5em;
        display: flex;
        align-items: center;
      }

      &-username {
        flex-basis: 25%;
        padding: 0 0.5em;
        display: flex;
        align-items: center;
      }

      &-date {
        flex-basis: 250px;
        padding-left: 0.5em;
        display: flex;
        align-items: center;
      }
    }
  }
</style>
