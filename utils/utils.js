import useUserStore from '~/stores/user';
import useCommonStore from '~/stores/common';
import {
  addSeconds,
  differenceInDays as diffDays,
  formatDistanceToNowStrict,
  intervalToDuration,
  isDate,
  parse,
  set
} from 'date-fns';
import {parseDate} from './parse-date';
import qs from 'query-string';
import ru from 'date-fns/locale/ru/index.js';
import _isEqual from 'lodash.isequal';
import _cloneDeep from 'lodash.clonedeep';
import _shuffle from 'lodash.shuffle';

export const getObjectsDiff = (obj1, obj2) => {
  if (!obj1 || !obj2) {
    return [];
  }
  return Object.keys(obj1).reduce((result, key) => {
    if (!Object.hasOwn(obj2, key)) {
      result.push(key);
    } else if (_isEqual(obj1[key], obj2[key])) {
      const resultKeyIndex = result.indexOf(key);
      result.splice(resultKeyIndex, 1);
    }
    return result;
  }, Object.keys(obj2));
};

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const listLast = (list, clone = false) => {
  if (Array.isArray(list)) {
    return clone
      ? _cloneDeep(list[list.length - 1])
      : list[list.length - 1];
  }
  return null;
};

export const getUserSetting = (key, def = null) => useUserStore().getSetting(key, def);

export const setUserSetting = (key, def, options = undefined) => useUserStore().setSetting(key, def, options);

export const differenceInDays = (date, format = 'yyyy-MM-dd HH:mm:ss') => {
  let _date = null;

  if (typeof date === 'string') {
    _date = parse(date, format, new Date());
  }

  if (!isDate(_date)) {
    return NaN;
  }

  return diffDays(new Date(), _date);
};

export const truncateString = (str, num) => {
  if (!str) {
    return '';
  }

  if (str.length > num) {
    return str.slice(0, num) + '...';
  } else {
    return str;
  }
};

export const scrollAfterPagination = ({store, content}) => {
  return watch(
    () => store.contentRev,
    async () => {
      if (store.fetching || store.filtersChanges[0] !== 'page') {
        return;
      }
      await nextTick();
      const breakPage = content?.value.querySelector(`.delimiter[data-break-page="${store.filters.page.current}"]`);
      breakPage
        ? breakPage.scrollIntoView({behavior: 'smooth'})
        : window.scrollTo({top: 100, behavior: 'smooth'});
    }
  );
};

export const passingTestStatus = (data = {}) => {
  const testIsFinished = data.is_finished;
  const attemptStartedAt = data.attempt_started_at || data.started_at;
  const attemptTime = data.attempt_time || data.time;
  const attemptMode = data.attempt_mode || data.mode;
  const correctness = data.correctness;
  const wrongness = data.wrongness;
  const uncheckedness = data.uncheckedness;
  const score = data.score;
  const maxScore = data.max_score;
  const scoreCorrectness = data.score_correctness;
  const tasksCount = data.tasks_count;
  const inArchive = data.in_archive || false;
  const lastActionAt = data.last_action_at;

  const id = () => {
    if (isFinished() && inArchive === false) {
      return passingTestStatusId.FINISHED;
    } else if (isFinished() === false && attemptStartedAt && inArchive === false) {
      return passingTestStatusId.CONTINUE;
    } else if (isFinished() === false && inArchive === false) {
      return passingTestStatusId.START;
    } else if (inArchive) {
      return passingTestStatusId.UNAVAILABLE;
    }
  };

  const isFinished = () => {
    return testIsFinished === true && attemptStartedAt;
  };

  const answeredCount = () => {
    return correctness + wrongness + uncheckedness;
  };

  const finishedScore = () => {
    if (maxScore && maxScore !== 0 && scoreCorrectness && scoreCorrectness !== 0) {
      return Math.ceil(((correctness - scoreCorrectness) + score / maxScore * scoreCorrectness) * 100 / tasksCount);
    } else {
      return Math.ceil(correctness * 100 / tasksCount);
    }
  };

  const finishedMark = () => {
    if (finishedScore() === 0 && answeredCount() === 0) {
      return 'f';
    } else if (finishedScore() >= 0 && finishedScore() <= 55) {
      return 'f';
    } else if (finishedScore() > 55 && finishedScore() <= 80) {
      return 'c';
    } else if (finishedScore() > 80) {
      return 'a';
    }
  };

  const progress = () => {
    return Math.ceil((answeredCount() * 100) / tasksCount);
  };

  const duration = () => {
    let time = attemptTime || 0;

    if (attemptMode === 'control') {
      time = passingTestDuration(data).seconds - time;
    }

    const interval = intervalToDuration({start: 0, end: time * 1000});

    return interval.hours.toString().padStart(2, '0') + ':'
      + interval.minutes.toString().padStart(2, '0') + ':'
      + interval.seconds.toString().padStart(2, '0')
  };

  return {
    id: id(),
    isContinue: (() => id() === passingTestStatusId.CONTINUE)(),
    isFinished: (() => id() === passingTestStatusId.FINISHED)(),
    isStart: (() => id() === passingTestStatusId.START)(),
    isUnavailable: (() => id() === passingTestStatusId.UNAVAILABLE)(),
    answeredCount: answeredCount(),
    finishedScore: finishedScore(),
    finishedMark: finishedMark(),
    progress: progress(),
    duration: duration(),
    correctness,
    wrongness,
    lastActionAt
  };
};

