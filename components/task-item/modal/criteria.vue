<template>
  <div
    ref="modal"
    class="modal modal-lg fade task-modal-criteria">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Критерии оценивания
          </h5>

          <div
            class="modal-title-close"
            data-bs-dismiss="modal"
            aria-label="Close">
            <svg-icon name="cross"/>
          </div>
        </div>
        <div class="modal-body">
          <div
            v-if="typeof content === 'string'"
            class="task-modal-criteria-content"
            v-html="content"/>

          <task-item-free-answer-criteria
            v-else
            :content="content"
            :answer="answer"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  const modal = ref(null);
  const content = ref(null);
  const answer = ref(null);
  let modalInst = null;

  onMounted(() => {
    const $bootstrap = inject('$bootstrap');
    modalInst = new $bootstrap.Modal(modal.value);
  });
  onBeforeUnmount(() => {
    if (modalInst) {
      modalInst.hide();
    }
  });

  const show = async (_content, _answer) => {
    content.value = _content;
    answer.value = _answer;
    await nextTick();
    modalInst.show();
  };

  const hide = () => {
    modalInst.hide();
  };

  defineExpose({show, hide});
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .task-modal-criteria {
    &-content {
      table {
        & > :not(caption) > * > * {
          border-width: 1px;
        }

        tbody {
          border-width: 1px;
        }

        td {
          padding: 1rem;
        }

        p {
          margin-bottom: 0;
        }

        br[clear='all'] {
          display: none;
        }
      }
    }
  }

  .task-modal-criteria-content {
    overflow-x: auto;
  }
</style>
