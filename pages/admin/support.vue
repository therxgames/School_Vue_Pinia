<template>
  <div class="pb-5 mb-5">
    <div class="my-4 d-flex align-items-center">
      <h4>Параметры обратной связи</h4>
    </div>
    <div class="d-flex w-100 justify-content-between">
      <div style="width: 49%;">
        <support-email/>
      </div>
      <div style="width: 49%;">
        <support-subjects/>
      </div>
    </div>
  </div>
</template>

<script>
  import useAdminSupportStore from '~/stores/admin-support';
  import SupportEmail from '~/components/admin/support/email.vue';
  import SupportSubjects from '~/components/admin/support/subjects.vue';

  export default {
    components: {
      SupportEmail,
      SupportSubjects
    },
    setup() {
      const store = useAdminSupportStore();
      const router = useRouter();

      onMounted(() => {
        store.getEmail();
        store.getSubjects();
      });

      onBeforeUnmount(() => {
        if (router.currentRoute.value.name !== 'admin-support') {
          store.$reset();
        }
      });

      return {};
    }
  };
</script>