export const passingTestDuration = (data = {}) => {
  const seconds = data?.allotted_time || 1200;

  return {
    seconds,
    minutes: seconds / 60,
    distance: formatDistanceToNowStrict(
      addSeconds(new Date(), seconds),
      {
        unit: 'minute',
        locale: ru
      }
    )
  };
}

export const getTestAutoTags = (data = {}) => {
  const tags = [];

  if (data.type === 'demovariant') {
    tags.push({
      name: `Демовариант`,
      link: {
        href: `/training?category=demovariant`
      }
    });
  }

  switch (data.attestation) {
    case 'oge': {
      tags.push({
        name: attestationToName(data.attestation),
        link: {
          href: '/training?attestation=oge&category=demovariant'
        }
      });
      break;
    }
    case 'vpr': {
      tags.push({
        name: attestationToName(data.attestation),
        link: {
          href: '/training?attestation=vpr&category=demovariant'
        }
      });
      break;
    }
  }

  if (data.parallel_id) {
    tags.push({
      name: `${data.parallel_id} класс`,
      link: {
        href: `/training?classes=${data.parallel_id}`
      }
    });
  }

  if (data.class) {
    let href = `/training?classes=${data.class}&category=demovariant`;

    if (data.attestation) {
      href += `&attestation=${data.attestation}`;
    }

    tags.push({
      name: `${data.class} класс`,
      link: {href}
    });
  }

  if ((data.subject_name || data.subject) && data.subject_id) {
    tags.push({
      name: data.subject_name || data.subject,
      link: {
        href: `/training?subjects=${data.subject_id}&category=demovariant`
      }
    });
  }

  if (data.year) {
    let href = `/training?years=${data.year}&category=demovariant`;

    if (data.attestation) {
      href += `&attestation=${data.attestation}`;
    }

    if (data.parallel_id) {
      href += `&classes=${data.parallel_id}`;
    }

    if (data.subject_id) {
      href += `&subjects=${data.subject_id}`
    }

    tags.push({
      name: data.year,
      link: {href}
    });
  }

  return tags;
};

export const getTaskAutoTags = (data = {}) => {
  const tags = [];
  switch (data.attestation) {
    case 'oge': {
      tags.push({
        name: attestationToName(data.attestation),
        link: {
          href: '/library/tasks?attestation=oge'
        }
      });
      break;
    }
    case 'vpr': {
      tags.push({
        name: attestationToName(data.attestation),
        link: {
          href: '/library/tasks?attestation=vpr'
        }
      });
      break;
    }
  }

  if (data.parallel_id) {
    tags.push({
      name: `${data.parallel_id} класс`,
      link: {
        href: `/library/tasks?classes=${data.parallel_id}`
      }
    });
  }

  if (data.subject_name && data.subject_id) {
    tags.push({
      name: data.subject_name,
      link: {
        href: `/library/tasks?subjects=${data.subject_id}`
      }
    });
  }

  if (data.year) {
    let href = `/library/tasks?years=${data.year}`;

    if (data.attestation) {
      href += `&attestation=${data.attestation}`;
    }

    if (data.parallel_id) {
      href += `&classes=${data.parallel_id}`;
    }

    if (data.subject_id) {
      href += `&subjects=${data.subject_id}`
    }

    href += '&ac=1';

    tags.push({
      name: data.year,
      link: {href}
    });
  }

  if (data.type) {
    let href = `/library/tasks?type=${data.type}`;

    if (data.attestation) {
      href += `&attestation=${data.attestation}`;
    }

    if (data.parallel_id) {
      href += `&classes=${data.parallel_id}`;
    }

    if (data.subject_id) {
      href += `&subjects=${data.subject_id}`
    }

    href += '&ac=1';

    tags.push({
      name: taskTypeToName(data.type),
      link: {href}
    });
  }

  if (data.part_name && data.part_id && data.subject_id) {
    let href = `/library/tasks?subjects=${data.subject_id}&part=${data.part_id}`;

    if (data.attestation) {
      href += `&attestation=${data.attestation}`;
    }

    if (data.parallel_id) {
      href += `&classes=${data.parallel_id}`;
    }

    if (data.subject_id) {
      href += `&subjects=${data.subject_id}`
    }

    href += '&ac=1';

    tags.push({
      name: data.part_name,
      link: {href}
    });
  }

  return tags;
};

export const getTopicAutoTags = (data = {}) => {
  const tags = [];

  switch (data.attestation) {
    case 'oge': {
      tags.push({
        name: attestationToName(data.attestation),
        link: {
          href: '/library/subjects?attestation=oge'
        }
      });
      break;
    }
    case 'vpr': {
      tags.push({
        name: attestationToName(data.attestation),
        link: {
          href: '/library/subjects?attestation=vpr'
        }
      });
      break;
    }
  }

  if (data.parallel_id) {
    tags.push({
      name: `${data.parallel_id} класс`,
      link: {
        href: `/library/subjects?classes=${data.parallel_id}`
      }
    });
  }

  if (data.subject_name && data.subject_id) {
    tags.push({
      name: data.subject_name,
      link: {
        href: `/library/subjects?subjects=${data.subject_id}`
      }
    });
  }

  return tags;
};

