<template>
  <div
    ref="modal"
    class="modal modal-lg fade common-modal-answers">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            История ответов
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
            v-for="(answer, index) in answers"
            :key="index"
            class="common-modal-answers-answer">
            <div class="common-modal-answers-time">
              {{ formatDate(answer.created_at) }}
            </div>

            <div class="common-modal-answers-caption">
              {{ answer.answer }}
            </div>

            <div class="common-modal-answers-result">
              <svg-icon
                :name="answer.result"
                class="common-modal-answers-result-icon"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import {parseISO, format} from 'date-fns';
  import ru from 'date-fns/locale/ru/index';

  const props = defineProps({
    answers: {
      type: Array,
      required: true
    }
  });

  const modal = ref(null);
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

  const formatDate = (date) => {
    return format(parseISO(date), 'd MMM yyyy, HH:mm', {locale: ru});
  };

  const show = () => modalInst.show();
  const hide = () => modalInst.hide();

  defineExpose({show, hide});
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .common-modal-answers-answer {
    display: flex;
    margin-bottom: 0.5rem;
    align-items: center;
  }

  .common-modal-answers-answer:last-child {
    margin-bottom: 0;
  }

  .common-modal-answers-time {
    white-space: nowrap;
    color: #7f838a;
    margin-right: 2rem;
  }

  .common-modal-answers-caption {
    margin-right: 2rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .common-modal-answers-result {
    margin-left: auto;
    margin-right: 4rem;
  }

  .common-modal-answers-result-icon {
    width: 1rem;
    height: 1rem;
  }
</style>
