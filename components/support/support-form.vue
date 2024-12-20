<template>
  <form class="card support-form">
    <form-subject/>
    <form-testnumber/>
    <form-message/>
    <file-input/>
    <div class="pb-2">
      <file-preview
        v-for="file in files"
        :key="file.name"
        :file="file"/>
    </div>
    <form-callyou v-if="!isAuth"/>
    <form-email/>
    <div
      v-if="isAuth"
      class="support-sender">
      Отправитель&nbsp;
      <svg-icon
        v-tooltip="{ title: user.name }"
        name="info"
        class="support-sender-info-icon"/>
    </div>
    <div v-else>
      <form-captcha/>
      <form-agreement/>
    </div>
    <button
      type="button"
      class="btn btn-primary my-3 support-form-btn w-50 border-0"
      :disabled="sending"
      @click="submitForm">
      Отправить
    </button>
  </form>
</template>

<script>
  import useSupportStore from '~/stores/support';
  import FormSubject from '~/components/support/form-subject.vue';
  import FormTestnumber from '~/components/support/form-testnumber.vue';
  import FormMessage from '~/components/support/form-message.vue';
  import FileInput from '~/components/support/file-input.vue';
  import FilePreview from '~/components/support/file-preview.vue';
  import FormCallyou from '~/components/support/form-callyou.vue';
  import FormEmail from '~/components/support/form-email.vue';
  import FormCaptcha from '~/components/support/form-captcha.vue';
  import FormAgreement from '~/components/support/form-agreement.vue';

  export default {
    components: {
      FormSubject,
      FormTestnumber,
      FormMessage,
      FileInput,
      FilePreview,
      FormCallyou,
      FormEmail,
      FormCaptcha,
      FormAgreement
    },
    props: {
      isAuth: {
        type: Boolean,
        default: false
      },
      user: {
        type: Object
      }
    },
    setup() {
      const store = useSupportStore();
      const sending = computed(() => store.sending);
      const files = computed(() => store.previewFiles);

      function submitForm() {
        store.checkFields = false;
        if (store.isValid) {
          store.checkFields = false;
          store.sendForm();
        } else {
          store.checkFields = true;
        }
      }

      return {
        sending,
        files,
        submitForm
      };
    }
  };
</script>
