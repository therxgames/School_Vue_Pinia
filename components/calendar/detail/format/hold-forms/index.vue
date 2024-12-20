<template>
  <icon-list class="hold-forms">
    <icon-list-item v-for="{ name, code } in holdForms" :icon-name="getHoldFormIcon(code).name"
      :icon-fill="getHoldFormIcon(code).fill">
      <div>{{ name }}</div>

      <div v-if="getHoldFormDescription(code)" class="hold-forms-item-description">{{ getHoldFormDescription(code) }}
      </div>
    </icon-list-item>
  </icon-list>
</template>
  
<script setup>
import IconList from "../../icon-list/index.vue";
import IconListItem from "../../icon-list/icon-list-item/index.vue";

const props = defineProps({
  holdForms: {
    type: Array,
    required: true
  },
});

const getHoldFormIcon = (code) => {
  switch (code) {
    default:
      return {
        name: 'user-list'
      };
  }
};

const getHoldFormDescription = (code) => {
  switch (code) {
    case 'full-time':
      return 'Для участия нужно прийти в заранее известное место проведения';
    case 'remote':
      return 'Можно участвовать не выходя из дома, достаточно иметь компьютер с доступом в интернет';
    case 'part-time':
      return 'Нужно пройти дистанционный отбор, чтобы участвовать в очном финале';
    default:
      return undefined;
  }
};
</script>

<style lang="scss" scoped>
.hold-forms {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &-item-description {
    color: rgb(147, 151, 158);
  }
}
</style>
