<template>
  <div class="mt-4 uploads-file">
    <common-breadcrumbs
      @click="store.setFile(null)"
      :items="[{to: '/admin/uploads', title: 'Назад'}]"/>

    <admin-uploads-file-panels
      :data="panelsData"/>

    <h4 class="mb-3">
      Лог загрузки
    </h4>

    <div
      v-if="items.length"
      class="table mb-4 border rounded">
      <admin-uploads-file-themes
        v-if="'tasks' in items[0]"
        :themes="items"
        :root="true"/>
      <template v-else>
        <template v-for="item in items">
          <div class="table-row py-4 table-row-header table-row-header-2 border-bottom">
            <div
              v-if="item.id"
              class="table-cell px-2 d-flex justify-content-center align-items-center"
              style="line-height: 0.8em;">
              <svg-icon name="tag"/>{{ item.id }}
            </div>
            <div
              class="table-cell pe-3"
              v-html="typeTest(item.name)"/>
            <div
              v-if="item.info"
              class="test-info">
              {{ item.info }}
            </div>
          </div>
          <admin-uploads-file-themes
            :themes="item.themes"/>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup>
  import useAdminFilesStore from '~/stores/admin-files';

  const store = useAdminFilesStore();

  const emit = defineEmits(['hide-file']);
  const file_id = useRoute().params.id;

  const uploadData = ref(null);

  const fetchFile = async () => {
    try {
      const response = await useApi(`/api/upload/${file_id}`, {
        method: 'GET'
      });
      if (response.data.done) {
        uploadData.value = response.data;
      }
    } catch (e) {
      console.error('Ошибка получения списка загруженных файлов', e);
    }
  };

  const typeTest = (name) => {
    let suffix = '';
    if (/ОГЭ/.test(name)) suffix += ' <span style="color: #7F838A">(Демо-вариант)</span>';
    if (/ВПР/.test(name)) suffix += ' <span style="color: #7F838A">(Тест)</span>';
    return name + suffix;
  };

  const panelsData = computed(() => {
    if (uploadData.value) {
      const {file_name, user_name, user_id, created_at, file_size, uploaded, skipped, errored} = uploadData.value.upload;
      try {
        return [
          {
            title: 'Информация о файле',
            items: [
              {
                name: 'Название архива:',
                value: file_name
              },
              {
                name: 'Загрузил:',
                value: user_name,
                value2: user_id
              },
              {
                name: 'Дата загрузки:',
                value: formatDate(created_at, 'd MMMM yyyy')
              },
              {
                name: 'Вес архива:',
                value: fileSize(file_size)
              }
            ]
          },
          {
            title: 'Отчет о загрузке',
            items: [
              {
                name: 'Успешно импортировалось:',
                value: uploaded
              },
              {
                name: 'Пропущено (загружено ранее):',
                value: skipped
              },
              {
                name: 'Ошибок загрузки:',
                value: errored
              }
            ]
          }
        ];
      } catch (e) {
        console.log('Ошибка парсинга лога', e);
      }
    }

    return null;
  });

  await fetchFile();

  const getThemes = (tasks) => tasks.reduce((acc, item) => {
    const theme = acc.find((i) => i.id === item.theme_id);
    const task = {
      id: item.id,
      name: item.name,
      info: item.info ? item.info : item.status === 'skipped' ? '(пропущено)':'',
      status: item.status,
      parent_id: item.parent_id
    };
    if (!theme) {
      acc.push({
        id: item.theme_id,
        name: item.theme_name,
        tasks: [task]
      });
    } else {
      theme.tasks.push(task);
    }
    return acc;
  }, []);

  const items = computed(() => {
    return uploadData.value.tests.map((test) => ({
      id: test.id,
      name: test.name,
      info: test.info,
      themes: getThemes(test.tasks)
    }));
  });
</script>

<style lang="scss">
  @import '~/assets/scss/theme';

  .uploads-file {
    .table > :not(caption) > * > * {
      padding: 0 !important;
    }

    .table {
      overflow: hidden;

      .table-row {
        color: $color-black;
        display: flex;
        align-items: center;

        &.table-row-header {
          background-color: $color-black-10;
          justify-content: space-between;

          .test-info {
            color: #aaa;
            margin-right: 24px;
          }

          .table-cell {
            font-weight: 500;

            &:nth-child(1) {
              flex-basis: 8%;
              flex-shrink: 0;
              text-align: center;
              color: $color-dark;
              font-size: 14px;
              font-weight: 400;
            }

            &:nth-child(2) {
              flex-grow: 1;
              white-space: break-spaces;
              word-break: break-word;
            }
          }

          &.table-row-header-2 {
            background-color: #dcdee0;

            .table-cell {
              font-size: 20px;
              font-weight: 600;
            }
          }
        }
      }

      .table-row:not(.table-row-header) {
        &:not(:last-child) {
          border-bottom: 1px solid $color-black-10;
        }

        .table-cell {
          font-size: 14px;

          &:nth-child(1) {
            flex-basis: 8%;
            flex-shrink: 0;
            text-align: center;
            color: $color-dark;
          }

          &:nth-child(2) {
            flex-grow: 1;
            white-space: break-spaces;
            word-break: break-word;
            font-size: 16px;
          }

          &:nth-child(3) {
            color: $color-normal;
            flex-basis: 20%;
            flex-shrink: 0;
          }

          &:nth-child(4) {
            color: $color-blue-normal;
            flex-basis: 2em;
            flex-shrink: 0;
            cursor: pointer;
          }
        }
      }
    }

    .svg-icon-default {
      font-size: 0.5em;
      margin-right: 0.3em;
    }
  }

</style>
