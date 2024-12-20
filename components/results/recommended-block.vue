<template>
  <transition name="transition-fade">
    <div
      v-if="target && items.length"
      class="mt-5 pt-3">
      <h1>{{ title }}</h1>
      <h4><slot/></h4>
      <div
        v-if="content === 'tasks'"
        class="library-content-tasks-tile mt-4">
        <common-task-tile
          v-for="item in items"
          :key="item.id"
          :data="item"
          @favorite="favorite"/>
      </div>
      <div
        v-if="content === 'tests'"
        class="training-content-view-tile mt-4">
        <common-test-tile
          v-for="item in items"
          :key="item.id"
          :data="item"
          @favorite="favorite"/>
      </div>

      <template v-if="!buttonChange">
        <button
          v-if="showBtn"
          class="w-100 py-1 btn border mt-3"
          :disabled="isFetching"
          @click="addItems">
          Показать еще
        </button>
      </template>

      <template v-else-if="buttonChange && storeItems.length >=5">
        <button
          v-if="showBtn && !toBank"
          class="w-100 py-1 btn border mt-3"
          :disabled="isFetching"
          @click="addItems">
          Показать еще
        </button>

        <nuxt-link to="/library/tasks" v-else>
          <button class="w-100 py-1 btn border mt-3">
            в банк заданий
          </button>
        </nuxt-link>
      </template>
    </div>
  </transition>
</template>

<script>
  import useResultsStore from '~/stores/results';

  export default {
    props: {
      title: {
        type: String
      },
      content: {
        type: String,
        required: true
      },
      buttonChange: {
        type: Boolean,
        default: false,
      }
    },
    setup(props) {
      const type = props.content;
      const store = useResultsStore();
      const target = computed(() => store.target[type]);
      const storeItems = computed(() => store.target[type]?.items || []);
      const isFetching = ref(false);
      const toBank = ref(false);

      let page = ref(1);
      const limit = computed(() => page.value * 5);
      const items = computed(() => {
        let arr = [].concat(storeItems.value);
        if (arr.length > limit.value) {
          arr.length = limit.value;
        }
        return arr;
      });

      const showBtn = ref(storeItems.value.length > items.value.length);
      async function addItems() {
        page.value++;
        while ((storeItems.value.length - items.value.length <= 5) && !store.target[type]?.isLast) {
          isFetching.value = true;
          await store.fetchTarget(type);
          isFetching.value = false;
        }
        showBtn.value = storeItems.value.length > items.value.length;
        toBank.value = items.value.length >= 10;
      }
      async function favorite(context) {
        context.setProgress(true);
        const res = await toggleFavorite(context.data.parent_id, context.data.content_type, !context.data.is_favorite);

        if (res) {
          store.setTargetField(context.data.id, context.data.content_type, 'is_favorite', !context.data.is_favorite);
        }
        context.setProgress(false, 150);
      }
      async function initItems() {
        if (!target.value || target.value.isUpdate) {
          await store.fetchTarget(type);
          page.value = 0;
          addItems();
        }
      }
      watch(() => target.value?.isUpdate, () => initItems());

      onMounted(() => {
        initItems()
      });

      return {
        target,
        items,
        isFetching,
        showBtn,
        addItems,
        favorite,
        toBank,
        storeItems
      };
    }
  };
</script>
