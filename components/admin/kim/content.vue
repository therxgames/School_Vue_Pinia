<template>
  <div class="admin-kim-content">
    <div
      v-if="adminKimStore.list.length > 0 || adminKimStore.addRecordTrigger"
      class="admin-kim-content-table text-nowrap border rounded">
      <div class="table-row table-row-header admin-kim-content-table-header">
        <div class="admin-kim-content-table-header-item">
          <common-sort-label
            title="ГИА"
            :dir="sortDir('attestation')"
            @sort="onSort('attestation')"/>
        </div>
        <div class="admin-kim-content-table-header-item">
          <common-sort-label
            title="Год"
            :dir="sortDir('year')"
            @sort="onSort('year')"/>
        </div>
        <div class="admin-kim-content-table-header-item">
          <common-sort-label
            title="Предмет"
            :dir="sortDir('subject_id')"
            @sort="onSort('subject_id')"/>
        </div>
        <div class="admin-kim-content-table-header-item">
          <common-sort-label
            title="Класс"
            :dir="sortDir('parallel_id')"
            @sort="onSort('parallel_id')"/>
        </div>
        <div class="admin-kim-content-table-header-item">
          <common-sort-label
            v-tooltip="{title: 'Порядковый номер задания'}"
            title="Номер задания"
            :dir="sortDir('number')"
            @sort="onSort('number')"/>
        </div>
        <div class="admin-kim-content-table-header-item">
          <common-sort-label
            title="Время, сек"
            :dir="sortDir('time')"
            @sort="onSort('time')"/>
        </div>
      </div>
      <div class="admin-kim-content-table-content">
        <div
          v-for="(item, index) in adminKimStore.resolvedItems"
          :key="index"
          :class="{'edit': item.id === adminKimStore.editRecordId}"
          :title="`Создано  ${formatDate(item.created_at)}, Изменено ${formatDate(item.created_at)}`"
          class="admin-kim-content-table-content-row exist">
          <div>
            <span
              v-if="item.id !== adminKimStore.editRecordId"
              class="admin-kim-content-table-content-row-attestation"
              :class="item.attestation">
              {{ item.attestationName }}
            </span>
            <input-select-single
              v-else
              placeholder="ГИА"
              :reset-btn="false"
              :list="adminKimStore.getFilterData('attestation')"
              v-model:value="editAttestation"/>
          </div>
          <div>
            <span v-if="item.id !== adminKimStore.editRecordId">
              {{ item.year }}
            </span>
            <input-select-single
              v-else
              placeholder="Год"
              :reset-btn="false"
              :list="adminKimStore.getFilterData('years')"
              v-model:value="editYear"/>
          </div>
          <div>
            <span v-if="item.id !== adminKimStore.editRecordId">
              {{ item.subjectName }}
            </span>
            <input-select-single
              v-else
              placeholder="Предмет"
              :reset-btn="false"
              :list="adminKimStore.getFilterData('subjects')"
              v-model:value="editSubject"/>
          </div>
          <div>
            <span v-if="item.id !== adminKimStore.editRecordId">
              {{ item.className }}
            </span>
            <input-select-single
              v-else
              placeholder="Класс"
              :reset-btn="false"
              :list="useCommonStore().filtersData.data?.classes"
              v-model:value="editParallel"/>
          </div>
          <div>
            <span v-if="item.id !== adminKimStore.editRecordId">
              <span class="color-dark">#</span>{{ item.number }}
            </span>
            <input-simple
              v-else
              placeholder="Позиция"
              v-model:value="editPosition"/>
          </div>
          <div>
            <span v-if="item.id !== adminKimStore.editRecordId">
              {{ item.time }}
            </span>
            <input-simple
              v-else
              placeholder="Время"
              v-model:value="editTime"/>
          </div>
          <div class="admin-kim-content-table-content-row-actions">
            <div
              v-if="adminKimStore.editRecordId !== item.id"
              @click="adminKimStore.setEditableRecordId(item.id)"
              class="admin-kim-content-table-content-row-actions-item edit">
              <svg-icon
                class="admin-kim-content-table-content-row-actions-item-icon"
                name="edit"/>
            </div>
            <div
              v-if="adminKimStore.editRecordId !== item.id"
              @click="removeRecord(item.id)"
              class="admin-kim-content-table-content-row-actions-item trash">
              <svg-icon
                class="admin-kim-content-table-content-row-actions-item-icon"
                name="trash"/>
            </div>
            <div
              v-if="adminKimStore.editRecordId === item.id"
              @click="saveEditRecord(item.id)"
              class="admin-kim-content-table-content-row-actions-item save">
              <svg-icon
                class="admin-kim-content-table-content-row-actions-item-icon"
                name="check-tint-2"/>
            </div>
            <div
              v-if="adminKimStore.editRecordId === item.id"
              @click="adminKimStore.cancelEditRecord"
              class="admin-kim-content-table-content-row-actions-item remove">
              <svg-icon
                class="admin-kim-content-table-content-row-actions-item-icon"
                name="cross"/>
            </div>
          </div>
        </div>
        <div
          ref="addRow"
          class="admin-kim-content-table-content-row added"
          v-if="adminKimStore.addRecordTrigger">
          <div>
            <input-select-single
              placeholder="ГИА"
              :list="adminKimStore.getFilterData('attestation')"
              v-model:value="recordAttestation"/>
          </div>
          <div>
            <input-select-single
              placeholder="Год"
              :list="adminKimStore.getFilterData('years')"
              v-model:value="recordYear"/>
          </div>
          <div>
            <input-select-single
              placeholder="Предмет"
              :list="adminKimStore.getFilterData('subjects')"
              v-model:value="recordSubject"/>
          </div>
          <div>
            <input-select-single
              placeholder="Класс"
              :list="adminKimStore.getFilterData('classes')"
              v-model:value="recordParallel"/>
          </div>
          <div>
            <input-simple
              placeholder="Позиция"
              v-model:value="recordPosition"/>
          </div>
          <div>
            <input-simple
              placeholder="Время"
              v-model:value="recordTime"/>
          </div>
          <div class="admin-kim-content-table-content-row-actions">
            <div
              @click="adminKimStore.saveNewRecord"
              class="admin-kim-content-table-content-row-actions-item save">
              <svg-icon
                class="admin-kim-content-table-content-row-actions-item-icon"
                name="check-tint-2"/>
            </div>
            <div
              @click="adminKimStore.cancelNewRecord"
              class="admin-kim-content-table-content-row-actions-item remove">
              <svg-icon
                class="admin-kim-content-table-content-row-actions-item-icon"
                name="cross"/>
            </div>
          </div>
        </div>
      </div>
      <div
        :class="{'visible': tableAddActionVisible && !adminKimStore.fetching && !adminKimStore.addRecordTrigger}"
        @click="adminKimStore.addNewRecord"
        class="admin-kim-content-table-add">
        <svg-icon name="add"/>
      </div>
    </div>

    <common-pagination
      :list="adminKimStore.list"
      :pagination="adminKimStore.filters.page"
      :per-page="50"
      :enable-more="false"
      @page="onPage"
      @show-more="onShowMore"/>

    <admin-kim-empty
      v-if="renderController.commonEmpty"
      reason-text="Попробуйте изменить критерии поиска <br> или добавьте элемент"
      :btn-visible-if="adminKimStore.filtersInvolved"
      @reset="adminKimStore.resetFilters"
      @add="adminKimStore.addNewRecord"/>

    <loader
      class="admin-kim-content-loader"
      :listener="adminKimStore.fetching"/>
  </div>
