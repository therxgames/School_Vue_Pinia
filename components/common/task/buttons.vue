<template>
  <div class="taskItem-buttons">
    <a
      v-if="!control"
      href="#"
      class="taskItem-btn"
      v-tooltip="solutionTpOpts"
      @click.prevent="toggleSolution()">
      <svg-icon
        v-if="showSolution"
        class="taskItem-btn-icon"
        name="eye-open"/>

      <svg-icon
        v-else
        class="taskItem-btn-icon"
        name="eye-closed"/>
    </a>

    <a
      href="#"
      v-if="userStore.logged && userStore.currentRole === 'student'"
      v-tooltip="favoriteTpOpts"
      class="taskItem-btn taskItem-favBtn"
      :class="{'taskItem-favBtn--inFav': task.is_favorite}"
      @click.prevent="$emit('toggle-favorite', getContext())">
      <svg-icon
        class="taskItem-btn-icon"
        name="star-filled"/>
    </a>

    <div
      href="#"
      class="taskItem-btn"
      data-bs-toggle="dropdown"
      data-bs-offset="0,5">
      <span
        class="taskItem-btn-tp"
        v-tooltip="{title: 'Ещё'}"/>
      <svg-icon
        class="taskItem-btn-icon"
        name="menu-dotted"/>
      <div class="dropdown-menu animation slide-in shadow">
        <div
          class="dropdown-item"
          @click="print">
          Распечатать задание
        </div>
        <div
          class="dropdown-item"
          @click="toSupport()">
          Сообщить о проблеме
        </div>
        <div
          v-if="userStore.userIsAdmin || userStore.userIsCOSUser"
          @click="toSettings()"
          class="dropdown-item">
          Свойства
        </div>
        <div
          v-if="task.versions_has_answers && userStore.logged && !control"
          @click="showHistory"
          class="dropdown-item">
          История ответов
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

  import useUserStore from '~/stores/user';


  const props = defineProps({
    task: {type: Object, required: false},
    getContext: {type: Function, required: false},
    showHistory: {type: Function, required: false},
    control: {type: Boolean, required: false},
    solutionTpOpts: {type: Object, required: false},
    toggleSolution: {type: Function, required: false},
    showSolution: {type: Boolean, required: false}
  });

  const userStore = useUserStore();

  const router = useRouter();

  const favoriteTpOpts = computed(() => {
    return {
      title: () => props.task.is_favorite ? 'Убрать из избранного' : 'Добавить в избранное'
    };
  });

  const print = () => {
    printTask(props.task.id, !props.control);
  };

  const toSupport = () => {
    router.push(`/support/task-${props.task.id}`);
  };

  const toSettings = () => {
    router.push(`/task-settings/${props.task.id}`);
  };

  const solutionTpOpts = computed(() => {
    return {
      title: () => props.showSolution.value ? 'Скрыть ответ' : 'Показать ответ'
    };
  });


</script>


<style lang="scss">
  .taskItem-buttons {
    margin-left: auto;
    display: flex;
  }

  .taskItem-btn {
    padding: 0.35rem 0.5rem;
    border-radius: 0.35rem;
    color: #7f838a;
    cursor: pointer;
    margin-left: 0.25rem;
    position: relative;

    &:hover {
      color: #000;
      background-color: #f2f5fa;
    }
  }

  .taskItem-btn-icon {
    width: 1.063rem;
    height: 1.063rem;
  }

  .taskItem-btn-tp {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }

</style>