export const historyBackLinkIf = (expression, def = '#') => {
  try {
    if (Boolean(expression) && window.history?.state.back) {
      return window.history.state.back;
    } else {
      return def;
    }
  } catch (e) {
    return def;
  }
}

export const shuffleTaskVariants = (task) => {
  let res;

  if (task.variants && task.type) {
    if ([taskType.CHOOSE_ANSWER, taskType.GAP_MATCH_TEXT_ANSWER].includes(task.type)) {
      res = _shuffle(task.variants);
    } else if ([taskType.ORDER_ANSWER].includes(task.type)) {
      if (task.variants.length > 1) {
        let isEqual = false;
        let variants;

        do {
          variants = _shuffle(task.variants);
          isEqual = JSON.stringify(task.answer) === JSON.stringify(variants.map((variant) => variant.value.toString()));
        } while (isEqual);

        res = variants;
      } else {
        res = task.variants;
      }
    }
  }

  return res;
}

export const toRoman = (number) => {
  let result = '';
  const romanNumerals = {
    1000: 'M',
    900: 'CM',
    500: 'D',
    400: 'CD',
    100: 'C',
    90: 'XC',
    50: 'L',
    40: 'XL',
    10: 'X',
    9: 'IX',
    5: 'V',
    4: 'IV',
    1: 'I'
  };

  for (let key in romanNumerals) {
    while (number >= key) {
      result += romanNumerals[key];
      number -= key;
    }
  }

  return result;
}


export const getDateAndTime = (dateStr, timeStr) => {
  const date = parseDate(dateStr);
  const regex = /^(\d+):(\d+)$/;

  if (!date) return undefined;

  const [, hoursStr, minutesStr] = timeStr?.match(regex) || [];

  return set(date, {
    hours: Number(hoursStr) || 0,
    minutes: Number(minutesStr) || 0
  });
};

export const buildQuery = (object, options) => {
  if (!object) return '';

  const query = qs.stringify(object, {
    skipNull: true,
    arrayFormat: 'bracket',
    ...options
  });

  return query ? `?${query}` : '';
};

export const buildUrl = (path, object, options) => {
  return `${path}${buildQuery(object, options)}`;
};

export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const chunkArray = (arr, chunkSize) => {
  const result = [];

  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize));
  }

  return result;
}

