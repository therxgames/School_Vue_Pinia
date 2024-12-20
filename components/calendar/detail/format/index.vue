<template>
  <div class="format">
    <div class="d-flex align-items-start row">
      <div class="col-6" v-if="holdForms">
        <hold-forms :hold-forms="holdForms" />
      </div>

      <div class="col-6" v-if="participationTypes">
        <participation-types :participation-types="participationTypes" />
      </div>
    </div>
  </div>
</template>
  
<script setup>
import HoldForms from "./hold-forms/index.vue";
import ParticipationTypes from "./participation-types/index.vue";

const props = defineProps({
  holdForms: {
    type: Array,
    required: true
  },
  participationTypes: {
    type: Array,
    required: true
  },
});
</script>
  
<style lang="scss" scoped></style>
  