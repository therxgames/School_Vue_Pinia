<template>
  <div ref="modal" class="modal modal-lg fade library-materials-modal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Библиотека материалов</h3>
          <div
            class="modal-title-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <svg-icon name="cross" />
          </div>
        </div>

        <div class="modal-body">
          <h5>БЦОК</h5>
          <p>
            Цифровой образовательный контент библиотеки Академии Минпросвещения
            РФ, созданный по всем предметам и темам школьной программы в
            соответствии с Федеральными государственными образовательными
            стандартами и универсальным тематическим классификатором.
          </p>
          <h5>ЭОР</h5>
          <p>
            Электронные образовательные ресурсовы, представленные в реестре
            Минпросвещения РФ и утвержденные для реализации образовательных
            программ.
          </p>
          <h5>Статьи</h5>
          <p>
            Электронные статьи от экспертов и талантливых педагогов, которые
            могут быть интересны всем участникам образовательного процесса.
          </p>
          <h5>Компетенции</h5>
          <p>
            Аналитические материалы по оценке и экспертизе профессиональных и
            личностных компетенций педагогов и учащихся. Цель материалов —
            повышения качества образования.
          </p>
          <h5>Проекты</h5>
          <p>
            Коллекция проектов, представленных организаторами олимпиад,
            конкурсов и фестивалей для широкой аудитории с целью повышения
            мотивации в достижении высоких результатов процесса обучения.<br />
            <a class="link d-flex align-items-center">Все проекты <svg-icon name="arrow-right" /></a>
          </p>
        </div>
        <div class="modal-footer">
          <button @click="hide" type="button" class="btn btn-outline-primary">
            Ясно, закрыть
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const modal = ref(null);
let modalInst = null;

onMounted(() => {
  const $bootstrap = inject("$bootstrap");
  modalInst = new $bootstrap.Modal(modal.value);
});

onBeforeUnmount(() => {
  if (modalInst) {
    modalInst.hide();
  }
});
const show = () => modalInst.show();
const hide = () => modalInst.hide();

defineExpose({ show, hide });
</script>

<style lang="scss" scoped>
.library-materials-modal {

  .link .svg-icon {
    width: 7px;
    margin-left: 8px;
    position: relative;
    top: 1px;
  }

  .modal-dialog {
    max-width: 640px;
  }

  h5 {
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: 140%;
    &:not(:first-child) {
      margin-top: 32px;
    }
  }

  p {
    font-size: 16px;
    font-weight: 400;
    line-height: 160%;
  }
}
</style>
