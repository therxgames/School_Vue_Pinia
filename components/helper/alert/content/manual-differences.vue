<template>
  <div class="manual-differences">
    <div
      v-for="block in blocks"
      class="container mb-4">
      <template v-if="block.data?.length">
        <h6 class="mb-4">
          {{ block.title }}
        </h6>

        <div class="item-head row">
          <div class="col-2">
            ID
          </div>
          <div class="col-8">
            Название элемента
          </div>
          <div class="col-2">
            Вес
          </div>
        </div>
        <hr>
        <div
          class="item d-flex row"
          v-for="item in block.data">
          <div class="col-2">
            {{ item.id }}
          </div>
          <div class="col-8">
            {{ item.name }}
          </div>
          <div class="col-2">
            {{ item.weight }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps(alertContentProps());
  const {currentVersion, data} = props.data;

  const blocks = [
    {
      action: 'added',
      title: data.added.length > 1 ? 'Добавлены элементы:' : 'Добавлен элемент:',
      data: data.added
    },
    {
      action: 'changed',
      title: data.changed.length > 1 ? 'Изменены элементы:' : 'Изменён элемент:',
      data: data.changed
    },
    {
      action: 'deleted',
      title: data.deleted.length > 1 ? 'Удалены элементы:' : 'Удалён элемент:',
      data: data.deleted
    }
  ];
</script>

<style lang="scss">
  .manual-differences {
    .item-head {
      color: #7f838a;
      font-size: 14px;
    }
  }
</style>
