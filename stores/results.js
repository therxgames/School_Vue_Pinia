import { defineStore } from "pinia";
import { format } from "date-fns";
import useCommonStore from "~/stores/common";

export default defineStore({
  id: "results",

  state() {
    return {
      awards: [],
      grade: 9,
      fullProgress: false,
      calendar: {
        labels: [],
        row: "day",
        date: [],
        select: 1,
        updated: true,
      },
      chartFetching: false,
      generalIds: "",
      subjectID: "",
      generalStat: null,
      generalDiff: null,
      generalTrend: "task",
      loader: true,
      isFetching: false,
      hasGeneralData: false,
      hasSubjectData: false,
      subjectStat: null,
      subjects: [],
      subjectByID: {
        2: {
          name: "Математика",
          idName: "maths",
        },
        6: {
          name: "Русский язык",
          idName: "russian",
        },
      },
      subjectData: null,
      subjectsColors: {
        Биология: { bg: ["#afeeab", "#d7f9d4"], icon: "#a3e79e" },
        Химия: { bg: ["#9aeacd", "#b5f2e3"], icon: "#a6d9cd" },
        "Немецкий язык": { bg: ["#f792aa", "#fcd5de"], icon: "#ebb8b9" },
        "Английский язык": { bg: ["#ff8c90", "#ffdbdc"], icon: "#ebb8b9" },
        "Французский язык": { bg: ["#f89194", "#fccecf"], icon: "#e1aeaf" },
        География: { bg: ["#cbdf9e", "#e9f4d1"], icon: "#cbdf9e" },
        История: { bg: ["#ffdd9b", "#fff3c7"], icon: "#ffd583" },
        Информатика: { bg: ["#a7e2f2", "#c7ecf6"], icon: "#8bd3e7" },
        Литература: { bg: ["#dbc1c4", "#f0dee0"], icon: "#dbc1c4" },
        Математика: { bg: ["#b0d0e7", "#d2e6f4"], icon: "#b0d0e7" },
        Физика: { bg: ["#9dd9d6", "#bbebe8"], icon: "#97d3d0" },
        "Русский язык": { bg: ["#ceb4c8", "#f1ddec"], icon: "#ceb4c8" },
        Обществознание: { bg: ["#f1c5a5", "#ffe6d4"], icon: "#f1c5a5" },
        "Испанский язык": { bg: ["#ff8aa6", "#ffcdd9"], icon: "#e0a3b1" },
      },
      themes: [],
      emptyThemes: [],
      sections: [],
      topicsData: {},
      target: {
        status: {
          tasks: [
            { solution_status: "none" },
            {
              solution_status: "wrong,wrong_after_control_correct",
              has_correct_answer: false,
            },
            {
              solution_status: "wrong,wrong_after_control_correct",
              has_correct_answer: true,
            },
            { solution_status: "training_correct,control_correct" },
          ],
          tests: [
            { type: "demovariant", is_started: false },
            { type: "demovariant", is_started: true, is_correct: false },
            { type: "demovariant", is_correct: true },
          ],
        },
        tasks: null,
        tests: null,
        tsok: null,
      },
    };
  },

  getters: {
    queryGrade() {
      return this.grade === 9
        ? { attestation: "oge" }
        : { parallel_id: this.grade };
    },
    getDates() {
      if (this.calendar.date.length) {
        return {
          from: format(new Date(this.calendar.date[0]), "yyyy-MM-dd"),
          to: format(new Date(this.calendar.date[1]), "yyyy-MM-dd"),
        };
      }
    },
    generalFilters() {
      if (this.calendar.updated) {
        return {
          subject_ids: this.generalIds,
          row: this.calendar.row,
          ...this.getDates,
        };
      } else {
        return null;
      }
    },
    subjectFilters() {
      if (this.calendar.updated) {
        return {
          id: this.subjectID,
          params: {
            row: this.calendar.row,
            ...this.getDates,
          },
        };
      } else {
        return null;
      }
    },
    getGeneralStat() {
      let arr = [];
      if (this.generalStat?.length) {
        arr = [...this.generalStat].map((el, ind) => {
          const obj = el;
          obj.subject = this.subjects.find(
            (s) => +s.id === +obj.subject_id
          )?.name;
          if (this.generalTrend === "task") {
            obj.data = [...obj.details].map((d) => d.correctness + d.wrongness);
          }
          if (this.generalTrend === "topic") {
            obj.data = [...obj.details].map((d) => d.count);
          }
          return obj;
        });
      }
      return arr;
    },
    getSubjects() {
      return [...this.subjects].filter(
        (sbj) => sbj.correctness + sbj.wrongness > 0
      );
    },
    getFavSubjects() {
      const arr = [...this.getSubjects];
      return arr.filter((s) => s.is_favorite) || [];
    },
  },

  actions: {
    async fetchModeSubjects(includeEmptyTopics) {
      const url = "/api/subjects/progress";
      try {
        const response = await useApi(url, {
          ...methodGet,
          query: {
            ...this.queryGrade,
            include_empty_topics: includeEmptyTopics ? 1 : 0,
          },
        });
        if (response.data.done) {
          const list = response.data.subjects
            .filter(s => subjectsNames[s.name] && s.tasks_count)
            .sort((a, b) => a.id - b.id);
          return list;
        }
      } catch (e) {
        console.error(e);
      }
    },
    async fetchSubjects(update = false) {
      this.isFetching = true;
      const subjectsInn = await this.fetchModeSubjects(false);
      const subjectsExt = await this.fetchModeSubjects(true);
      const list = [...subjectsInn].map((s, ind) => {
        const el = s;
        el["idName"] = subjectsNames[s.name];
        el["masteringExt"] = subjectsExt[ind].mastering;
        el["topics_countExt"] = subjectsExt[ind].topics_count;
        el["colors"] = this.subjectsColors[s.name];
        return el;
      });
      if (update || JSON.stringify(list) !== JSON.stringify(this.subjects)) {
        list.forEach((s) => {
          const { id, name, idName } = s;
          this.subjectByID[id] = { name, idName };
        });
        this.subjects = list;
        this.loader = false;
        this.target.tsok = null;
        if (this.target.tasks) this.target.tasks.isUpdate = true;
        if (this.target.tests) this.target.tests.isUpdate = true;
      }
      this.isFetching = false;
    },
    async fetchSubjectData(num) {
      this.isFetching = true;
      const url = `/api/subject/${num}/progress`;
      try {
        const response = await useApi(url, {
          ...methodGet,
          query: this.queryGrade,
        });
        if (response.data.done) {
          this.subjectData = response.data;
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.isFetching = false;
      }
    },
    async changeSubjectStatus(id, value) {
      this.isFetching = true;
      const url = `/api/subject/${id}/parallel/${this.grade}/status`;
      try {
        const response = await useApi(url, {
          ...methodPatch,
          body: value,
        });
        if (response.data.done) {
          await this.fetchSubjects(true);
          await useCommonStore().resolveFilters(true);
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.isFetching = false;
      }
    },
    async changeItemStatus(item) {
      const url = `/api/${item.content_type}/${item.parent_id}/status`;
      try {
        const response = await useApi(url, {
          ...methodPatch,
          body: { is_favorite: !item.is_favorite },
        });
        if (response.data.done) {
          const t = this.target[`${item.content_type}s`].items.find(
            (t) => t.parent_id === item.parent_id
          );
          t.is_favorite = !item.is_favorite;
        }
      } catch (e) {
        console.error(e);
      }
    },
    async fetchGeneralStat() {
      const values = Object.values(this.generalFilters);
      if (values.every((v) => v)) {
        this.isFetching = true;
        this.chartFetching = true;
        const url = `/api/${this.generalTrend}/trend`;
        try {
          const response = await useApi(url, {
            ...methodGet,
            query: {
              ...this.generalFilters,
              ...this.queryGrade,
            },
          });
          if (response.data.done) {
            let hasData = false;
            for (
              let i = 0;
              i < response.data.subjects.length && !hasData;
              i++
            ) {
              const details = response.data.subjects[i].details;
              let j = details.length;
              while (j && !hasData) {
                j--;
                if (this.generalTrend === "task") {
                  if (details[j].correctness > 0 || details[j].wrongness > 0) {
                    hasData = true;
                  }
                }
                if (this.generalTrend === "topic") {
                  if (details[j].count > 0) {
                    hasData = true;
                  }
                }
              }
            }
            this.generalStat = await response.data.subjects;
            this.generalDiff = await response.data.statistics;
            this.hasGeneralData = hasData;

            console.log(this.generalDiff)
          }
        } catch (e) {
          console.error(e);
        } finally {
          this.chartFetching = false;
          this.isFetching = false;
        }
      }
    },
    async fetchSubjectStat(str = "task") {
      const values = Object.values(this.subjectFilters.params);
      const queryFilter =
        str === "task" ? this.queryGrade : { parallel_id: this.grade };
      if (this.subjectFilters.id && values.every((v) => v)) {
        this.isFetching = true;
        this.chartFetching = true;
        const url = `/api/subject/${this.subjectFilters.id}/${str}_trend`;
        try {
          const response = await useApi(url, {
            ...methodGet,
            query: {
              ...this.subjectFilters.params,
              ...queryFilter,
            },
          });
          if (response.data.done) {
            let hasData = false;
            const details = response.data.details;
            let i = details.length;
            while (i && !hasData) {
              i--;
              if (details[i].correctness > 0 || details[i].wrongness > 0) {
                hasData = true;
              }
            }
            this.subjectStat = response.data;
            this.hasSubjectData = hasData;
          }
        } catch (e) {
          console.error(e);
        } finally {
          this.chartFetching = false;
          this.isFetching = false;
        }
      }
    },
    async fetchThemes(subject) {
      this.isFetching = true;
      const url = "/api/sections/topics";
      const query = {
        subject_id: subject,
        ...this.queryGrade,
        show_empty_count: 1,
      };
      try {
        const response = await useApi(url, {
          ...methodGet,
          query,
        });
        if (response.data.done) {
          const themes = response.data.sections.map((s) => {
            const el = { ...s };
            el.topics = s.topics
              .filter((t) => t.tasks_count > 0)
              .map((t) => {
                return {
                  ...t,
                  progress: t.mastering,
                };
              });
            return el;
          });
          const emptyThemes = response.data.sections.map((s) => {
            const el = { ...s };
            el.topics = s.topics.filter((t) => !t.tasks_count);
            return el;
          });
          const sections = [...response.data.sections].map(s => s.name);
          this.sections = sections;
          this.themes = themes;
          this.emptyThemes = emptyThemes;
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.isFetching = false;
      }
    },
    async fetchTopicsTasks(id) {
      const url = `/api/tasks`;
      const query = { topic_id: id };
      try {
        const res = await useApi(url, { ...methodGet, query });
        if (res.data.done) {
          this.topicsData[`${id}`] = {
            tasks: res.data.tasks,
            details: null,
            statistics: null,
            hasData: false,
            chartFetching: false,
          };
        }
      } catch (e) {
        console.error(e);
      }
    },
    async fetchTopicTrend(id) {
      this.topicsData[`${id}`].chartFetching = true;
      const url = `/api/topic/${id}/task_trend`;
      const { from, to, row } = this.subjectFilters.params;
      const query = { from, to, row };
      try {
        const res = await useApi(url, { ...methodGet, query });
        if (res.data.done) {
          let hasData = false;
          const details = res.data.details;
          let i = details.length;
          while (i && !hasData) {
            i--;
            if (details[i].correctness > 0 || details[i].wrongness > 0) {
              hasData = true;
            }
          }
          this.topicsData[`${id}`].details = res.data.details;
          this.topicsData[`${id}`].statistics = res.data.statistics;
          this.topicsData[`${id}`].hasData = hasData;
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.topicsData[`${id}`].chartFetching = false;
      }
    },
    async fetchTsok(page) {
      this.isFetching = true;
      const url = "/api/lib_tsok/page_local";
      const query = {
        page_size: 5,
        page_number: page,
        schoolClassIds: [this.grade],
        querySource: "results",
      };
      try {
        const res = await useApi(url, { ...methodGet, query });
        if (res.data.done) {
          if (!this.target.tsok) {
            this.target.tsok = {
              items: [],
              total: res.data.data.total,
              page,
            };
          }
          this.target.tsok.items = this.target.tsok.items.concat(
            res.data.data.data
          );
          this.target.tsok.page = page;
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.isFetching = false;
      }
    },
    setTargetField(id, type, key, value) {
      const t = this.target[`${type}s`].items.find((t) => t.id === id);

      if (t) {
        t[key] = value;
      }
    },

    async fetchTarget(str) {
      this.isFetching = true;
      const target = this.target[str];
      const url = `/api/${str}`;
      const page = target && !target.isUpdate ? target.nextPage : 1;
      const solution_status =
        target && !target.isUpdate ? target.solution_status : 0;
      const subjects = () => {
        const favs = this.subjects
          .filter((s) => s.is_favorite)
          .map((s) => s.id);
        if (favs.length > 2) {
          return favs.join(",");
        }
        const ids = [...new Set([2, 6, ...favs])];
        return ids.join(",");
      };
      const query = {
        ...this.queryGrade,
        subject_id: subjects(),
        ...this.target.status[str][solution_status],
        sort: "popular",
        page,
      };
      try {
        const res = await useApi(url, { ...methodGet, query });
        if (res.data.done) {
          if (target && !target.isUpdate) {
            if (page === 1) {
              this.target[str].total = res.data.total;
              this.target[str].last_page = res.data.last_page;
            }
            this.target[str].items = this.target[str].items.concat(
              res.data[str]
            );
          } else {
            this.target[str] = {
              total: res.data.total,
              last_page: res.data.last_page,
              items: res.data[str],
              isLast: false,
              isUpdate: false,
            };
          }
          if (page < this.target[str].last_page) {
            this.target[str].nextPage = page + 1;
            this.target[str].solution_status = solution_status;
          } else {
            if (
              this.target[str].solution_status ===
              this.target.status[str].length - 1
            ) {
              this.target[str].isLast = true;
            } else {
              this.target[str].nextPage = 1;
              this.target[str].solution_status = solution_status + 1;
            }
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.isFetching = false;
      }
    },

    async fetchAwards(sortBy, searchBy, filterBy) {
      this.isFetching = true;
      const url = "/api/achievements/my";
      const query = {};

      if (!!sortBy) {
        query["sort"] = sortBy;
      }

      if (!!searchBy) {
        query["find"] = searchBy;
      }

      if (!!filterBy) {
        query["gia"] = filterBy;
      }

      try {
        const response = await useApi(url, {
          ...methodGet,
          query,
        });

        if (response.data.done) {
          // Если выбираем по Типу ГИА то другая структура приходит
          if (!!filterBy) {
            const { achievements, ...restData } = response.data;
            const items = Object.entries(response.data.achievements.items);
            const sectionAwards = items.map((section) => {
              return {
                title: section[0],
                awards: section[1].map((award) => {
                  const {
                    name,
                    user_descriptions,
                    date,
                    rarity,
                    image,
                    percent,
                    to_next_lvl,
                    ...rest
                  } = award;
                  return {
                    ...rest,
                    title: name,
                    description: user_descriptions,
                    date: date,
                    rarity: rarity,
                    icon_default: image,
                    progress: percent,
                    more_tasks: to_next_lvl,
                  };
                }),
              };
            });

            this.awards = {
              done: restData.done,
              achievements: {
                ...restData,
                achievements: sectionAwards,
              },
            };
          } else {
            const { achievements, ...restData } = response.data;
            const refactorAchievements = achievements.achievements.map(
              (award) => {
                const {
                  name,
                  user_descriptions,
                  date,
                  rarity,
                  image,
                  percent,
                  to_next_lvl,
                  ...rest
                } = award;
                return {
                  ...rest,
                  title: name,
                  description: user_descriptions,
                  date: date,
                  rarity: rarity,
                  icon_default: image,
                  progress: percent,
                  more_tasks: to_next_lvl,
                };
              }
            );

            this.awards = {
              ...restData,
              achievements: {
                ...achievements,
                achievements: refactorAchievements,
              },
            };
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.isFetching = false;
      }
    },
  },
});
