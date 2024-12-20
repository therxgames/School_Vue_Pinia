<template>
  <div class="freeAnswer-criteria">
    <div
      v-if="contentHasVariants && !answer?.answer?.variant"
      class="freeAnswer-criteria-info">
      Не выбран вариант
    </div>

    <div
      v-for="(group, groupIndex) in filteredContent"
      :key="groupIndex"
      class="freeAnswer-criteria-group">
      <div
        v-for="(item, itemIndex) in group.list"
        :key="itemIndex"
        class="freeAnswer-criteria-item">
        <div
          class="freeAnswer-criteria-item-header">
          <b v-if="content.length > 1">{{ itemIndex + 1 }}.&nbsp;</b>
          <div
            v-if="item.name"
            v-html="item.name"
            class="freeAnswer-criteria-item-header-name"/>
          <div
            v-else
            class="freeAnswer-criteria-item-header-name">
            Критерии оценивания
          </div>

          <div
            v-if="scoring"
            class="freeAnswer-criteria-item-header-sum">
            {{ itemStat(item) }}
          </div>

          <div
            v-if="scoring"
            class="freeAnswer-criteria-item-header-collapse">
            <a
              data-bs-toggle="collapse"
              :href="'#criteria-' + itemIndex"
              class="collapseIcon">
              <svg-icon name="arrow-bottom"/>
            </a>
          </div>
        </div>

        <div
          :id="'criteria-' + itemIndex"
          class="freeAnswer-criteria-item-body collapse show">
          <div
            v-if="item.note"
            class="freeAnswer-criteria-item w-75"
            v-html="item.note"/>
          <div
            v-for="(variant, variantIndex) in item.variants"
            :key="variantIndex"
            class="freeAnswer-criteria-item-variant">
            <div
              v-html="variant.content"
              class="freeAnswer-criteria-item-variant-content"/>

            <div class="freeAnswer-criteria-item-variant-radio">
              <input
                v-if="scoring"
                type="radio"
                :name="'criteria-' + item.id + '-' + uniqueId"
                :id="'criteria-' + item.id + '-' + uniqueId + '-' + variantIndex"
                :checked="scores[item.id] === variant.score"
                @change="onScore(item, variant.score)">

              <label :for="'criteria-' + item.id + '-' + uniqueId + '-' + variantIndex"/>
            </div>

            <div class="freeAnswer-criteria-item-variant-score">
              {{ variant.score }} {{ declension(variant.score, ['балл', 'балла', 'баллов']) }}
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="group.instructions"
        v-html="group.instructions"
        class="freeAnswer-criteria-instructions"/>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    content: {type: Array, default: () => []},
    scoring: {type: Boolean, default: false},
    answer: {type: Object, default: null}
  });

  const emit = defineEmits(['scores-change']);

  const uniqueId = ref('id');
  const scores = ref({});

  onMounted(() => {
    uniqueId.value = Math.random();

    if (props.answer?.answer?.scores) {
      scores.value = props.answer?.answer?.scores;
    }
  });

  watch(() => props.answer, () => {
    if (props.answer?.answer?.scores) {
      scores.value = props.answer.answer.scores;
    }
  }, {immediately: true, deep: true});

  const contentHasVariants = computed(() => {
    return props.content && props.content.some((c) => typeof c.number === 'string');
  });

  const filteredContent = computed(() => {
    if (contentHasVariants.value) {
      const variant = props.answer?.answer?.variant;
      return props.content.filter((group) => variant == group.number || !group.number);
    } else {
      return props.content;
    }
  });

  const itemStat = (item) => {
    const selected = typeof scores.value[item.id] === 'number' ? scores.value[item.id] : 0;
    const maxVariant = item.variants.slice().sort((a, b) => b.score - a.score)[0];
    return maxVariant ? selected + '/' + maxVariant.score : '0/0';
  };

  const onScore = (item, value) => {
    scores.value[item.id] = value;
    emit('scores-change', scores.value);
  };
</script>

<style lang="scss">
  .freeAnswer-criteria {
    .collapseIcon {
      width: 0.75rem;
      transform: rotate(0deg);
      transition: all 350ms ease-out;
    }

    .collapseIcon .svg-icon {
      width: 0.75rem;
      color: #818999;
    }

    .collapseIcon.collapsed {
      transform: rotate(-180deg);
    }

    p:last-child {
      margin-bottom: 0;
    }

    [type='radio'] {
      position: absolute;
      left: -9999px;
    }

    [type='radio'] + label {
      position: relative;
      padding-left: 28px;
      cursor: pointer;
      line-height: 20px;
      display: inline-block;
      color: #dcdee0;
    }

    [type='radio'] + label::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 1.5rem;
      height: 1.5rem;
      border: 1px solid #ddd;
      border-radius: 100%;
      background: #fff;
    }

    [type='radio'] + label::after {
      content: '';
      width: 0.75rem;
      height: 0.75rem;
      background: #fff;
      position: absolute;
      top: 0.375rem;
      left: 0.375rem;
      border-radius: 100%;
      opacity: 0;
      transform: scale(0);
      transition: all 0.2s ease;
    }

    [type='radio']:checked + label::before {
      background-color: #0576ff;
      border-color: #0576ff;
    }

    [type='radio']:checked + label::after {
      opacity: 1;
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }

  .freeAnswer-criteria-info {
    display: inline-block;
    background-color: #e6f2ff;
    padding: 0.6rem 0.8rem;
    border-radius: 0.5rem;
    width: 100%;
    margin-bottom: 1rem;
  }

  .freeAnswer-criteria-instructions {
    display: inline-block;
    background-color: #e6f2ff;
    padding: 0.6rem 0.8rem;
    border-radius: 0.5rem;
    margin-bottom: 3rem;
  }

  .freeAnswer-criteria-group:last-child .freeAnswer-criteria-instructions {
    margin-bottom: 0;
  }

  .freeAnswer-criteria-item {
    margin-bottom: 3rem;
  }

  .freeAnswer-criteria-item:last-child {
    margin-bottom: 0;
  }

  .freeAnswer-criteria-item-header {
    display: flex;
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }

  .freeAnswer-criteria-item-header-name {
    font-weight: 500;
    flex: 1;
  }

  .freeAnswer-criteria-item-header-sum {
    font-weight: 500;
    display: flex;
    width: 100px;
  }

  .freeAnswer-criteria-item-header-collapse {
    display: flex;
    width: 25px;
    align-items: flex-start;
  }

  .freeAnswer-criteria-item-variant {
    display: flex;
    margin-bottom: 1rem;
    align-items: flex-start;
  }

  .freeAnswer-criteria-item-variant:last-child {
    margin-bottom: 0;
  }

  .freeAnswer-criteria-item-variant-content {
    flex: 1;
    padding-right: 2rem;
  }

  .freeAnswer-criteria-item-variant-radio {
    display: flex;
    justify-content: center;
    width: 100px;
  }

  .freeAnswer-criteria-item-variant-score {
    display: flex;
    width: 125px;
  }
</style>
