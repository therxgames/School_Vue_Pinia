<template>
  <nuxt-layout name="default">
    <div
      v-if="store.fetched && store.topic.id"
      class="page-topic page-default content-container">
      <common-breadcrumbs
        :items="breadcrumbs"
        :first-arrow="false"
        direction="right"/>

      <common-columns>
        <div>
          <topic-top
            :topic="store.topic"
            :title="store.title"
            :step="step"
            :need-scoring="needScoring"
            @print="print"/>
        </div>
      </common-columns>

      <common-columns>
        <div class="page-topic-tasks">
          <div v-if="needScoring">
            <div v-if="scoringTask">
              <h3 class="mb-4">
                Критерии оценивания
              </h3>

              <task-item
                ref="scoringTaskRef"
                :task="scoringTask.task"
                :mode="'single'"
                :preview="true"
                :answer="scoringTask.answer"
                style="border: 0; padding: 0;"
                @answer-change="onAnswerChange(scoringTask.task.id, $event)"
                @toggle-favorite="toggleTaskFavorite"/>
            </div>

            <div v-else>
              <task-item
                ref="scoringTasksRefs"
                v-for="info in freeAnswerTasks"
                :key="info.task.id"
                :task="info.task"
                :mode="'single'"
                :preview="true"
                :answer="info.answer"
                @answer-change="onAnswerChange(info.task.id, $event)"
                @toggle-favorite="toggleTaskFavorite"/>
            </div>
          </div>

          <topic-results-summary
            v-else-if="step === topicSteps.RESULT"
            :tasks="selectedTasks"
            :answers="answers"
            :time="time"
            @back="back"/>

          <common-results-filters
            v-if="!needScoring && step === topicSteps.RESULT"
            :correctness-filter="correctnessFilter"
            :show-solutions="showSolutions"
            @correctness-filter-change="correctnessFilter = $event"
            @toggle-solutions="toggleSolutions"/>

          <div v-if="!needScoring && pagedTasks.length">
            <template
              v-for="(task, index) in pagedTasks"
              :key="index">
              <task-item-title
                v-if="showZeroPageTitle(task, pagedTasks) && !isSingleZeroPage(task, pagedTasks)"/>

              <task-item
                ref="taskRefs"
                :show-zero-page="showZeroPageTitle(task, pagedTasks)"
                :single-zero-page="isSingleZeroPage(task, pagedTasks)"
                :task="task"
                mode="multiple"
                :answer="answerById(task.id)"
                :preview="step === topicSteps.SELECTION || step === topicSteps.RESULT"
                :show-no-answer="step !== topicSteps.SELECTION"
                :class="{'taskItem--last': isLastZeroPageTask(task, pagedTasks)}"
                :tag="task.part_name"
                @answer-change="onAnswerChange(task.id, $event)"
                @toggle-favorite="toggleTaskFavorite"/>
            </template>
          </div>

          <div
            v-else-if="!needScoring && (filtersInvolved || step === topicSteps.RESULT)"
            style="padding: 1.5rem; background-color: #f2f5fa; border-radius: 0.5rem;">
            Отсутствуют
          </div>
        </div>
        <div>
          <common-sticky-column>
            <topic-scoring-stat
              v-if="needScoring"
              :free-answer-tasks="freeAnswerTasks"
              :scoring-task="scoringTask"
              @score-task="scoreTask"
              @return-to-tasks="returnToTasks"
              @save="saveScore"/>

            <topic-filters
              v-if="step === topicSteps.SELECTION"
              ref="filtersRef"
              :all-filters="allFilters"
              :filters="filters"
              :selected="selectedTasks.length"
              :total="store.topic.tasks.length"
              :step="step"
              style="margin-bottom: 2rem;"
              @start="onStart"
              @change="onFiltersChange"/>

            <topic-stat
              v-if="step === topicSteps.INTERACTION"
              :answers="answers"
              :tasks="selectedTasks"
              style="margin-bottom: 2rem;"
              @end="onEnd"/>

            <topic-banner/>
          </common-sticky-column>
        </div>
      </common-columns>

      <common-pagination
        v-if="pagedTasks.length < pagination.total"
        :list="pagedTasks"
        :pagination="pagination"
        :per-page="PER_PAGE"
        :per-page-add="PER_PAGE"
        class="page-topic-pagination"
        @page="onPage"
        @show-more="onShowMore"/>

      <common-columns>
        <topic-recommended-tasks
          v-if="store.recommendedTasks.length"
          :tasks="store.recommendedTasks"
          :fetching="store.fetchingRecommended"
          @toggle-favorite="toggleRecommendedTaskFavorite"/>
      </common-columns>
    </div>
  </nuxt-layout>
