<template>
  <div class="taskProps">
    <div class="taskProps-prop">
      <div class="taskProps-prop-name">
        Тип
      </div>

      <div>{{ taskTypeToName(task.type) }}</div>
    </div>

    <div class="taskProps-prop">
      <div class="taskProps-prop-name">
        Сложность
      </div>

      <div class="d-flex align-items-center">
        <common-complexity-icon
          :complexity="task.complexity"
          class="taskProps-complexityIcon"/>
        {{ complexityToName(task.complexity) }}
        <span v-if="task.part_name">
          , {{ task.part_name }}
        </span>
      </div>
    </div>

    <div class="taskProps-prop">
      <div class="taskProps-prop-name">
        Тема
      </div>

      <nuxt-link
        :to="`/topic/${task.topic_id}`"
        @click="onLinkClick">
        {{ task.topic_name }}
      </nuxt-link>
    </div>

    <div
      v-if="inTests.length"
      class="taskProps-prop">
      <div class="taskProps-prop-name">
        Задание в демовариантах
      </div>

      <div>
        <nuxt-link
          v-for="(test, index) in showingTests"
          :key="index"
          class="taskProps-testLink"
          :to="`/test/${test.id}`"
          @click="onLinkClick">
          {{ test.name }}
        </nuxt-link>

        <common-collapse
          v-if="inTests.length > 2"
          control-position="bottom"
          :expanded="false">
          <nuxt-link
            v-for="(test, index) in collapsedTests"
            :key="index"
            class="taskProps-testLink"
            :to="`/test/${test.id}`"
            @click="onLinkClick">
            {{ test.name }}
          </nuxt-link>

          <template #control>
            <a
              href="#"
              class="icon-text taskProps-moreTests">
              Еще {{ collapsedTests.length }}
            </a>
          </template>
        </common-collapse>
      </div>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    task: {type: Object, required: true},
    inTests: {type: Array, required: true}
  });

  const emit = defineEmits(['link-click']);

  const onLinkClick = () => emit('link-click');

  const showingTests = computed(() => props.inTests.slice(0, 2));
  const collapsedTests = computed(() => props.inTests.slice(2));
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .taskProps-prop {
    margin-bottom: 1.5rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .taskProps-prop-name {
    color: #7f838a;
    font-size: 0.875rem;
  }

  .taskProps-complexityIcon {
    margin-right: 0.3rem;
  }

  .taskProps-testLink {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 10%;
    cursor: pointer;
    display: block;
  }

  .taskProps-moreTests {
    position: relative;
    color: $color-dark !important;
    border-bottom: 1px dashed;
    transition: $transition;
  }

  .collapse.show + * > .taskProps-moreTests {
    pointer-events: none;
    opacity: 0;
  }
</style>
