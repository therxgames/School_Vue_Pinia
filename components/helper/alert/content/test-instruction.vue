<template>
  <div class="ac-test-instruction">
    <div
      ref="scroller"
      class="ac-test-instruction-content scroller-default">
      <div
        v-if="instructionContent"
        v-html="instructionContent"/>
      <div
        class="ac-test-instruction-content-empty"
        v-else>
        Инструкция отсутствует
      </div>
    </div>
    <div
      v-if="props.data.showControl"
      class="mt-3 ac-test-instruction-control-about">
      <h5 class="mb-3">
        Что такое контрольный режим прохождения?
      </h5>
      <div>В контрольном режиме:</div>
      <ul class="ac-test-instruction-control-about-ul">
        <li class="ac-test-instruction-control-about-li">
          Время теста ограничено;
        </li>
        <li class="ac-test-instruction-control-about-li">
          Поставить на паузу нельзя;
        </li>
        <li class="ac-test-instruction-control-about-li">
          По истечении времени тест завершится автоматически
        </li>
      </ul>
      <input-checkbox
        value="on"
        label="Контрольный режим"
        v-model:checked="controlSetter"/>
    </div>
    <div class="ac-test-instruction-footer">
      <div
        v-if="props.data.showControl"
        @click="goStart"
        class="btn btn-primary">
        Ясно, начать тест
      </div>
      <div
        v-else
        @click="props.context.hide"
        class="btn btn-primary">
        Ясно, закрыть
      </div>
    </div>
  </div>
</template>

<script setup>
  import SmoothScrollbar from 'smooth-scrollbar';

  const props = defineProps(alertContentProps());
  const emit = defineEmits(['event']);
  const scroller = ref(null);
  const scrollerStatus = ref({offset: {x: 0, y: 0}, limit: {x: 0, y: 0}});
  const control = ref(props.data.control);
  const instructionContent = ref(props.data.instruction_wtext);
  const controlSetter = computed( {
    get: () => control.value,
    set: ({checked}) => control.value = checked
  });
  let scrollerInst = null;

  onMounted(async () => {
    createScroll();
    if (!instructionContent.value) {
      await fetch();
    }
  });
  onUnmounted(() => {
    control.value = false;
    destroyScroll();
  });

  const fetch = async () => {
    props.context.setProgress(true);
    try {
      const response = await useApi(`/api/test/${props.data.id}`);
      if (response.data.done) {
        instructionContent.value = response.data.test?.instruction_wtext || '';
      }
    } catch (e) {
      console.error(e.message);
    }
    props.context.setProgress(false, 150);
  };
  const createScroll = () => {
    scrollerInst = SmoothScrollbar.init(scroller.value, {alwaysShowTracks: true});
    scrollerInst.addListener((status) => Object.assign(scrollerStatus.value, status));
  };
  const destroyScroll = () => {
    if (scrollerInst) {
      SmoothScrollbar.destroy(scroller.value);
    }
  };
  const goStart = () => {
    emit('event', {
      type: 'onStart',
      data: {
        ...props.data,
        control: control.value
      }
    });
  };
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .ac-test-instruction {
    &-content {
      margin-right: -1rem;
      padding-right: 2rem;

      &-empty {
        color: $color-dark;
      }
    }

    &-footer {
      margin-top: 2rem;
      margin-bottom: -1rem;
    }

    &-control-about {
      &-ul {
        padding-left: 1.7rem;
      }
    }
  }
</style>
