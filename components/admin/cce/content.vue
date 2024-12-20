<template>
  <div class="admin-cce-content">
    <div
      v-if="store.list.length > 0 || store.addRecordTrigger"
      class="admin-cce-content-table text-nowrap border rounded">
      <div class="table-row table-row-header admin-cce-content-table-header">
        <div class="admin-cce-content-table-header-item">
          <common-sort-label
            title="ТИП"
            :dir="sortDir('attestation')"
            @sort="onSort('attestation')"/>
        </div>
        <div class="admin-cce-content-table-header-item">
          <common-sort-label
            title="Год"
            :dir="sortDir('year')"
            @sort="onSort('year')"/>
        </div>
        <div class="admin-cce-content-table-header-item">
          <common-sort-label
            title="Предмет"
            :dir="sortDir('subject_id')"
            @sort="onSort('subject_id')"/>
        </div>
        <div class="admin-cce-content-table-header-item">
          <common-sort-label
            title="Класс"
            :dir="sortDir('parallel_id')"
            @sort="onSort('parallel_id')"/>
        </div>
        <div class="admin-cce-content-table-header-item">
          <common-sort-label
            v-tooltip="{ title: 'Порядковый номер КЭС' }"
            title="Номер КЭС"
            :dir="sortDir('id')"
            @sort="onSort('id')"/>
        </div>
      </div>
      <div class="admin-cce-content-table-content">
        <div
          v-for="(item, index) in store.resolvedItems"
          :key="index"
          :class="{ 'edit': item.id === store.editRecordId }"
          :title="`Создано  ${formatDate(item.created_at)}, Изменено ${formatDate(item.created_at)}`"
          class="admin-cce-content-table-content-row exist">
          <search-dropdown
            v-if="item.id === store.editRecordId"
            :list="store.cce.list"
            @select="selectEditName"
            @reset="resetCceList">
            <input-simple
              placeholder="Искать по названию КЭС"
              v-model:value="editName"/>
          </search-dropdown>
          <div>
            <span
              v-if="item.id !== store.editRecordId"
              class="admin-cce-content-table-content-row-attestation"
              :class="item.attestation">
              {{ item.attestationName }}
            </span>
            <input-select-single
              v-else
              placeholder="ТИП"
              :reset-btn="false"
              :list="store.getFilterData('attestation')"
              v-model:value="editAttestation"/>
          </div>
          <div>
            <span v-if="item.id !== store.editRecordId">
              {{ item.year }}
            </span>
            <input-select-single
              v-else
              placeholder="Год"
              :reset-btn="false"
              :list="store.getFilterData('years')"
              v-model:value="editYear"/>
          </div>
          <div>
            <span v-if="item.id !== store.editRecordId">
              {{ item.subjectName }}
            </span>
            <input-select-single
              v-else
              placeholder="Предмет"
              :reset-btn="false"
              :list="store.getFilterData('subjects')"
              v-model:value="editSubject"/>
          </div>
          <div>
            <span v-if="item.id !== store.editRecordId">
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
            <span v-if="item.id !== store.editRecordId">
              <span class="color-dark">#</span>{{ item.cce_id }}
            </span>
            <input-simple
              v-else
              placeholder="КЭС"
              v-model:value="editPosition"/>
          </div>
          <div class="admin-cce-content-table-content-row-actions">
            <div
              v-if="store.editRecordId !== item.id"
              @click="store.setEditableRecordId(item.id)"
              class="admin-cce-content-table-content-row-actions-item edit">
              <svg-icon
                class="admin-cce-content-table-content-row-actions-item-icon"
                name="edit"/>
            </div>
            <div
              v-if="store.editRecordId !== item.id"
              @click="removeRecord(item.id)"
              class="admin-cce-content-table-content-row-actions-item trash">
              <svg-icon
                class="admin-cce-content-table-content-row-actions-item-icon"
                name="trash"/>
            </div>
            <div
              v-if="store.editRecordId === item.id"
              @click="saveEditRecord(item.id)"
              class="admin-cce-content-table-content-row-actions-item save">
              <svg-icon
                class="admin-cce-content-table-content-row-actions-item-icon"
                name="check-tint-2"/>
            </div>
            <div
              v-if="store.editRecordId === item.id"
              @click="store.cancelEditRecord"
              class="admin-cce-content-table-content-row-actions-item remove">
              <svg-icon
                class="admin-cce-content-table-content-row-actions-item-icon"
                name="cross"/>
            </div>
          </div>
        </div>
        <div
          v-if="store.addRecordTrigger"
          ref="addRow"
          class="admin-cce-content-table-content-row added">
          <search-dropdown
            :list="store.cce.list"
            @select="selectRecordName"
            @reset="resetCceList">
            <input-simple
              placeholder="Искать по названию КЭС"
              v-model:value="recordName"/>
          </search-dropdown>
          <div>
            <input-select-single
              placeholder="ТИП"
              :list="store.getFilterData('attestation')"
              v-model:value="recordAttestation"/>
          </div>
          <div>
            <input-select-single
              placeholder="Год"
              :list="store.getFilterData('years')"
              v-model:value="recordYear"/>
          </div>
          <div>
            <input-select-single
              placeholder="Предмет"
              :list="store.getFilterData('subjects')"
              v-model:value="recordSubject"/>
          </div>
          <div>
            <input-select-single
              placeholder="Класс"
              :list="store.getFilterData('classes')"
              v-model:value="recordParallel"/>
          </div>
          <div>
            <input-simple
              placeholder="КЭС"
              v-model:value="recordPosition"/>
          </div>
          <div class="admin-cce-content-table-content-row-actions">
            <div
              @click="store.saveNewRecord"
              class="admin-cce-content-table-content-row-actions-item save">
              <svg-icon
                class="admin-cce-content-table-content-row-actions-item-icon"
                name="check-tint-2"/>
            </div>
            <div
              @click="store.cancelNewRecord"
              class="admin-cce-content-table-content-row-actions-item remove">
              <svg-icon
                class="admin-cce-content-table-content-row-actions-item-icon"
                name="cross"/>
            </div>
          </div>
        </div>
      </div>
      <div
        :class="{ 'visible': tableAddActionVisible && !store.fetching && !store.addRecordTrigger }"
        @click="store.addNewRecord"
        class="admin-cce-content-table-add">
        <svg-icon name="add"/>
      </div>
    </div>

    <common-pagination
      :list="store.list"
      :pagination="store.filters.page"
      :per-page="50"
      :enable-more="false"
      @page="onPage"
      @show-more="onShowMore"/>

    <admin-cce-empty
      v-if="renderController.commonEmpty"
      reason-text="Попробуйте изменить критерии поиска <br> или добавьте элемент"
      :btn-visible-if="store.filtersInvolved"
      @reset="store.resetFilters"
      @add="store.addNewRecord"/>

    <loader
      class="admin-cce-content-loader"
      :listener="store.fetching"/>
  </div>
