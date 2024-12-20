<template>
  <template v-for="theme in themes">
    <div
      class="table-row py-4 table-row-header border-bottom"
      :class="{'ps-4': !root}">
      <div class="table-cell px-2 d-flex justify-content-center align-items-center">
        <svg-icon
          v-if="theme.id"
          name="tag"/>
        <span
          class="hash-sign"
          :data-title="theme.id ? 'тема' : ''">{{ theme.id }}</span>
      </div>
      <div class="table-cell pe-3">
        {{ theme.name ? theme.name : 'Неизвестная тема' }}
      </div>
    </div>
    <div
      v-for="task in theme.tasks"
      :key="task.id"
      class="py-3 table-row"
      :class="{'ps-4': !root}">
      <div class="table-cell d-flex justify-content-center align-items-center">
        <svg-icon
          v-if="task.parent_id"
          name="tag"/>
        <span
          class="hash-sign"
          :data-title="task.parent_id ? 'задание' :''">{{ task.parent_id }}</span>
      </div>
      <div
        class="table-cell pe-3"
        :style="{opacity: task.status === 'skipped' ? 0.3 : 1}">
        <nuxt-link :to="`/task/${task.id}`">
          <span v-html="task.name"/>
        </nuxt-link>
      </div>
      <div
        class="table-cell pe-3 text-end"
        :class="{errored: task.status === 'errored'}">
        {{ task.info }}
      </div>
      <div
        v-if="task.status === 'uploaded'"
        class="table-cell pe-4 text-end"
        @click="moreInfo(task.id)">
        QTI
      </div>
    </div>
  </template>
</template>

<script setup>
  import xmlFormatter from 'xml-formatter';

  const props = defineProps({
    themes: {
      type: Array,
      default: () => []
    },
    root: {
      type: Boolean,
      default: false
    }
  });

  const moreInfo = async (id) => {
    try {
      const response = await useApi(`/api/task/${id}/qti`, {
        method: 'GET'
      });

      if (response.data.done) {
        const qti = xmlFormatter(response.data.qti)
          .replace(/src=(['"])\/tasks_images\//g, `src=$1${useRuntimeConfig().public.API_URL}/tasks_images/`);

        eventBus.emit('alert:show', {
          title: 'QTI',
          contentRaw: `${qti}`,
          contentPre: true,
          maxWidth: '800px',
          maxContentHeight: 'calc(100vh - 240px)',
          buttons: [
            {
              title: 'Скопировать',
              async click(modal, context) {
                const res = await copyToClipboard(qti);
                if (res) {
                  eventBus.emit('toast:show', {
                    text: 'QTI скопирован успешно'
                  });
                }
                context.hide();
              }
            },
            {
              title: 'Закрыть',
              class: 'btn-outline-primary',
              click(modal, context) {
                context.hide();
              }
            }
          ]
        });
      }
    } catch (e) {
      console.log('Ошибка загрузки', e);
      eventBus.emit('alert:show', {
        title: 'Ошибка загрузки',
        content: e.response?.data.error,
        maxWidth: '800px',
        hideAllButtons: true
      });
    }
  };
</script>


<style lang="scss">
  @import '~/assets/scss/theme';

  .uploads-file {
    .table-cell {
      &.errored {
        color: $color-red-normal !important;
      }

      .hash-sign {
        position: relative;

        &::before {
          content: attr(data-title);
          position: absolute;
          display: block;
          color: #7f838a;
          top: -15px;
          left: -13px;
          font-size: 12px;
          font-weight: 300;
          opacity: 0.5;
        }
      }

      a {
        color: $color-black;

        :hover {
          color: $color-blue-normal;
        }
      }
    }
  }
</style>

