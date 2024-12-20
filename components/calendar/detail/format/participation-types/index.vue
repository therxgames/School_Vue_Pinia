<template>
  <icon-list class="part-types">
    <icon-list-item v-for="{ name, code } in participationTypes" :icon-name="getParticipationTypeIcon(code).name"
      :icon-fill="getParticipationTypeIcon(code).fill">
      <div>{{ name }}</div>

      <div v-if="getParticipationTypeDescription(code)" class="part-types-item-description">
        {{ getParticipationTypeDescription(code) }}
      </div>
    </icon-list-item>
  </icon-list>
</template>
  
<script setup>
import IconList from "../../icon-list/index.vue";
import IconListItem from "../../icon-list/icon-list-item/index.vue";

const props = defineProps({
  participationTypes: {
    type: Array,
    required: true
  },
});

const getParticipationTypeIcon = (code) => {
  switch (code) {
    case 'personal':
      return {
        name: 'user',
        fill: "#FFF"
      };
    default:
      return {
        name: 'user-list',
      };
  }
};

const getParticipationTypeDescription = (code) => {
  switch (code) {
    case 'command':
      return 'Участники выполняют задания вместе и борются за общий результат';
    case 'personal':
      return 'Участник самостоятельно выполняет задания';
    case 'personal-command':
      return 'Фиксируются результаты, показанные командой в целом и каждым участником в отдельности';
    default:
      return null;
  }
};
</script>

<style lang="scss" scoped>
.part-types-item-description {
  color: rgb(147, 151, 158);
}
</style>