</template>

<script setup>
  import useAdminCceStore from '~/stores/admin-cce';
  import useCommonStore from '~/stores/common';
  import _debounce from 'lodash.debounce';
  import SearchDropdown from '~/components/admin/cce/search-dropdown.vue';

  const store = useAdminCceStore();
  const addRow = ref(null);
  const tableAddActionVisible = ref(false);
  const renderController = computed(() => ({
    content: store.list.length
      || store.addRecordTrigger,
    commonEmpty: !store.list.length
      && !store.fetching
      && !store.addRecordTrigger
  }));

  const recordAttestation = computed({
    get: () => store.newRecord.attestation,
    set: (value) => store.newRecord.attestation = value
  });
  const recordYear = computed({
    get: () => store.newRecord.year,
    set: (value) => store.newRecord.year = value
  });
  const recordSubject = computed({
    get: () => store.newRecord.subject_id,
    set: (value) => store.newRecord.subject_id = value
  });
  const recordParallel = computed({
    get: () => store.newRecord.parallel_id,
    set: (value) => store.newRecord.parallel_id = value
  });
  const recordPosition = computed({
    get: () => store.newRecord.cce_id || '',
    set: _debounce((value) => {
      store.findCceById(value, 'new');
    }, 1000)
  });
  const recordName = computed({
    get: () => store.newRecord.cce_name || '',
    set: _debounce((value) => {
      store.findCceByName(value, 'new');
    }, 1000)
  });

  const editAttestation = computed({
    get: () => store.editRecord.attestation,
    set: (value) => store.editRecord.attestation = value
  });
  const editYear = computed({
    get: () => store.editRecord.year,
    set: (value) => store.editRecord.year = value
  });
  const editSubject = computed({
    get: () => store.editRecord.subject_id,
    set: (value) => store.editRecord.subject_id = value
  });
  const editParallel = computed({
    get: () => store.editRecord.parallel_id,
    set: (value) => store.editRecord.parallel_id = value
  });
  const editPosition = computed({
    get: () => store.editRecord.cce_id?.toString() || '',
    set: _debounce((value) => {
      store.findCceById(value, 'edit');
    }, 1000)
  });
  const editName = computed({
    get: () => store.editRecord.cce_name || '',
    set: _debounce((value) => {
      store.findCceByName(value, 'edit');
    }, 1000)
  });

  const selectRecordName = (cce) => {
    store.newRecord.cce_id = `${cce.id}`;
    store.newRecord.cce_name = cce.name;
    store.cce.list = [];
  };

  const selectEditName = (cce) => {
    store.editRecord.cce_id = `${cce.id}`;
    store.editRecord.cce_name = cce.name;
    store.cce.list = [];
  };

  const resetCceList = () => {
    if (store.cce.list.length) {
      store.cce.list = [];
    }
  };

  onMounted(() => {
    eventBus.on('admin-cce:save-error', onAdminCceSaveError);
    eventBus.on('admin-cce:new-record', onAdminCceNewRecord);
    window.addEventListener('scroll', onScroll);
  });

  onBeforeUnmount(() => {
    eventBus.off('admin-cce:save-error', onAdminCceSaveError);
    eventBus.off('admin-cce:new-record', onAdminCceNewRecord);
    window.removeEventListener('scroll', onScroll);
  });

  const removeRecord = (id) => {
    const remove = async () => {
      const isRemoved = await store.removeRecord(id);
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
    const saved = await store.saveEditRecord(id);
    if (saved) {
      eventBus.emit('toast:show', {text: 'Запись изменена'});
    }
  };
  const onSort = (field) => {
    if (sortDir(field) === 1) {
      store.setFilterValue('order', `${field},asc`);
    } else if (sortDir(field) === 2) {
      store.setFilterValue('order', `none,none`);
    } else if (sortDir(field) === 0) {
      store.setFilterValue('order', `${field},desc`);
    }
  };
  const sortDir = (field) => {
    const [by, dir] = store.filters.order.value.split(',');
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
    store.filters.page.current = page;
  };
  const onShowMore = () => {};
  const onAdminCceSaveError = (e) => {
    eventBus.emit('toast:show', {text: 'Не удалось сохранить запись, проверьте правильность введенных данных'});
  };
  const onAdminCceNewRecord = () => {
    scrollToNewRecord();
  };
  const onScroll = (e) => {
    tableAddActionVisible.value = window.scrollY > 370;
  };
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .admin-cce-content {
    position: relative;
    margin-bottom: 3rem;

    &-table {
      margin-bottom: 2rem;

      &-header,
      &-content-row {
        display: grid;
        gap: 1.5rem;
        align-items: center;
        grid-template-columns: minmax(110px, 110px) minmax(170px, 170px) 1fr minmax(150px, 250px) minmax(170px, 170px) 80px;
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

                .admin-cce-content-table-content-row-actions-item-icon {
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

    &-loader {}
  }

  .admin-cce-content-dropdown-item {
    cursor: pointer;

    &:hover {
      color: $color-blue-normal;
    }
  }
</style>
