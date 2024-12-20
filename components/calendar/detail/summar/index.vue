<template>
  <dl class="overflow-hidden">
    <div v-if="!!fields && fields.length > 0" class="d-flex">
      <dt class="summar-type mr-2">Предметная область:</dt>
      <dd class="summar-value mb-0">{{ fields.map((field) => field.name).join(', ') }}</dd>
    </div>

    <div v-if="!!eventLevel && eventLevel.code !== null" class="d-flex">
      <dt class="summar-type mr-2">Уровень события:</dt>
      <dd class="summar-value mb-0">{{ eventLevel?.name }}</dd>
    </div>

    <div v-if="!!region && region.code !== null" class="d-flex">
      <dt class="summar-type mr-2">Регион:</dt>
      <dd class="summar-value mb-0">{{ region?.name }}</dd>
    </div>
  </dl>
</template>
  
<script setup>
const props = defineProps({
  fields: {
    type: Array,
  },
  eventLevel: {
    type: Object,
  },
  region: {
    type: Object,
  },
});
</script>
  
<style lang="scss" scoped>
.summar-type {
  color: rgb(147, 151, 158);
  margin-right: 0.5rem;
  font-size: 16px;
  font-weight: 400
}
</style>
  