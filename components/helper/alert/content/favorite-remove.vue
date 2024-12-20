<template>
  <div class="ac-favorite-remove">
    <span class="first-letter-upper d-inline-block">
      {{ contentTypeToName(props.data.content_type) }}
    </span>
    будет {{ props.data.content_type === 'test' ? 'удален' : 'удалено' }} из избранного, <b>продолжить?</b>
    <div class="mt-1">
      <input-checkbox
        label="Больше не спрашивать"
        v-model:checked="notShowAgainSetter"/>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps(alertContentProps());
  const notShowAgain = ref(false);
  const notShowAgainSetter = computed({
    get: () => notShowAgain.value,
    set: ({checked}) => notShowAgain.value = checked
  });

  watch(
    () => notShowAgain.value,
    (value) => setUserSetting('favorite.actions.remove.ask', !value)
  );
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .ac-favorite-remove {
    b {
      font-weight: 500;
    }
  }
</style>