</template>

<script setup>
  import useAdminKimStore from '~/stores/admin-kim';
  import useCommonStore from '~/stores/common';

  const adminKimStore = useAdminKimStore();
  const addRow = ref(null);
  const tableAddActionVisible = ref(false);
  const renderController = computed(() => ({
    content: adminKimStore.list.length
      || adminKimStore.addRecordTrigger,
    commonEmpty: !adminKimStore.list.length
      && !adminKimStore.fetching
      && !adminKimStore.addRecordTrigger
  }));

  const recordAttestation = computed({
    get: () => adminKimStore.newRecord.attestation,
    set: (value) => adminKimStore.newRecord.attestation = value
  });
  const recordYear = computed({
    get: () => adminKimStore.newRecord.year,
    set: (value) => adminKimStore.newRecord.year = value
  });
  const recordSubject = computed({
    get: () => adminKimStore.newRecord.subject_id,
    set: (value) => adminKimStore.newRecord.subject_id = value
  });
  const recordParallel = computed({
    get: () => adminKimStore.newRecord.parallel_id,
    set: (value) => adminKimStore.newRecord.parallel_id = value
  });
  const recordPosition = computed({
    get: () => adminKimStore.newRecord.number?.toString() || '0',
    set: (value) => adminKimStore.newRecord.number = value
  });
  const recordTime = computed({
    get: () => adminKimStore.newRecord.time + '',
    set: (value) => adminKimStore.newRecord.time = value
  });

  const editAttestation = computed({
    get: () => adminKimStore.editRecord.attestation,
    set: (value) => adminKimStore.editRecord.attestation = value
  });
  const editYear = computed({
    get: () => adminKimStore.editRecord.year,
    set: (value) => adminKimStore.editRecord.year = value
  });
  const editSubject = computed({
    get: () => adminKimStore.editRecord.subject_id,
    set: (value) => adminKimStore.editRecord.subject_id = value
  });
  const editParallel = computed({
    get: () => adminKimStore.editRecord.parallel_id,
    set: (value) => adminKimStore.editRecord.parallel_id = value
  });
  const editPosition = computed({
    get: () => adminKimStore.editRecord.number?.toString() || '0',
    set: (value) => adminKimStore.editRecord.number = value
  });
  const editTime = computed({
    get: () => adminKimStore.editRecord.time + '',
    set: (value) => adminKimStore.editRecord.time = value
  });

  onMounted(() => {
    eventBus.on('admin-kim:save-error', onAdminKimSaveError);
    eventBus.on('admin-kim:new-record', onAdminKimNewRecord);
    window.addEventListener('scroll', onScroll);
  });

  onBeforeUnmount(() => {
    eventBus.off('admin-kim:save-error', onAdminKimSaveError);
    eventBus.off('admin-kim:new-record', onAdminKimNewRecord);
    window.removeEventListener('scroll', onScroll);
  });

  const removeRecord = (id) => {
    const remove = async () => {
      const isRemoved = await adminKimStore.removeRecord(id);
      if (isRemoved) {
        eventBus.emit('toast:show', {
          text: 'Запись удалена'
        });
      }
    };
    const askBefore = () => {
      eventBus.emit('alert:show', {
        title: 'Удаление записи',
        content: `Вы действительно хотите удалить запись?`,
        buttons: [
          {
            title: 'Да',
            async click(modal, context) {
              context.hide();
              remove();
            }
          },
          {
            title: 'Отмена',
            class: 'btn-outline-primary',
            click(modal, context) {
              context.hide();
            }
          }
        ]
      });
    };
    askBefore();
  };
  const saveEditRecord = async (id) => {
    const saved = await adminKimStore.saveEditRecord(id);
    if (saved) {
      eventBus.emit('toast:show', {text: 'Запись изменена'});
    }
  };
  const onSort = (field) => {
    if (sortDir(field) === 1) {
      adminKimStore.setFilterValue('order', `${field},asc`);
    } else if (sortDir(field) === 2) {
      adminKimStore.setFilterValue('order', `none,none`);
    } else if (sortDir(field) === 0) {
      adminKimStore.setFilterValue('order', `${field},desc`);
    }
  };
  const sortDir = (field) => {
    const [by, dir] = adminKimStore.filters.order.value.split(',');
    if (by === 'none') {
      return 0;
    }
    if (by === field) {
      return dir === 'desc'
        ? 1
        : 2;
    }
    return 0;
  };
  const isElementInViewport = (el) => {
    let rect = el.getBoundingClientRect();
    return rect.bottom > 0
      && rect.right > 0
      && rect.left < (window.innerWidth || document.documentElement.clientWidth)
      && rect.top < (window.innerHeight || document.documentElement.clientHeight);
  };
  const scrollToNewRecord = async () => {
    await nextTick();
    if (addRow.value && !isElementInViewport(addRow.value)) {
      addRow.value.scrollIntoView({behavior: 'smooth'});
    }
  };
  const onPage = (page) => {
    adminKimStore.filters.page.current = page;
  };
  const onShowMore = () => {};
  const onAdminKimSaveError = (e) => {
    eventBus.emit('toast:show', {text: 'Не удалось сохранить запись, проверьте правильность введенных данных'});
  };
  const onAdminKimNewRecord = () => {
    scrollToNewRecord();
  };
  const onScroll = (e) => {
    tableAddActionVisible.value = window.scrollY > 370;
  };
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .admin-kim-content {
    position: relative;
    margin-bottom: 3rem;

    &-table {
      margin-bottom: 2rem;

      &-header,
      &-content-row {
        display: grid;
        gap: 1.5rem;
        align-items: center;
        grid-template-columns:
          minmax(110px, 110px)
          minmax(170px, 170px)
          minmax(220px, 220px)
          minmax(150px, 150px)
          minmax(160px, 160px)
          minmax(170px, 170px)
          auto;
      }

      &-header {
        padding: 1.5rem 2.5rem;
        border-bottom: 1px solid #dee2e6;

        &-item {
          display: inline-flex;
        }
      }

      &-content {
        padding: 0 2.5rem;

        &-row {
          &.exist {
            padding: 1rem 2.5rem;
            margin: 0 -2.5rem;

            &:hover {
              background: #fafafa;
            }
          }

          &.added {
            background: #fafafa;
            margin: 0 -2.5rem;
            padding: 1rem 2.5rem;
            border-bottom-left-radius: 0.5rem;
            border-bottom-right-radius: 0.5rem;
          }

          &.edit.exist {
            margin: 0 -2.5rem;
            padding: 0.62rem 2.5rem;
          }

          &-actions {
            display: flex;
            gap: 1rem;
            align-items: center;
            cursor: pointer;

            &-item {
              background: #fff;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 0.5rem;
              width: 2rem;
              height: 2rem;

              &:hover path {
                fill: $color-blue-normal !important;
              }

              &-icon {
                width: 1.15rem;
              }

              &.save {
                transition: all 150ms ease-out;
              }

              &.remove {
                transition: all 150ms ease-out;

                .admin-kim-content-table-content-row-actions-item-icon {
                  width: 0.75rem;
                }

                svg {
                  fill: #000;
                }
              }

              &.edit {
                transition: all 150ms ease-out;
              }

              &.trash {
                transition: all 150ms ease-out;
              }
            }
          }

          &-attestation {
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;

            &.oge {
              background: #f8635129;
            }

            &.vpr {
              background: #0576ff1f;
            }
          }
        }
      }

      &-add {
        position: absolute;
        bottom: 0;
        right: -3rem;
        display: flex;
        background: #fff;
        cursor: pointer;
        border: 1px solid #dee2e6;
        padding: 0.5rem;
        border-radius: 0.5rem;
        opacity: 0;

        &:hover {
          background: #f1f1f1;
        }

        &.visible {
          opacity: 1;
        }
      }
    }

    &-loader {

    }
  }
</style>
