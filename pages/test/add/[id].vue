<template>
  <nuxt-layout name="default">
    <div class="page-testAdd page-default content-container">
      <common-breadcrumbs
        :items="[{to: '/training', title: 'Подготовка'}]"/>

      <common-columns>
        <div>
          <test-add-top
            :test="store.test"
            @show-instruction="showInstruction"/>

          <common-collapse
            control-label="Темы"
            class="pt-5">
            <test-add-about :themes="store.themes"/>
          </common-collapse>

          <div
            @click="attemptToAdd"
            :class="{'disabled': progress}"
            class="page-testAdd-addBtn btn btn-primary btn-icon mt-5">
            <svg-icon name="plus-filled"/>
            <span>Добавить к моим тестам</span>
          </div>
        </div>

        <div>
          <test-add-stat :tasks-count="store.tasksCount"/>
        </div>
      </common-columns>
    </div>
  </nuxt-layout>
</template>

<script setup>
  import useTestViewStore from '~/stores/test-view';

  const store = useTestViewStore();
  const router = useRouter();
  const route = useRoute();
  const progress = ref(false);

  definePageMeta({
    middleware: ['auth', 'test-exists', 'test-can-be-added']
  });

  watch(
    () => progress.value,
    (value) => {
      value
        ? eventBus.emit('loader:show')
        : eventBus.emit('loader:hide');
    }
  );

  const attemptToAdd = async () => {
    progress.value = true;
    const res = await toggleCollection(store.test.id, true);
    progress.value = false;

    if (res) {
      router.replace({
        name: 'training',
        query: {category: 'usertest'}
      });
    }
  };

  const showInstruction = () => {
    eventBus.emit('alert:show', {
      title: `Инструкция к тесту «${store.test.name}»`,
      contentComponent: 'helperAlertContentTestInstruction',
      maxWidth: '660px',
      hideAllButtons: true,
      additionalData: {...store.test}
    });
  };

  onBeforeUnmount(() => {
    if (router.currentRoute.value.name !== 'test-add-id') {
      store.$reset();
    }
  });

  await useAsyncData(`test-view-${route.params.id}`, () => Promise.all([
    store.fetch(route.params.id)
  ]));

  useHead({
    ...pageTitle(store.test.name)
  });
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .page-testAdd {
    padding-top: 1.125rem;
  }

  .page-testAdd-addBtn {
    display: inline-flex;

    --bs-btn-padding-y: 1rem;
    --bs-btn-padding-x: 3rem;
  }

  .page-testAdd-loader {
    --loader-bg: #ffffffdb;
  }
</style>
