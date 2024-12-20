<template>
  <div class="faq-section">
    <div class="container">
      <div class="faq-container">
        <h3 class="text-center mb-4 faq-container-title">Вопросы и ответы</h3>
        <div>
          <faq-item :data="item" v-for="item of data" :key="item.id" @toggle="changeOpened" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const data = reactive([
  {
    id: 1,
    opened: false,
    title: "Какие задания и демоварианты, размещены в сервисе",
    content:
      "Нет. Цифровой помощник ученик разработан для самостоятельной подготовки обучающихся. Ваши результаты строго конфиденциальны",
  },
  {
    id: 2,
    opened: false,
    title: "Обязательно ли регистрироваться",
    content:
      "Нет. Цифровой помощник ученик разработан для самостоятельной подготовки обучающихся. Ваши результаты строго конфиденциальны",
  },
  {
    id: 3,
    opened: false,
    title: "Повлияют ли результаты из помощника на оценки в школе",
    content:
      "Нет. Цифровой помощник ученик разработан для самостоятельной подготовки обучающихся. Ваши результаты строго конфиденциальны",
  },
]);

const changeOpened = (id) => {
  data.forEach(item => {
    item.opened = item.id === id ? !item.opened : false;
  });
};
</script>

<style lang="scss" scoped>
.faq-section {
  margin: 80px 0;
}

.faq-container {
  width: 978px;
  margin: auto;

  &-title {
    font-size: 32px;
  }
}
</style>
