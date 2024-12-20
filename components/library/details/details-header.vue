<template>
  <library-details-breadcrumbs />

  <div  class="details-header-wrapper"
        :class="[{'details-header-wrapper-url': image}]"
        :style="[{background: getBgColor(!image ? collectionCode : false)}, {boxShadow: getBoxShadow(!image ? collectionCode : false)}]">

    <div :class="'details-header container'">
      <svg-icon :name="libraryItemIcon[collectionCode]" class="details-header-icon" v-if="!image" />

      <div>
        <div class="d-inline-flex gap-3">
          <div class="d-inline-flex align-items-center" v-if="item?.isOnline">
            <common-online-btn />
          </div>

          <div class="d-inline-flex align-items-center gap-1">
            <svg-icon name="eye-open" />
            <span>{{ item?.viewCount }}</span>
          </div>

          <!-- <div class="d-inline-flex align-items-center gap-1">
            <svg-icon name="thumbs-up" />
            <span>{{ '1'.toLocaleString('ru') }}</span>
          </div> -->

          <!-- <div class="d-inline-flex align-items-center gap-1" v-tooltip="{ title: 'Связанные тесты' }">
            <svg-icon name="tree-structure-icon" />
            <span>{{ '2 теста'.toLocaleString('ru') }}</span>
          </div> -->

          <!-- <template v-if="item?.type === 'article'"> -->
            <div class="d-inline-flex align-items-center gap-1" v-tooltip="{ title: 'Примерное время чтения' }" v-if="item?.familiarizeTime">
              <svg-icon name="clock" />
              <span>{{ `~ ${item?.familiarizeTime} мин`.toLocaleString('ru') }}</span>
            </div>
          <!-- </template> -->
        </div>

        <h1 class="details-header-title">{{ item?.title }}</h1>
      </div>

      <!--<template v-if="item?.type === 'btsok' || item?.type === 'eor'">-->
        <library-details-class-subject v-if="(item?.classes?.length > 0 || item?.subjects?.length > 0) && !image" :classes="item?.classes" :subjects="item?.courses" />
      <!--</template>-->

      <!--<template v-if="item?.type === 'competence'">-->
        <library-details-scope v-if="item?.scope" :scope="item?.scope" />
      <!--</template>-->

      <div class="d-flex flex-column w-100 gap-2" v-if="image">
        <library-details-image :url="image"  />

        <!-- <p v-if="!!item?.image.description" class=" text-sm text-gray-dark details-header-img-description">{{ item?.image.description }}</p> -->
        <!-- <p class="details-header-img-description">Фото: BAZA Production / Shutterstock</p> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { libraryItemBg, libraryItemColor, libraryItemIcon } from '~/components/library/details/consts';

const props = defineProps({
  item: {
    type: Object,
  },
});

console.log(props)

const image = computed(() => props.item?.cover?.url);
const collectionCode = computed(() => props.item?.collection?.code);

const getBgColor = (type) => {
  switch (type) {
    case 'article':
      return '#FFE445';
    case 'tsok':
      return '#E4F1FF';
    case 'competence':
      return '#E2DAFF';
    case 'eor':
      return '#D5EB77';
    case 'project':
      return '#5B7BEB';
    default:
      return '#FFF';
  }
}

const getBoxShadow = (type) => {
  switch (type) {
    case 'article':
      return '1000px 0 0 #FFE445, -1000px 0 0 #FFE445';
    case 'tsok':
      return '1000px 0 0 #E4F1FF, -1000px 0 0 #E4F1FF';
    case 'competence':
      return '1000px 0 0 #E2DAFF, -1000px 0 0 #E2DAFF';
    case 'eor':
      return '1000px 0 0 #D5EB77, -1000px 0 0 #D5EB77';
    case 'project':
      return '1000px 0 0 #5B7BEB, -1000px 0 0 #5B7BEB';
    default:
      return '1000px 0 0 #FFF, -1000px 0 0 #FFF';
  }
}
</script>

<style lang="scss" scoped>
@import '/assets/scss/theme';

.details-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 64rem;
  gap: 2rem;

  &-wrapper {
    padding-top: 3rem;
    padding-bottom: 3rem;

    &-url {
      padding-top: 1rem;
      padding-bottom: 1rem;
    }
  }

  &-icon {
    height: 2rem;
    width: 2rem;
  }

  &-title {
    font-weight: 500;
    font-size: 3.75rem;
    line-height: 1;
    margin-bottom: 0;
  }

  &-img-description {
    font-size: 14px;
    font-weight: 400;
    color: #93979e;
    margin-bottom: 0;
  }
}
</style>
