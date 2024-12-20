<template>
  <div class="commonStatScoring">
    <hr>
    <div>Задания, требующие проставления оценки</div>

    <ul class="commonStatScoring-list list-unstyled">
      <li
        v-for="(info, index) in freeAnswerTasks"
        :key="index"
        class="commonStatScoring-list-item">
        <a
          href="#"
          class="commonStatScoring-list-item-num"
          @click.prevent="emit('score-task', info.num)">{{ info.num }}</a> {{ info.score }}/{{ info.maxScore }}
      </li>
    </ul>

    <div
      class="btn btn-primary"
      @click="emit('save')">
      Сохранить
    </div>
<!--Это -- кнопка отправки задания на проверку. Раскомментировать для отображения кнопки.
    <div
      v-if="showSaveAndSendBtn"
      class="commonStatScoring-saveAndSendBtn btn btn-simple"
      @click="emit('save-and-send')">
      Сохранить и отправить
    </div>
-->
  </div>
</template>

<script setup>
  const props = defineProps({
    freeAnswerTasks: {type: Object, required: true},
    showSaveAndSendBtn: {type: Boolean, required: true}
  });

  const emit = defineEmits(['score-task', 'save', 'save-and-send']);
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .commonStatScoring {
    margin-top: 3rem;
  }

  .commonStatScoring-list {
    display: flex;
    padding: 0.5rem;
    flex-wrap: wrap;
    flex-direction: column;
    max-height: 300px;
  }

  .commonStatScoring-list-item {
    display: flex;
    margin-bottom: 0.25rem;
  }

  .commonStatScoring-list-item-num {
    margin-right: 0.75rem;
  }

  .commonStatScoring-saveAndSendBtn {
    width: 100%;
    margin-top: 0.5rem;
  }
</style>
