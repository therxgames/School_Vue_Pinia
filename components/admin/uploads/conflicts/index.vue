<template>
  <div class="mt-4 uploads-conflicts">
    <h4>Конфликты</h4>
    <p>Обнаружено 3 конфликта,</p>
    <div class="card text-dark bg-light">
      <div class="card-header">
        Конфликт в теме справочника
      </div>
      <div class="card-body">
        <p class="card-text">
          Описание текущего конфликта: ... бла-бла-бла (или Решено)
        </p>
        <a
          href="#"
          class="btn btn-primary">Выбрать тему из справочника</a>
        <a
          href="#"
          class="ms-2 btn btn-primary">Записать тему в справочник</a>
      </div>
    </div>

    <p>(кнопки перехода по выбору текущего конфликта, влево/вправо)</p>
    <p>Информер числа конфликтов</p>
    <p>
      <button
        @click="store.conflicts = null"
        class="btn btn-primary">
        Назад
      </button>
    </p>
  </div>
</template>

<script setup>
  import useAdminFilesStore from '~/stores/admin-files';

  const store = useAdminFilesStore();
</script>

