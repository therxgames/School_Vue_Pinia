<template>
  <nuxt-layout name="default">
    <div class="page-default content-container">
      <div>
        <h1 class="mb-4">
          Управление материалами
        </h1>
      </div>
      <input-radio-group
        type="button"
        :list="controls"
        v-model:value="controlId"
        class="mb-5 input-radio-group"
        theme="gaped"
      />
      <NuxtPage keepalive/>
    </div>
  </nuxt-layout>
</template>

<script setup>
import useUserStore from '~/stores/user';

const userStore = useUserStore();
const router = useRouter();


const controls = computed(() => {
  const res = [
    {
      id: '/admin/uploads',
      name: 'Управление контентом'
    },
    {
      id: '/admin/kim',
      name: 'КИМ'
    },
    {
      id: '/admin/cce',
      name: 'КЭС-ГИА'
    },
    {
      id: '/admin/metadata',
      name: 'Инструкции'
    }
  ];

  if (userStore.userIsAdmin) {
    res.push(
      {
        id: '/admin/manuals',
        name: 'Управление справочниками'
      },
      {
        id: '/admin/support',
        name: 'Поддержка'
      },
      {
        id: '/admin/users',
        name: 'Управление пользователями'
      },
      {
        id: '/admin/logs',
        name: 'Лог событий'
      },
      {
        id: '/admin/achievements',
        name: 'Награды'
      }
    );
  }

  return res;
});

const controlId = ref(null);

const control = computed(() => {
  const fullPath = useRoute().fullPath;
  const res = controls.value.find((item) => fullPath.startsWith(item.id));
  if (res) return res;

  return null;
});

watch(control, (val) => {
  if (val) controlId.value = val.id;
});

watch(() => userStore.currentRole, (val) => {
  if (!(userStore.userIsAdmin || userStore.userIsCOSUser)) router.replace('/');
  if (userStore.userIsCOSUser) {
    router.replace(controls.value[0].id);
    controlId.value = controls.value[0].id;
  }
});

useHead({
  ...pageTitle('Администрирование')
});

definePageMeta({
  middleware: ['auth', 'admin-or-cosuser']
});

watch(controlId, (val, valOld) => {
  if (!useRoute().fullPath.startsWith(controlId.value)) {
    if (valOld) router.push({path: val});
  }
});

onMounted(() => {
  if (useRoute().fullPath === '/admin') {
    router.replace(controls.value[0].id);
    controlId.value = controls.value[0].id;
  } else if (control && control.value) controlId.value = control.value.id;
});

router.beforeEach((to, from) => {
  return !(to.name === 'admin' && from.matched.some((route) => route.name === 'admin'));
});
</script>

<style lang="scss">
@import '/assets/scss/theme';

.input-radio-group {
  & > div {
    display: flex;
    flex-wrap: wrap;
  }
}

.admin-link {
  &:hover {
    cursor: pointer;
    transition: 0.2s color;
    color: $color-blue-normal !important;
  }
}
</style>
