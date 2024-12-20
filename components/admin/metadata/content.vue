<template>
  <div class="admin-metadata-content">
    <template v-if="show">
      <div class="table p-0 bg-ligh border rounded">
        <div
          class="table-row table-row-header"
          :class="{'border-bottom': true}">
          <div class="table-cell px-3">
            <h5 class="m-0">
              Описание
              <button
                class="btn btn-sm ms-1"
                :class="{actived: descriptionEditable}"
                @click="descriptionEditable = !descriptionEditable">
                <svg-icon name="edit"/>
              </button>
            </h5>
          </div>
        </div>
        <div
          class="table-row"
          :class="{'border-bottom': true}">
          <div class="table-cell px-3">
            <textarea
              ref="descrTAEl"
              :disabled="!descriptionEditable"
              :class="['admin-metadata-content-editable', {'admin-metadata-content-editing': descriptionEditable}]"
              v-model="description"/>
          </div>
        </div>

        <div
          class="table-row table-row-header"
          :class="{'border-bottom': true}">
          <div class="table-cell px-3">
            <h5 class="m-0">
              Инструкция
              <button
                class="btn btn-sm ms-1"
                :class="{actived: instructionEditable}"
                @click="instructionEditable = !instructionEditable">
                <svg-icon name="edit"/>
              </button>
            </h5>
          </div>
        </div>
        <div
          v-if="dualMode"
          class="table-row"
          :class="{'border-bottom': dualMode}">
          <div class="table-cell px-3">
            <h6
              class="m-0"
              v-if="dualMode">
              Письменная часть
            </h6>
          </div>
        </div>

        <div
          class="table-row"
          :class="{'border-bottom': dualMode}">
          <div class="table-cell px-3">
            <textarea
              ref="writeTAEl"
              :disabled="!instructionEditable"
              :class="['admin-metadata-content-editable', {'admin-metadata-content-editing': instructionEditable}]"
              v-model="write_instruction"/>
          </div>
        </div>
        <template v-if="dualMode">
          <div
            v-if="dualMode"
            class="table-row"
            :class="{'border-bottom': dualMode}">
            <div class="table-cell px-3">
              <h6
                class="m-0"
                v-if="dualMode">
                Устная часть
              </h6>
            </div>
          </div>
          <div class="table-row">
            <div class="table-cell px-3">
              <textarea
                :disabled="!instructionEditable"
                :class="['admin-metadata-content-editable', {'admin-metadata-content-editing': instructionEditable}]"
                v-model="verbal_instruction"/>
            </div>
          </div>
        </template>
      </div>

      <button
        class="btn btn-primary btn-small me-2"
        :disabled="!(description && write_instruction) || adminMetadataStore.fetching"
        @click="save">
        Сохранить
      </button>
      <button
        class="btn btn-outline-primary btn-small"
        @click="reset">
        Отмена
      </button>
    </template>
    <div v-else>
      <p class="text-center">
        {{ category === 'demovariant' ? 'Выберите год, предмет и класс.':'Выберите Демоварианты или Мои тесты.' }}
      </p>
    </div>
  </div>
</template>

<script setup>
  import useAdminMetadataStore from '~/stores/admin-metadata';
  import _cloneDeep from 'lodash.clonedeep';
  import DOMPurify from 'dompurify';

  const adminMetadataStore = useAdminMetadataStore();

  const byCategory = computed(() => adminMetadataStore.getFilterValue('category'));


  const writeTAEl = ref(null);
  const descrTAEl = ref(null);

  const description = ref('');
  const write_instruction = ref('');
  const verbal_instruction = ref('');

  const descriptionEditable = ref(false);
  const instructionEditable = ref(false);
  const metadata = ref(null);
  const TAGS = {ALLOWED_TAGS: ['b', 'br', 'strong', 'i', 'u']};

  const show = computed(() => adminMetadataStore.show);
  const dualMode = computed(() => adminMetadataStore.dualMode);

  const category = computed(() => adminMetadataStore.getFilterValue('category'));
  const refresh = () => {
    const val = adminMetadataStore.list;
    nextTick(() => {
      if (writeTAEl.value && descrTAEl) {
        descrTAEl.value.style.height = 'auto';
        writeTAEl.value.style.height = 'auto';
      }
      if (val.length === 1) {
        metadata.value = _cloneDeep(val[0]);
        description.value = metadata.value.description;
        write_instruction.value = metadata.value.write_instruction;
        verbal_instruction.value = metadata.value.verbal_instruction;
        if (writeTAEl.value && descrTAEl) {
          nextTick(() => {
            descrTAEl.value.style.height = descrTAEl.value.scrollHeight + 2 + 'px';
            writeTAEl.value.style.height = writeTAEl.value.scrollHeight + 2 + 'px';
          });
        }
      } else if (val.length === 0) {
        description.value = '';
        write_instruction.value = '';
        verbal_instruction.value = '';
      }
      descriptionEditable.value = false;
      instructionEditable.value = false;
    });
  };

  watch(() => adminMetadataStore.list, refresh);
  onMounted(refresh);

  watch(byCategory, () => {
    metadata.value = null;
    description.value = '';
    write_instruction.value = '';
    verbal_instruction.value = '';
    descriptionEditable.value = false;
    instructionEditable.value = false;
    if (descrTAEl.value) {
      descrTAEl.value.style.height = 'auto';
    }
    if (writeTAEl.value) {
      writeTAEl.value.style.height = 'auto';
    }
  });

  watch(description, () => {
    nextTick(() => {
      if (descrTAEl.value) {
        descrTAEl.value.style.height = 'auto';
        nextTick(() => {
          descrTAEl.value.style.height = descrTAEl.value.scrollHeight + 2 + 'px';
        });
      }
    });
  });
  watch(write_instruction, () => {
    nextTick(() => {
      if (writeTAEl.value) {
        writeTAEl.value.style.height = 'auto';
        nextTick(() => {
          writeTAEl.value.style.height = writeTAEl.value.scrollHeight + 2 + 'px';
        });
      }
    });
  });

  const save = () => {
    if (adminMetadataStore.fetching) return;
    const data = {
      description: DOMPurify().sanitize(description.value.trim(), TAGS),
      write_instruction: DOMPurify().sanitize(write_instruction.value.trim(), TAGS),
      verbal_instruction: DOMPurify().sanitize(verbal_instruction.value.trim(), TAGS)
    };

    if (metadata.value) {
      data.id = metadata.value.id;
    }

    adminMetadataStore.saveDescription(data);
    descriptionEditable.value = false;
    instructionEditable.value = false;
  };

  const reset = () => {
    description.value = metadata.value.description;
    write_instruction.value = metadata.value.write_instruction;
    verbal_instruction.value = metadata.value.verbal_instruction;

    descriptionEditable.value = false;
    instructionEditable.value = false;
  };
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .admin-metadata-content {
    position: relative;
    margin-bottom: 3rem;

    &-editable {
      padding-top: 10px;
      margin: 15px 0 5px;
      border: 1px solid transparent;
    }

    &-editing {
      border: 1px solid #ced6e0;
      border-radius: 0.5rem;
      outline: none;
    }

    .table-cell {
      textarea {
        width: 100%;
        min-height: 50px;
        resize: none;
        overflow-y: hidden;
      }

      button {
        &.actived {
          border-color: #ced6e0;
        }

        &:active {
          border-color: transparent;
        }
      }
    }
  }
</style>
