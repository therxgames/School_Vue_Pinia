<template>
  <div
    class="p-4 user-select-none subject-card"
    :class="{'text-muted': !card.is_favorite}"
    @click="onClick(false)"
    @click.middle="onClick(true)">
    <div
      class="subject-card-icon p-2">
      <svg-icon
        name="shape"
        :fill="card.colors.icon"/>
    </div>
    <div class="lh-1 d-flex flex-column justify-content-between flex-fill">
      <div class="d-flex subject-card-name">{{ card.name }}</div>
      <div class="d-flex">
        <div
          class="subject-card-progress"
          :style="`color: ${getColor(progress)}`">
          {{ progress }}%</div>
      </div>
      <div class="subject-card-details">
        {{ card.tasks_count }} задани{{ declension(card.tasks_count, ['е', 'я', 'й']) }} &bull; {{ topics }} тем{{ declension(topics, ['а', 'ы', '']) }}
      </div>
    </div>
    <button
      class="btn border-0 subject-fav"
      :disabled="isFetching"
      @click.stop="changeSubjectStatus"
      v-tooltip="{ title: card.is_favorite ? 'Убрать из избранных' : 'Добавить в избранные' }">
      <svg-icon :name="card.is_favorite ? 'flag-active' : 'flag-default'"/>
    </button>
  </div>
</template>

<script setup>
  import useResultsStore from '~/stores/results';
  import _debounce from 'lodash.debounce';
  const emit = defineEmits(['goToSubject', 'changeSubjectStatus']);

  const props = defineProps({
    card: {
      type: Object,
      required: true
    },
    fullProgress: {
      type: Boolean,
      required: true
    }
  });
  const store = useResultsStore();
  const isFetching = ref(false);
  watch(() => store.isFetching, _debounce(() => { isFetching.value = store.isFetching }, 300));
  const progress = computed(() => props.fullProgress ? props.card.masteringExt : props.card.mastering);
  const topics = computed(() => props.fullProgress ? props.card.topics_countExt : props.card.topics_count);
  function getIcon() {
    return `subject-${props.card.idName}`;
  }
  function onClick(middle = false) {
    if (!isFetching.value || middle) {
      emit('goToSubject', props.card.id, middle);
    }
  }
  function changeSubjectStatus() {
    emit('changeSubjectStatus', {
      num: props.card.id,
      value: !props.card.is_favorite
    });
  }
  function getColor(num) {
    if (props.card.is_favorite && (props.card.correctness || props.card.wrongness)) {
      if (num > 80) return '#3db45a';
      if (num > 55) return '#ffb40a';
      return '#f87342';
    }
    if (!props.card.is_favorite) {
      return '#7f838a';
    }
  }
</script>

<style scoped lang="scss">
  .subject-card-icon {
    min-width: 4rem;
    height: 4rem;
    margin-right: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16px;

    .svg-icon {
      width: 100%;
      height: 100%;
    }
  }

  .subject-card {
    transition: all 0.4s;
    border-radius: 16px;
    display: flex;
    background: #fff;

    &:hover {
      cursor: pointer;
      box-shadow: 0 16px 32px rgba(125, 148, 193, 0.24);
      .subject-card-name {
        color: #0576ff;
      }
    }
  }

  .subject-fav {
    display: block;
    min-width: 24px;
    height: 24px;
    padding: 4px;

    .svg-icon {
      width: 100%;
      height: 100%;
    }
  }
  .subject-card-switch {
    border-radius: 0.5rem;
    height: 16px;
    width: 1.5rem;
    padding: 2px;
    margin-left: 0.5rem;
    background: #7f838a;

    label {
      position: relative;
      cursor: pointer;
      height: 100%;
      width: 100%;
      border-radius: 0.5rem;
    }

    input {
      width: 0;
      height: 0;
      cursor: pointer;

      &::before {
        content: '';
        position: absolute;
        display: block;
        top: 0;
        right: 0;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #fff;
        transition: all 0.6s linear;
      }
    }
    input:checked::before {
      left: 0;
    }
  }
  .subject-card-details {
    font-size: 14px;
    color: #7f838a;
  }
  .subject-card-progress {
    width: 2.5rem;
  }
  .subject-card-info {
    height: 1rem;
    margin-left: 0.5rem;
    .svg-icon {
      width: 100%;
      height: 100%;
    }
  }
</style>
