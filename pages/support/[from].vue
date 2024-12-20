<template>
  <nuxt-layout name="default">
    <div class="container">
      <div
        v-if="!submit"
        class="mx-auto mt-5 support">
        <h3 v-if="isAuth">
          Привет, {{ user.name }}! 👋
        </h3>
        <h3 v-else>
          Привет! 👋
        </h3>
        <p class="mb-4 mt-3">
          Что случилось?
        </p>
        <support-form
          :is-auth="isAuth"
          :user="user"/>
      </div>
      <div
        v-else
        class="mx-auto support-submit">
        <div class="support-done">
          <svg-icon
            name="done"/>
        </div>
        <h2 class="mt-3 mb-3">
          Спасибо, {{ senderName.value }}!
        </h2>
        <p class="mb-4">
          Мы отправим ответ на {{ answerEmail.value }} в ближайшее время
        </p>
        <a
          @click="$router.go(-1)"
          href="#"
          class="py-2">Вернуться назад</a>
      </div>
    </div>
  </nuxt-layout>
</template>

<script>
  import useSupportStore from '~/stores/support';
  import useUserStore from '~/stores/user';
  import SupportForm from '~/components/support/support-form.vue';

  export default {
    components: {
      SupportForm
    },
    setup() {
      const router = useRouter();
      const store = useSupportStore();
      const userStore = useUserStore();
      const isAuth = computed(() => userStore.logged);
      const user = computed(() => userStore.entity);
      const nameValue = () => isAuth.value ? user.value.name : '';
      const senderName = store.fields.find((f) => f.name === 'call_you');
      const from = router.currentRoute.value.params.from;
      if (from.includes('-')) {
        const arr = from.split('-');
        store.from.value = arr[0];
        store.from.id = +arr[1];
      } else {
        store.from.value = from;
      }
      const emailValue = () => isAuth.value ? user.value.email : '';
      const answerEmail = store.fields.find((f) => f.name === 'email');
      const captcha = store.fields.find((f) => f.name === 'captcha');
      const message = store.fields.find((f) => f.name === 'message');

      function initFields() {
        senderName.value = nameValue();
        senderName.isValid = senderName.value.length > 0;
        answerEmail.value = emailValue();
        answerEmail.isValid = answerEmail.value.length > 0;
        message.value = '';
        message.isValid = false;
        store.agreement = isAuth.value;
        store.checkFields = false;
        store.submit = false;
        captcha.value = '';
        captcha.isValid = isAuth.value;
      }

      watch(() => isAuth.value, () => {
        initFields();
      });

      useHead({
        ...pageTitle('Обращение в поддержку')
      });

      onMounted(async () => {
        await store.fetchSubjects();
        initFields();
      });

      onBeforeUnmount(() => {
        if (router.currentRoute.value.name !== 'support-from') {
          store.$reset();
        } else {
          store.files = [];
          store.filesEvent = [];
          store.from.id = null;
        }
      });

      const submit = computed(() => store.submit);

      return {
        isAuth,
        user,
        answerEmail,
        senderName,
        submit
      };
    }
  };
</script>

<style lang="scss">
  .support {
    max-width: 624px;

    &-form {
      padding: 1rem 1.5rem;
      border-radius: 1.5rem;

      &-label {
        font-weight: 500;
        margin-bottom: 0.5rem;
      }

      &-text {
        font-size: 14px;
        color: #7f838a;
      }

      &-btn {
        font-size: 18px;
        height: 56px;
        border-radius: 12px;
      }
    }

    &-textarea {
      position: relative;
      resize: none;
      line-height: 1.6rem;

      .support-form-text {
        position: absolute;
        bottom: -2.175rem;
        right: 0;
      }
    }

    &-file {
      input {
        position: absolute;
        width: 0;
        height: 0;
        opacity: 0;
      }

      label {
        width: max-content;
        display: flex;
        align-items: center;
        cursor: pointer;
      }
    }

    &-sender {
      display: flex;
      align-items: center;
      position: relative;
      color: #7f838a;

      &-info-icon {
        width: 1rem;
        height: 1rem;

        &:hover {
          color: #0576ff;
          cursor: pointer;
        }
      }
    }

    &-popup {
      position: absolute;
      color: #000;
      bottom: 3em;
      left: 5em;
      z-index: 99;
    }

    &-submit {
      text-align: center;
    }

    &-done {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 2rem;
      height: 2rem;
      margin: 110px auto 0;
      background: #3db45a;
      border-radius: 50%;
      padding: 0.5rem;
    }

    &-error {
      position: relative;
      border-color: #f85542 !important;

      &::after {
        position: absolute;
        bottom: -1.375rem;
        left: 0;
        line-height: 1;
        content: attr(data-err);
        font-size: 0.875rem;
        color: #f85542;
      }
    }
  }
</style>