</template>

<script setup>
  import useTopicStore from '~/stores/topic';
  import useCommonStore from '~/stores/common';
  import useUserStore from '~/stores/user';
  import {localServer} from '~/utils/local-server';

  const store = useTopicStore();
  const userStore = useUserStore();
  const route = useRoute();
  const router = useRouter();
  const PER_PAGE = 10;
  const currentPage = ref(1);
  const currentStart = ref(0);
  const currentEnd = ref(PER_PAGE);
  const step = ref(topicSteps.SELECTION);
  const answers = ref([]);
  const startTime = ref(null);
  const time = ref(null);
  const correctnessFilter = ref(1);
  const showSolutions = ref(false);
  const taskRefs = ref([]);
  const filtersRef = ref(null);
  const preventScrollingToTop = ref(false);

  const filters = ref({
    year: [],
    complexity: [],
    taskType: []
  });

  const selectedTasks = computed(() => {
    return store.topic.tasks?.filter((task) => {
      if (filters.value.year.length) {
        if (!filters.value.year.includes(task.year)) {
          return false;
        }
      }

      if (filters.value.complexity.length) {
        if (!filters.value.complexity.includes(task.complexity)) {
          return false;
        }
      }

      if (filters.value.taskType.length) {
        if (!filters.value.taskType.includes(task.type)) {
          return false;
        }
      }

      return true;
    }) || [];
  });

  const filteredTasks = computed(() => {
    const sorted = sortTasks(selectedTasks.value, 'zeroPage');

    if (step.value !== topicSteps.RESULT) {
      return sorted;
    }

    return sorted.filter((task) => {
      const answer = answers.value.find((answer) => answer.task_id === task.id);

      if (answer) {
        if (correctnessFilter.value == 1) {
          return true;
        } else if (correctnessFilter.value == 2 && answer.result === 'correct') {
          return true;
        } else if (correctnessFilter.value == 3 && answer.result === 'wrong') {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    });
  });

  const breadcrumbs = computed(() => {
    const res = [];

    if (step.value === topicSteps.RESULT) {
      res.push({title: 'Достижения'});
    }

    res.push({
      title: `${store.topic.parallel_id} класс`,
      to: `/library/subjects?classes=${store.topic.parallel_id}`
    },
    {
      title: store.topic.subject_name || 'Предмет',
      to: `/library/subjects?subjects=${store.topic.subject_id}`
    });

    return res;
  });

  const allFilters = computed(() => {
    const res = {
      years: [],
      complexityTypes: [],
      taskTypes: []
    };

    store.topic.tasks.forEach((task) => {
      if (!res.years.includes(task.year)) {
        res.years.push(task.year);
      }

      if (!res.complexityTypes.includes(task.complexity)) {
        res.complexityTypes.push(task.complexity);
      }

      if (!res.taskTypes.includes(task.type)) {
        res.taskTypes.push(task.type);
      }
    });

    return res;
  });

  const filtersInvolved = computed(() => {
    return filters.value.year.length > 0
      || filters.value.complexity.length > 0
      || filters.value.taskType.length > 0;
  });

  const pagedTasks = computed(() => {
    return filteredTasks.value.slice(currentStart.value, currentEnd.value);
  });

  const pagination = computed(() => ({
    total: filteredTasks.value.length,
    current: currentPage.value,
    per_page: PER_PAGE,
    last_page: Math.ceil(filteredTasks.value.length / PER_PAGE)
  }));

  const lastByDescription = (task, id) => {
    const normalizedTasks = getNumByDesc(pagedTasks.value)[task.zeropage_text];

    if (!normalizedTasks) {
      return;
    }

    return normalizedTasks.find((key, idx) => {
      return key >= id + 1 && normalizedTasks[idx + 1] !== key + 1;
    });
  };

  definePageMeta({
    middleware: ['topic-exists', 'topic-not-empty']
  });

  watch(correctnessFilter, () => {
    onPage(1);
  });

  watch(
    () => pagination.value.current,
    async () => {
      if (preventScrollingToTop.value) {
        preventScrollingToTop.value = false;
        return;
      }
      await nextTick();
      window.scrollTo({top: 100, behavior: 'smooth'});
    }
  );

  onMounted(async () => {
    watch(() => pagedTasks.value, (tasks) => {
      store.fetchRecommended(tasks?.map((task) => task.id));
    }, {immediate: true});
  });

  onBeforeUnmount(() => {
    if (router.currentRoute.value.name !== 'topic-id') {
      store.$reset();
    }
  });

  const separationOnTaskGroup = (task, index, part) => {
    return task?.zeropage_text !== part[index - 1]?.zeropage_text && task.zeropage_text && !(!!task?.zeropage_text && (task?.zeropage_text !== part[index + 1]?.zeropage_text));
  };

  const showDescription = (task, index, part) => {
    return !!task?.zeropage_text && (task?.zeropage_text !== part[index - 1]?.zeropage_text);
  };

  const isFirst = (task, index, part) => {
    const isExistTwoInTheRow = task?.zeropage_text && !!part[index + 1];
    const isTwoInTheRowEqual = isExistTwoInTheRow && part[index + 1]?.zeropage_text === task?.zeropage_text;
    if (isTwoInTheRowEqual) return false;
    if (index === 0) return true;
    const isTwoPrevExist = !!part[index - 1]?.zeropage_text && !!part[index - 2]?.zeropage_text;
    const isTwoPrevNotEqualCurrent = task?.zeropage_text !== part[index - 1]?.zeropage_text;
    const isTwoPrevEqual = isTwoPrevExist && isTwoPrevNotEqualCurrent && part[index - 2]?.zeropage_text === part[index - 1]?.zeropage_text;
    return isTwoPrevEqual;
  };

  const isPreBlock = (index, part) => {
    return !!part[index + 1]?.zeropage_text && separationOnTaskGroup(part[index + 1], index + 1, part);
  };

  const getNumByDesc = (part, addition = 0) => {
    if (!part) {
      return {};
    }
    const normalazedByDesc = part.reduce((res, item, id) => {
      if (!item.zeropage_text) {
        return res;
      }
      if (!res[item.zeropage_text]) {
        res[item.zeropage_text] = [];
      }

      res[item.zeropage_text].push(id + 1 + addition);

      return res;
    }, {});
    return normalazedByDesc;
  };

  const onPage = (page) => {
    currentPage.value = page;
    currentStart.value = Math.floor((currentPage.value - 1) * PER_PAGE);
    currentEnd.value = Math.floor((currentPage.value - 1) * PER_PAGE + PER_PAGE);

    if (showSolutions.value) {
      nextTick(() => {
        taskRefs.value.forEach((taskItem) => {
          taskItem.setShowSolution(showSolutions.value);
        });
      });
    }
  };

  const onShowMore = (page) => {
    preventScrollingToTop.value = true;
    currentPage.value = page;
    currentEnd.value += PER_PAGE;
  };

  const onStart = () => {
    step.value = topicSteps.INTERACTION;
    onPage(1);
    answers.value = [];
    window.scrollTo(0, 0);
    startTime.value = Date.now();
    time.value = null;
  };

  const onEnd = async () => {
    eventBus.emit('loader:show');

    if (userStore.logged) {
      try {
        const newAnswers = [];

        for (let i = 0; i < answers.value.length; i++) {
          const answer = answers.value[i];

          if ((!answer.answer || (Array.isArray(answer.answer) && !answer.answer.length)) && !answer.files) {
            continue;
          }

          if (answer.result) {
            continue;
          }

          const formData = new FormData();

          formData.append('answer', JSON.stringify(answer.answer));
          formData.append('check', true);

          if (answer.files) {
            answer.files.forEach((file) => {
              formData.append('files[]', file);
            });
          }

          const response = await useApi(`/api/task/${answer.task_id}/answer`, {formData});

          if (response.data.done) {
            const newAnswer = {...answer};
            newAnswer.id = response.data.id;
            newAnswer.result = response.data.result;

            if (newAnswer.files) {
              newAnswer.filenames = newAnswer.files.map((file) => {
                return {
                  filename: URL.createObjectURL(file),
                  original_name: file.name,
                  filesize: file.size
                };
              });
            }

            newAnswers.push(newAnswer);
          }
        }

        answers.value = newAnswers;
      } catch (e) {
        console.log(e.message);
      }
    } else {
      const newAnswers = [];

      for (let i = 0; i < answers.value.length; i++) {
        const answer = answers.value[i];

        if ((!answer.answer || (Array.isArray(answer.answer) && !answer.answer.length)) && !answer.files) {
          continue;
        }

        if (answer.result) {
          continue;
        }

        const task = store.topic.tasks.find((task) => task.id === answer.task_id);
        const response = await localServer.addAnswer(0, answer.task_id, task.version_number, answer.answer, answer.files, true, task);

        if (response) {
          const newAnswer = {...answer};
          newAnswer.id = response.id;
          newAnswer.result = response.result;

          if (newAnswer.files) {
            newAnswer.filenames = newAnswer.files.map((file) => {
              return {
                filename: URL.createObjectURL(file),
                original_name: file.name,
                filesize: file.size
              };
            });
          }

          newAnswers.push(newAnswer);
        }
      }

      answers.value = newAnswers;
    }

    if (needScoring.value) {
      await nextTick();
      scoringTasksRefs.value.forEach((taskItem) => {
        taskItem.setShowSolution(true);
      });
    }

    taskRefs.value.forEach((taskItem) => {
      const answer = answers.value.find((a) => a.id === taskItem.task.id);

      if (answer) {
        taskItem.store.setResult(answer.result);
        taskItem.step = 'result';
      }

      taskItem.setShowSolution(false);
    });

    time.value = Date.now() - startTime.value;
    step.value = topicSteps.RESULT;
    showSolutions.value = false;

    eventBus.emit('loader:hide');
    window.scrollTo(0, 0);
  };

  const onFiltersChange = (newFilters) => {
    filters.value = newFilters;
    onPage(1);
  };

  const onResetFilters = () => {
    correctnessFilter.value = 1;
    filtersRef.value.reset();
    onPage(1);
  };

  const answerById = (id) => {
    const answer = answers.value.find((a) => a.task_id === id);

    if (answer) {
      return answer;
    } else {
      return {
        id: null,
        task_id: id,
        answer: null,
        files: null
      };
    }
  };

  const onAnswerChange = (id, answer) => {
    const seen = answers.value.find((a) => a.task_id === id);

    if (seen) {
      answers.value.splice(answers.value.indexOf(seen), 1, answer);
    } else {
      answers.value.push({
        task_id: id,
        ...answer
      });
    }
  };

  const freeAnswerTasks = computed(() => {
    const res = [];

    if (selectedTasks.value) {
      selectedTasks.value.forEach((task, index) => {
        if (task.type === 'FREE_ANSWER') {
          const answer = answerById(task.id);
          if (answer && (answer.answer || answer.filenames)) {
            const score = answer.answer ? answer.answer.score : 0;
            const groups = getCriteriaGroups(task, answer?.answer?.variant);
            const maxScore = groups ? groups.reduce((acc, group) => acc + group.maxScore, 0) : 0;

            res.push({
              num: index + 1,
              task,
              score,
              maxScore,
              answer
            });
          }
        }
      });
    }

    return res;
  });

  const needScoring = computed(() => {
    return freeAnswerTasks.value.some((info) => {
      if (info.answer.result === 'scoring') {
        return true;
      }
    });
  });

  const scoringTasksRefs = ref([]);
  const scoringTaskRef = ref(null);
  const scoringTaskNum = ref(null);

  const scoringTask = computed(() => {
    let res = freeAnswerTasks.value.find((task) => task.num === scoringTaskNum.value);

    if (res) {
      let index = freeAnswerTasks.value.indexOf(res);
      res = {...res};

      if (index < freeAnswerTasks.value.length - 1) {
        res.nextNum = freeAnswerTasks.value[index + 1].num;
      } else {
        res.nextNum = null;
      }
    }

    return res;
  });

  const scoreTask = async (num) => {
    scoringTaskNum.value = num;
    await nextTick();
    scoringTaskRef.value.setStep('scoring');
    scoringTaskRef.value.setShowSolution(true);
    window.scrollTo(0, 0);
  };

  const returnToTasks = async () => {
    scoringTaskNum.value = null;
    await nextTick();
    scoringTasksRefs.value.forEach((taskItem) => {
      taskItem.setShowSolution(true);
    });
    window.scrollTo(0, 0);
  };

  const toggleSolutions = () => {
    showSolutions.value = !showSolutions.value;

    taskRefs.value.forEach((taskItem) => {
      taskItem.setShowSolution(showSolutions.value);
    });
  };

  const toggleTaskFavorite = async (context) => {
    context.setProgress(true);
    const res = await toggleFavorite(context.task.parent_id, 'task', !context.task.is_favorite);

    if (res) {
      store.setTaskField(context.task.id, 'is_favorite', !context.task.is_favorite);
    }
    context.setProgress(false, 150);
  };

  const toggleRecommendedTaskFavorite = async (context) => {
    context.setProgress(true);
    const res = await toggleFavorite(context.data.parent_id, 'task', !context.data.is_favorite);

    if (res) {
      store.setTaskField(context.data.id, 'is_favorite', !context.data.is_favorite);
      store.setRecommendedTaskField(context.data.id, 'is_favorite', !context.data.is_favorite);
    }
    context.setProgress(false, 150);
  };

  const back = () => {
    window.location.reload();
  };

  const print = () => {
    printTopic(route.params.id, selectedTasks.value);
  };

  const saveScore = async () => {
    let notScoredTasks = 0;

    freeAnswerTasks.value.forEach((task) => {
      if (!task.answer.answer.scores) {
        notScoredTasks++;
      }
    });

    let content = '';

    if (notScoredTasks > 0) {
      content += `У вас не проставлены баллы у ${notScoredTasks} ${declension(notScoredTasks, ['задания', 'заданий', 'заданий'])}. Задания без проверки будут оценены в 0 баллов.<br><br>`;
    }

    content += `После сохранения невозможно будет изменить результаты проверки.`;

    eventBus.emit('alert:show', {
      title: 'Завершение оценки',
      content,
      buttons: [
        {
          title: 'Подтвердить',
          class: 'btn-simple',
          async click(modal, context) {
            context.hide();
            await postScore();
          }
        },
        {
          title: 'Отмена',
          click(modal, context) {
            context.hide();
          }
        }
      ]
    });
  };

  const postScore = async () => {
    eventBus.emit('loader:show');

    if (userStore.logged) {
      try {
        const newAnswers = [];

        for (let i = 0; i < freeAnswerTasks.value.length; i++) {
          const info = freeAnswerTasks.value[i];
          const answer = info.answer;

          if (!answer.id) {
            continue;
          }

          if (typeof answer.answer.maxScore !== 'number') {
            answer.answer.maxScore = info.maxScore;
          }

          const response = await useApi(`/api/answer/${answer.id}/patch`, {
            ...methodPatch,
            body: {
              answer: JSON.stringify(answer.answer)
            }
          });

          if (response.data.done) {
            const newAnswer = {...answer};
            newAnswer.score = newAnswer.answer.score;

            if (newAnswer.score > 0) {
              newAnswer.result = 'correct';
            } else {
              newAnswer.result = 'wrong';
            }

            newAnswers.push(newAnswer);
          }
        }

        newAnswers.forEach((answer) => {
          onAnswerChange(answer.task_id, answer);
        });
      } catch (e) {
        console.log(e.message);
      }
    } else {
      const newAnswers = [];

      for (let i = 0; i < freeAnswerTasks.value.length; i++) {
        const info = freeAnswerTasks.value[i];
        const answer = info.answer;

        if (!answer.id) {
          continue;
        }

        localServer.patchAnswer(answer.id, {
          answer: answer.answer
        }, true, info.task);

        const newAnswer = {...answer};
        newAnswer.score = newAnswer.answer.score;

        if (newAnswer.score > 0) {
          newAnswer.result = 'correct';
        } else {
          newAnswer.result = 'wrong';
        }

        newAnswers.push(newAnswer);
      }

      newAnswers.forEach((answer) => {
        onAnswerChange(answer.task_id, answer);
      });
    }

    eventBus.emit('loader:hide');
    window.scrollTo(0, 0);
  };

  await useAsyncData(`topic-${route.params.id}`, () => Promise.all([
    store.fetch(route.params.id)
  ]));

  useHead({
    ...pageTitle(store.title)
  });
</script>

<style lang="scss">
  @import '/assets/scss/theme';

  .page-topic {
    padding-top: 1.125rem;
  }

  .page-topic-tasks .taskItem:not(:last-child) {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .page-topic-tasks .taskItem:not(:first-child) {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    margin-top: -1px;
  }

  .page-topic-tasks .taskItem--last:not(:last-child) {
    margin-bottom: 1.25rem;
    border-bottom-left-radius: 0.8rem !important;
    border-bottom-right-radius: 0.8rem !important;
  }

  .page-topic-tasks .taskItem--last + .taskItem {
    border-top-left-radius: 0.8rem !important;
    border-top-right-radius: 0.8rem !important;
  }

  .page-topic-pagination {
    margin-top: 2rem;
    margin-bottom: 1.5rem;
  }
</style>
