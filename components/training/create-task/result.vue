<template>
  <div>Выбрано заданий</div>
  <div class="digit-panel">
    <span class="selectet-task-num">{{ ctStore.partsTaskSum }}</span>
    <span class="slash-sign">/</span>
    <span class="all-task-num">{{ allTasksNum }}</span>
  </div>

  <div class="details">
    <div v-if="!ctStore.noParts">
      {{ ctStore.partsThemeSum }} тем{{ declension(ctStore.partsThemeSum, ['а', 'ы', '']) }}
    </div>
    <div
      class="details-part"
      v-for="(part, idx) in parts"
      :key="idx">
      <span v-if="ctStore.noParts">
        {{ ctStore.partsThemeSum }} тем{{ declension(ctStore.partsThemeSum, ['а', 'ы', '']) }}
      </span>
      <span v-else>{{ part.title }}</span>
      <span>
        {{ ctStore.partTaskSum(part.id) }} задани{{ declension(ctStore.partTaskSum(part.id), ['е', 'я', 'й']) }}
      </span>
    </div>
  </div>
  <div class="achievements">
    <input-checkbox
      label="Учитывать достижения"
      :checked="false"
      id="resultAchievements"
      v-model:checked="withAchievements">
      <template #labelAfter>
        <div
          v-tooltip="{title: 'При составлении теста задания будут подобраны с учетом статистики усвоения тем'}"
          class="icon-wrapper">
          <svg-icon
            class="svg-icon"
            name="info"/>
        </div>
      </template>
    </input-checkbox>
  </div>
  <button
    class="btn btn-primary"
    @click="emit('create-task', withAchievements.checked)">
    Составить тест
  </button>
  <div
    v-if="detailsError"
    class="details-error"
    v-html="detailsError"/>
  <div class="time">
    Примерное время выполнения<br>
    {{ stringTime }} ⏱
  </div>
</template>

<script setup>
  import useCreateTaskStore from '~/stores/create-task';

  const emit = defineEmits(['create-task']);

  const withAchievements = false;

  const ctStore = useCreateTaskStore();
  const props = defineProps({
    parts: {
      type: Array,
      required: true
    },
    allTasksNum: {
      type: Number,
      default: 0
    },
    time: {
      type: Number,
      default: 0
    },
    detailsError: {
      type: String,
      default: ''
    }
  });

  const stringTime = computed(() => {
    const mins = props.time / 60;
    const hour = Math.floor(mins / 60);
    const min = Math.round(mins % 60);
    return (hour ? `${hour} час${declension(hour, ['', 'a', 'ов'])} `: '') + `${min} мин`;
  });
</script>

<style lang="scss">
  @import './assets/scss/theme';

  .create-task-result {
    user-select: none;

    .digit-panel {
      display: flex;
      align-items: center;

      .selectet-task-num {
        font-size: 80px;
        margin-right: 4px;
      }

      .slash-sign {
        font-size: 24px;
        margin-top: -4px;
      }

      .all-task-num {
        font-size: 24px;
        margin-left: 4px;
      }
    }

    .details {
      font-size: 14px;
      line-height: 28px;
      margin-bottom: 48px;

      .details-part {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;

        span {
          flex-basis: 40%;
          line-height: 1.2;

          &:last-child {
            text-align: right;
          }
        }
      }
    }

    .btn {
      margin: 24px 0 8px;
      width: 100%;
      padding: 14px auto;
    }

    .time {
      font-size: 14px;
      margin-top: 20px;
    }

    .details-error {
      color: #f85542;
      font-size: 0.875rem;
      position: absolute;
    }
  }
</style>