export const mixins = {
  stores: {
    filters: {
      state: {
        filters: {
          content: {
            id: 'content',
            canReset: false,
            value: 'tasks',
            default: 'tasks',
            data: [
              {
                name: 'Задания',
                id: 'tasks'
              },
              {
                name: 'Тесты',
                id: 'tests'
              }
            ]
          },
          category: {
            id: 'category',
            value: null,
            dynamic: true,
            default: null,
            data: [
              {
                name: 'Демоварианты',
                id: 'demovariant'
              },
              {
                name: 'Мои тесты',
                id: 'usertest',
                authOnly: true
              }
            ]
          },
          classes: {
            id: 'classes',
            value: null,
            dynamic: true,
            default: [],
            data: [
              {
                name: '5 класс',
                short: '5',
                id: 5
              },
              {
                name: '6 класс',
                short: '6',
                id: 6
              },
              {
                name: '7 класс',
                short: '7',
                id: 7
              },
              {
                name: '8 класс',
                short: '8',
                id: 8
              },
              {
                name: '9 класс',
                short: '9',
                id: 9
              }
            ]
          },
          class: {
            id: 'class',
            value: null,
            default: null,
            data: []
          },
          subjects: {
            id: 'subjects',
            value: null,
            dynamic: true,
            default: [],
            data: [
              {
                name: 'Русский язык',
                id: 12
              },
              {
                name: 'Литература',
                id: 10
              },
              {
                name: 'Математика',
                id: 11
              },
              {
                name: 'Биология',
                id: 8
              },
              {
                name: 'Иностранный язык',
                id: 7
              },
              {
                name: 'Информатика и ИКТ',
                id: 9
              },
              {
                name: 'История',
                id: 13
              }
            ]
          },
          subject: {
            id: 'subject',
            value: null,
            default: null,
            data: []
          },
          years: {
            id: 'years',
            value: null,
            dynamic: true,
            default: [],
            data: [
              {
                id: 2023,
                name: '2023'
              },
              {
                id: 2022,
                name: '2022'
              },
              {
                id: 2021,
                name: '2021'
              },
              {
                id: 2020,
                name: '2020'
              },
              {
                id: 2019,
                name: '2019'
              },
              {
                id: 2018,
                name: '2018'
              },
              {
                id: 2017,
                name: '2017'
              }
            ]
          },
          year: {
            id: 'year',
            value: null,
            default: null,
            data: []
          },
          topics: {
            id: 'topics',
            value: null,
            default: [],
            data: []
          },
          q: {
            id: 'q',
            value: null,
            accepted: '',
            default: '',
            data: null
          },
          status: {
            id: 'status',
            value: null,
            dynamic: true,
            default: null,
            data: [
              {
                name: 'Выполненные',
                id: 'completed'
              },
              {
                name: 'Невыполненные',
                id: 'incomplete'
              },
              {
                name: 'Избранные',
                id: 'favorite'
              },
              {
                name: 'В архиве',
                id: 'archive'
              }
            ]
          },
          attestation: {
            id: 'attestation',
            value: null,
            dynamic: true,
            //default: null,
            default: null,
            data: [
              {
                name: 'ВПР',
                id: 'vpr'
              },
              {
                name: 'ОГЭ',
                id: 'oge'
              }
            ]
          },
          complexity: {
            id: 'complexity',
            value: null,
            dynamic: true,
            default: [],
            data: [
              {
                name: 'Базовая',
                id: 'simple'
              },
              {
                name: 'Средняя',
                id: 'medium'
              },
              {
                name: 'Углубленная',
                id: 'complex'
              }
            ]
          },
          publish: {
            id: 'publish',
            value: null,
            default: null,
            data: [
              {
                name: 'Опубликовано',
                id: 2
              },
              {
                name: 'Снято с публикации',
                id: 3
              }
            ]
          },
          type: {
            id: 'type',
            value: null,
            dynamic: true,
            default: [],
            data: [
              {
                name: 'Выбрать ответ',
                id: taskType.CHOOSE_ANSWER
              },
              {
                name: 'Ввести ответ',
                id: taskType.ENTER_ANSWER
              },
              {
                name: 'Свободный ответ',
                id: taskType.FREE_ANSWER
              },
              {
                name: 'Расположить по порядку',
                id: taskType.ORDER_ANSWER
              },
              {
                name: 'Вставить пропущенное',
                id: taskType.GAP_MATCH_TEXT_ANSWER
              },
              {
                name: 'Установить соответствие',
                id: taskType.GAP_MATCH_TABLE_ANSWER
              }
            ]
          },
          part: {
            id: 'part',
            value: null,
            dynamic: true,
            default: [],
            data: [],
            onReset: {
              clearData: true
            }
          },
          order: {
            id: 'order',
            canReset: false,
            value: 'popular',
            default: 'popular',
            data: [
              {
                id: 'popular',
                value: 'popular',
                name: 'Популярные'
              },
              {
                id: 'new',
                value: 'new',
                name: 'Новые'
              },
              {
                id: 'old',
                value: 'old',
                name: 'Старые'
              }
            ]
          },
          mode: {
            id: 'mode',
            fetchable: false,
            value: 'tile',
            default: 'tile',
            data: [
              {
                id: 'tile',
                name: 'Тайлы'
              },
              {
                id: 'row',
                name: 'Строки'
              }
            ]
          },
          page: {
            id: 'page',
            value: 1,
            default: 1,
            total: 0,
            current: 1,
            last_page: 1,
            per_page: 20,
            append: false,
            data: []
          },
          ac: {
            id: 'ac',
            canReset: false,
            fetchable: false,
            value: false,
            default: false,
            data: []
          },
          f: {
            id: 'f',
            canReset: false,
            fetchable: false,
            value: false,
            default: false,
            data: []
          }
        },
        presets: {},
        queriesTimeline: [],
        filtersFetched: false,
        fetchingParts: false
      },
      getters: {
        getFilterValue() {
          return (id) => {
            if (!this.filters[id]) {
              console.warn('getFilterValue -> no filter found', id);
              return null;
            }
            return _cloneDeep(this.filters[id].value || this.filters[id].default);
          };
        },
        getFilterData() {
          return (id) => {
            if (!this.filters[id]) {
              console.warn('getFilterData -> no filter found', id);
              return null;
            }
            return _cloneDeep(this.filters[id].data)
          };
        },
        filtersInvolved() {
          if (typeof this.filtersOptions?.filtersInvolved === 'function') {
            return this.filtersOptions.filtersInvolved(this);
          }

          return this.getFilterValue('classes').length > 0
            || this.getFilterValue('class') !== null
            || this.getFilterValue('subjects').length > 0
            || this.getFilterValue('subject') !== null
            || this.getFilterValue('years').length > 0
            || this.getFilterValue('year') !== null
            || this.getFilterValue('q').length > 0
            || this.filters.q.accepted.length > 0
            || this.getFilterValue('status') !== null
            || this.getFilterValue('complexity').length > 0
            || this.getFilterValue('type').length > 0
            || this.getFilterValue('part').length > 0
            || this.getFilterValue('attestation') !== null
            || (this.getFilterValue('category') !== null && useUserStore().logged);
        },
        filtersChanges() {
          return getObjectsDiff(
            JSON.parse(this.queriesTimeline[0] || '{}'),
            JSON.parse(this.queriesTimeline[1] || '{}')
          );
        },
        filtersChangesIsFechable() {
          return this.filtersChanges.some((filterName) => this.filterIsFetchable(filterName));
        },
        filtersError() {
          let error = '';

          for (let id in this.filters) {
            if (!Object.hasOwn(this.filters, id)) {
              continue;
            }

            switch (id) {
              case 'class':
              case 'classes': {
                if (
                  this.filters.attestation.value === attestation.VPR
                  && this.filters.classes.value?.length > 0
                  && _isEqual(this.filters.classes.value, [9])
                ) {
                  error = lexicon.errors.vpr_class_wrong;
                }

                if (
                  this.filters.attestation.value === attestation.OGE
                  && this.filters.classes.value?.length > 0
                  && !this.filters.classes.value.includes(9)
                ) {
                  error = lexicon.errors.oge_class_wrong;
                }
              }
            }
          }

          return error;
        },
        filtersIsValid() {
          return this.filtersError === '';
        },
        orderValue() {
          const orderValue = this.filters.order.data.find((value) => value.id === this.filters.order.value);
          return orderValue?.value;
        },
        builtFilters() {
          const builtFilters = {};

          this.filtersOptions?.build?.onApiQueryBegin?.call(null);

          if (this.filters.attestation.value) {
            builtFilters['attestation'] = this.filters.attestation.value;
          }

          if (this.filters.category.value) {
            builtFilters['type'] = this.filters.category.value;
          }

          if (Array.isArray(this.filters.classes.value) && this.filters.classes.value.length) {
            builtFilters['parallel_id'] = this.filters.classes.value.join(',');
          }

          if (this.filters.class.value) {
            builtFilters['parallel_id'] = this.filters.class.value;
          }

          if (Array.isArray(this.filters.subjects.value) && this.filters.subjects.value.length) {
            builtFilters['subject_id'] = this.filters.subjects.value.join(',');
          }

          if (this.filters.subject.value) {
            builtFilters['subject_id'] = this.filters.subject.value;
          }

          if (Array.isArray(this.filters.years.value) && this.filters.years.value.length) {
            builtFilters['years'] = this.filters.years.value.join(',');
          }

          if (this.filters.year.value) {
            builtFilters['year'] = this.filters.year.value;
          }

          if (this.filters.q.value) {
            let searchValue = this.filters.q.value;

            if (
              searchValue.match(/^#\d+$/)
              || searchValue.match(/^t\d+$/)
              || searchValue.match(/^№\d+$/)
            ) {
              searchValue = searchValue.replace(/^\D+/g, '');
            }
            builtFilters['find'] = searchValue;
          }

          if (Array.isArray(this.filters.complexity.value) && this.filters.complexity.value.length) {
            builtFilters['complexity'] = this.filters.complexity.value.join(',');
          }

          if (Array.isArray(this.filters.part.value) && this.filters.part.value.length) {
            builtFilters['part_id'] = this.filters.part.value.join(',');
          }

          if (this.filters.status.value && this.filters.status.value !== 'all') {
            if (['completed', 'incomplete'].includes(this.filters.status.value)) {
              if (this.filters.status.value === 'completed') {
                builtFilters['has_correct_answer'] = 'true';
              }
              if (this.filters.status.value === 'incomplete') {
                builtFilters['has_correct_answer'] = 'false';
              }
            } else {
              builtFilters['status'] = this.filters.status.value;
            }
          }

          if (this.filters.topics.value && this.filters.topics.value.length) {
            builtFilters['topic_id'] = this.filters.topics.value.join(',');
          }

          if (this.orderValue) {
            builtFilters['sort'] = this.orderValue;
          }

          if (Array.isArray(this.filters.type.value) && this.filters.type.value.length) {
            builtFilters['type'] = this.filters.type.value.join(',');
          }

          if (this.filters.page.current) {
            builtFilters['page'] = this.filters.page.current;
          }

          this.filtersOptions?.build?.onBuild?.call(null, builtFilters);

          return builtFilters;
        },
        filtersQuery() {
          const query = {};

          this.filtersOptions?.build?.onQueryBegin?.call(null);

          if (this.filters.attestation.value) {
            query['attestation'] = this.filters.attestation.value;
          }

          if (this.filters.category.value) {
            query['category'] = this.filters.category.value;
          }

          if (this.filters.content.value && this.filters.content.value !== this.filters.content.default) {
            query['content'] = this.filters.content.value;
          }

          if (Array.isArray(this.filters.classes.value) && this.filters.classes.value.length) {
            query['classes'] = this.filters.classes.value.join(',');
          }

          if (this.filters.class.value) {
            query['classes'] = this.filters.class.value;
          }

          if (Array.isArray(this.filters.subjects.value) && this.filters.subjects.value.length) {
            query['subjects'] = this.filters.subjects.value.join(',');
          }

          if (this.filters.subject.value) {
            query['subjects'] = this.filters.subject.value;
          }

          if (Array.isArray(this.filters.years.value) && this.filters.years.value.length) {
            query['years'] = this.filters.years.value.join(',');
          }

          if (this.filters.year.value) {
            query['year'] = this.filters.year.value;
          }

          if (this.filters.q.accepted) {
            query['q'] = this.filters.q.accepted;
          }

          if (this.filters.status.value && this.filters.status.value !== 'all') {
            query['status'] = this.filters.status.value;
          }

          if (this.filters.topics.value && this.filters.topics.value.length) {
            query['topics'] = this.filters.topics.value.join(',');
          }

          if (this.filters.order.value && this.filters.order.value !== 'popular') {
            query['order'] = this.filters.order.value;
          }

          if (this.filters.mode.value && this.filters.mode.value !== 'tile') {
            query['mode'] = this.filters.mode.value;
          }

          if (Array.isArray(this.filters.complexity.value) && this.filters.complexity.value.length) {
            query['complexity'] = this.filters.complexity.value.join(',');
          }

          if (Array.isArray(this.filters.type.value) && this.filters.type.value.length) {
            query['type'] = this.filters.type.value.join(',');
          }

          if (Array.isArray(this.filters.part.value) && this.filters.part.value.length) {
            query['part'] = this.filters.part.value.join(',');
          }

          if (this.filters.page.current && this.filters.page.current > 1) {
            query['page'] = this.filters.page.current;
          }

          if (typeof this.filters.ac.value === 'boolean' && this.filters.ac.value === true) {
            query['ac'] = '1';
          }

          if (typeof this.filters.f.value === 'boolean' && this.filters.f.value === true) {
            query['f'] = '1';
          }

          this.filtersOptions?.build?.onQuery?.call(null, query);

          return query;
        }
      },
      actions: {
        async getOrFetchFilters() {
          const response = await useCommonStore().resolveFilters();

          if (response.data.done) {
            response.data.years && this.setFilterData('years', response.data.years);
            response.data.subjects && this.setFilterData('subjects', response.data.subjects);
            response.data.classes && this.setFilterData('classes', response.data.classes);

            response.data.years && this.setFilterData('year', response.data.years);
            response.data.subject && this.setFilterData('subject', response.data.subjects);
            response.data.classes && this.setFilterData('class', response.data.classes);
          }

          this.filtersFetched = true;
          return response.data.done;
        },
        async fetchSubjectParts(id) {
          this.fetchingParts = true;

          try {
            const response = await useApi(`/api/subject/${id}/parts`, {...methodGet});
            if (response.data.done) {
              this.setFilterData('part', response.data.parts);
            }
          } catch (e) {
            console.log(e.message);
          }

          this.fetchingParts = false;
        },
        async mergeFiltersWith(data) {
          if (!data || typeof data !== 'object' || !Object.keys(data).length) {
            return;
          }

          let nValue;
          let fValue;

          if (typeof this.filtersOptions?.merge?.onMergeStart === 'function') {
            this.filtersOptions.merge.onMergeStart(data);
          }

          fValue = this.filters.attestation.value;
          nValue = this.getNormalizedFilterValue('attestation', data.attestation || fValue);
          nValue
            ? await this.setFilterValue('attestation', nValue)
            : this.resetFilter('attestation');

          fValue = this.filters.category.value;
          nValue = this.getNormalizedFilterValue('category', data.category || fValue);
          nValue
            ? await this.setFilterValue('category', nValue)
            : this.resetFilter('category');

          fValue = this.filters.content.value;
          nValue = this.getNormalizedFilterValue('content', data.content || fValue);
          nValue
            ? await this.setFilterValue('content', nValue)
            : this.resetFilter('content');

          fValue = this.filters.classes.value;
          nValue = this.getNormalizedFilterValue('classes', data.classes || fValue);
          nValue
            ? await this.setFilterValue('classes', nValue)
            : this.resetFilter('classes');

          fValue = this.filters.subjects.value;
          nValue = this.getNormalizedFilterValue('subjects', data.subjects || fValue);
          nValue
            ? await this.setFilterValue('subjects', nValue)
            : this.resetFilter('subjects');

          fValue = this.filters.years.value;
          nValue = this.getNormalizedFilterValue('years', data.years || fValue);
          nValue
            ? await this.setFilterValue('years', nValue)
            : this.resetFilter('years');

          fValue = this.filters.q.value;
          nValue = this.getNormalizedFilterValue('q', data.q);
          nValue
            ? await this.setFilterValue('q', nValue || fValue, {withAccepted: true})
            : this.resetFilter('q');

          fValue = this.filters.status.value;
          nValue = this.getNormalizedFilterValue('status', data.status || fValue);
          nValue
            ? await this.setFilterValue('status', nValue)
            : this.resetFilter('status');

          fValue = this.filters.topics.value;
          nValue = this.getNormalizedFilterValue('topics', data.topics || fValue);
          nValue
            ? await this.setFilterValue('topics', nValue)
            : this.resetFilter('topics');

          fValue = this.filters.order.value;
          nValue = this.getNormalizedFilterValue('order', data.order || fValue);
          nValue
            ? await this.setFilterValue('order', nValue)
            : this.resetFilter('order');

          fValue = this.filters.mode.value;
          nValue = this.getNormalizedFilterValue('mode', data.mode || fValue);
          nValue
            ? await this.setFilterValue('mode', nValue)
            : this.resetFilter('mode');

          fValue = this.filters.complexity.value;
          nValue = this.getNormalizedFilterValue('complexity', data.complexity || fValue);
          nValue
            ? await this.setFilterValue('complexity', nValue)
            : this.resetFilter('complexity');

          fValue = this.filters.type.value;
          nValue = this.getNormalizedFilterValue('type', data.type || fValue);
          nValue
            ? await this.setFilterValue('type', nValue)
            : this.resetFilter('type');

          fValue = this.filters.part.value;
          nValue = this.getNormalizedFilterValue('part', data.part || fValue);
          nValue
            ? await this.setFilterValue('part', nValue)
            : this.resetFilter('part');

          fValue = this.filters.page.current;
          nValue = this.getNormalizedFilterValue('page', data.page || fValue);
          if (nValue) {
            this.filters.page.current = nValue;
          }

          nValue = this.getNormalizedFilterValue('ac', data.ac);
          nValue
            ? await this.setFilterValue('ac', nValue === '1')
            : await this.setFilterValue('ac', false);

          nValue = this.getNormalizedFilterValue('f', data.f);
          nValue
            ? await this.setFilterValue('f', nValue === '1')
            : await this.setFilterValue('f', false);
        },
        syncFiltersDataWith(data) {
          if (!data) {
            return;
          }

          const setDisabled = (filterItem, dataItem, isDisabled) => {
            dataItem.disabled = isDisabled;

            if (
              isDisabled &&
              filterItem.value?.length &&
              !['attestation', 'classes', 'subjects', 'category', 'status'].includes(filterItem.id)
            ) {
              if (Array.isArray(filterItem.value)) {
                const valueIndex = filterItem.value.findIndex((_value) => _value === dataItem.id);
                if (valueIndex > -1) {
                  filterItem.value.splice(valueIndex, 1);
                }
              } else {
                if (dataItem.id === filterItem.value) {
                  filterItem.value = null;
                }
              }
            }
          };
          const setCount = (dataItem, count) => {
            dataItem.count = count;
          };
          const setIsFavorite = (dataItem, isFavorite) => {
            if (isFavorite) {
              dataItem.icon = {
                name: 'flag',
                fill: '#fec84d'
              };
            } else {
              delete dataItem.icon;
            }
          }
          const processFilter = (filterItem, inputData) => {
            if (!filterItem) {
              return;
            }

            if (inputData) {
              filterItem.data.map((dataItem, index) => {
                const existingDataItemInInputData = inputData.find((value) => dataItem.id === value.id);
                setDisabled(filterItem, dataItem, !existingDataItemInInputData);
                setCount(dataItem, existingDataItemInInputData?.count || 0);

                if (useUserStore().currentRole === role.STUDENT) {
                  setIsFavorite(dataItem, existingDataItemInInputData?.is_favorite);
                }

                this.filtersOptions?.sync?.onDataItemChange?.call(null, filterItem, dataItem, index);
              });
              filterItem.disabled = false;
            } else {
              filterItem.data.map((dataItem) => setDisabled(filterItem, dataItem, true));
              filterItem.disabled = true;
            }
          }

          for (const item in this.filters) {
            if (this.filters[item].dynamic && !this.filtersOptions?.sync?.skip?.includes(item)) {
              processFilter(this.filters[item], data[item]);
            }
          }

          this.filtersOptions?.sync?.onComplete?.call(null, data);


        },
        async syncFiltersWithContent() {
          const {page, sort, ...fsQuery} = this.builtFilters;
          const apiPath = typeof this.filtersOptions?.sync?.apiPath === 'function'
            ? this.filtersOptions?.sync?.apiPath.call(null)
            : this.filtersOptions?.sync?.apiPath;
          const onFsResponse = (fsResponse) => {
            if (fsResponse?.data?.done) {
              this.syncFiltersDataWith(fsResponse.data.filters);
            }
          }
          if (!apiPath) {
            return;
          }
          if (process.server) {
            try {
              const fsResponse = await useApi(apiPath, {...methodGet, query: fsQuery});
              onFsResponse(fsResponse);
            } catch (e) {
              console.error(e.message);
            }
          }
          if (process.client) {
            useApi(apiPath, {...methodGet, query: fsQuery})
            .then(onFsResponse)
            .catch((e) => console.error(e.message));
          }
        },
        getNormalizedFilterValue(id, value) {
          if (!value || typeof value !== 'string') {
            return null;
          }

          try {
            switch (id) {
              case 'attestation': {
                let included = [...this.filters.attestation.data.map((_value) => _value.id)].includes(value);
                if (included) {
                  return value;
                }
                break;
              }
              case 'category': {
                let included = [...this.filters.category.data.map((_value) => _value.id)].includes(value);
                if (included) {
                  return value;
                }
                break;
              }
              case 'content': {
                let included = [...this.filters.content.data.map((_value) => _value.id)].includes(value);
                if (included) {
                  return value;
                }
                break;
              }
              case 'classes': {
                let classes = value.split(',');
                classes = classes.map((_value) => +_value);
                classes = [...new Set(classes)];
                classes = classes.filter((_value) => this.filters.classes.data.some((_class) => _class.id === _value));
                if (classes && classes.length) {
                  return classes;
                }
                break;
              }
              case 'subjects': {
                let subjects = value.split(',');
                subjects = subjects.map((_value) => +_value);
                subjects = [...new Set(subjects)];
                subjects = subjects.filter((_value) => this.filters.subjects.data.some((_subject) => _subject.id === _value));
                if (subjects && subjects.length) {
                  return subjects;
                }
                break;
              }
              case 'years': {
                let years = value.split(',');
                years = years.map((_value) => +_value);
                years = [...new Set(years)];
                years = years.filter((_value) => this.filters.years.data.some((_year) => _year.id === _value));
                if (years && years.length) {
                  return years;
                }
                break;
              }
              case 'q': {
                return value;
              }
              case 'status': {
                let included = [...this.filters.status.data.map((_value) => _value.id)].includes(value);
                if (included) {
                  return value;
                }
                break;
              }
              case 'topics': {
                let topics = value.split(',');
                topics = topics.map((_value) => +_value);
                topics = [...new Set(topics)];
                if (topics && topics.length) {
                  return topics;
                }
                break;
              }
              case 'order': {
                let included = [...this.filters.order.data.map((_value) => _value.id)].includes(value);
                if (included) {
                  return value;
                }
                break;
              }
              case 'mode': {
                let included = [...this.filters.mode.data.map((_value) => _value.id)].includes(value);
                if (included) {
                  return value;
                }
                break;
              }
              case 'complexity': {
                let complexity = value.split(',');
                complexity = [...new Set(complexity)];
                complexity = complexity.filter((_value) => this.filters.complexity.data.some((_complexity) => _complexity.id === _value));
                if (complexity && complexity.length) {
                  return complexity;
                }
                break;
              }
              case 'type': {
                let problem = value.split(',');
                problem = [...new Set(problem)];
                problem = problem.filter((_value) => this.filters.type.data.some((_problem) => _problem.id === _value));
                if (problem && problem.length) {
                  return problem;
                }
                break;
              }
              case 'part': {
                let part = value.split(',');
                part = part.map((_value) => +_value);
                part = [...new Set(part)];
                part = part.filter((_value) => this.filters.part.data.some((_part) => _part.id === _value));
                if (part && part.length) {
                  return part;
                }
                break;
              }
              case 'page': {
                return +value;
              }
              case 'f':
              case 'ac': {
                let included = ['1', '0'].includes(value);
                if (included) {
                  return value;
                }
                break;
              }
            }
          } catch (e) {
            console.warn('can\'t get normalized value for id:', id, 'value:', value);
          }

          return null;
        },
        async setFilterValue(id, value, options = {}) {
          if (!this.filters[id]) {
            console.warn('setFilterValue -> no filter found', id);
          }
          
          this.filters[id].value = value;

          if (id === 'page') {
            this.filters[id].current = value;
          }

          if (options?.withAccepted === true) {
            if ('accepted' in this.filters[id]) {
              this.filters[id].accepted = value;
            }
          }

          if (options?.withPreset) {
            this.resetFilters();
            if (this.presets[options.withPreset]) {
              try {
                const presetFilters = JSON.parse(this.presets[options.withPreset]);
                options?.onPresetDataParsed?.call(null, presetFilters);
                if (id in presetFilters) {
                  delete presetFilters[id];
                }
                Object.assign(this.filters, presetFilters);
              } catch (e) {
                console.error('setFilterValue -> withPreset', e.message);
              }
            }
          }

          if (id !== 'page' && this.filters.page.current > 1 && this.filterIsFetchable(id) && options?.pageReset !== false) {
            this.filters.page.current = 1;
            this.filters.page.value = 1;
          }

          if (id === 'subjects' && this.filtersOptions?.autoloadParts !== false) {
            if (value?.length === 1) {
              await this.fetchSubjectParts(parseInt(value[0]));
            } else {
              this.setFilterData('part', []);
              await this.setFilterValue('part', null);
            }
          }

          if (id === 'attestation') {
            await this.setFilterValue('classes', null);
            await this.setFilterValue('class', null);
          }

          options?.onSetComplete?.call(null, this.filters);
        },
        savePresetAs({name, data = null, callback = null}) {
          const preset = _cloneDeep(data || this.filters);
          callback?.call(null, preset);
          this.presets[name] = JSON.stringify(preset);
        },
        setFilterData(id, data) {
          if (!this.filters[id]) {
            console.warn('setFilterData -> no filter found', id);
          }

          const filterData = _cloneDeep(data);

          switch (id) {
            case 'subject':
            case 'subjects': {
              if (useUserStore().currentRole === role.STUDENT) {
                filterData.map((subject) => {
                  if (subject.is_favorite) {
                    subject.icon = {
                      name: 'flag',
                      fill: '#fec84d'
                    };
                  }
                });
              }
              break;
            }
          }

          this.filters[id].data = filterData;
        },
        filterIsFetchable(id) {
          return id && this.filters[id] && this.filters[id].fetchable !== false;
        },
        resetFilter(id) {
          if (this.filters[id].canReset === false) {
            return;
          }

          if (id === 'pagination') {
            this.resetPagination();
          }

          this.filters[id].value = this.filters[id].default;

          if ('accepted' in this.filters[id]) {
            this.filters[id].accepted = this.filters[id].default;
          }

          if (id === 'subjects') {
            this.filters.part.data = [];
          }
        },
        resetPagination() {
          this.filters.page.value = 1;
          this.filters.page.default = 1;
          this.filters.page.total = 0;
          this.filters.page.current = 1;
          this.filters.page.last_page = 1;
          this.filters.page.per_page = 20;
          this.filters.page.append = false;
        },
        resetFilters() {
          for (const id in this.filters) {
            if (Object.hasOwn(this.filters, id)) {
              this.resetFilter(id);
            }
          }
        }
      }
    }
  }
};
