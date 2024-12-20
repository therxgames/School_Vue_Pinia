<template>
  <date-pick
    v-model="calendar.date"
    range
    six-weeks
    hide-input-icon
    locale="ru"
    menu-class-name="rounded-4 border-0 p-4 shadow"
    calendar-class-name="mt-4 pt-2 align-items-stretch"
    calendar-cell-class-name="rounded-0 border-0 m-0 hover-cell"
    monthNameFormat="long"
    :disabled="disabled"
    :month-change-on-scroll="false"
    :day-names="['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']"
    :year-range="yearRange"
    :enable-time-picker="false"
    class="date-select-search"
  >
    <template #day="{ day }">
      <div @click="() => (isInputActive = false)">{{ day }}</div>
    </template>
    <template
      #month-year="{
        year,
        years,
        month,
        months,
        updateMonthYear,
        handleMonthYearChange,
      }"
    >
      <div class="dp-controls w-100">
        <div>
          <input-select-single
            selectBtnClassNames="border-0 px-0"
            :resetBtn="false"
            :list="years.map((y) => ({ id: y.value, name: y.text })).reverse()"
            @update:value="(value) => updateYear(value, updateMonthYear, month)"
            :value="year"
          />
        </div>
        <div>
          <input-select-single
            selectBtnClassNames="border-0 px-0"
            :resetBtn="false"
            :list="months.map((m) => ({ id: m.value, name: m.text }))"
            @update:value="(value) => updateMonth(value, updateMonthYear, year)"
            :value="month"
            placeholder="январь"
          />
        </div>
        <div class="d-flex justify-content-between dp-arrows">
          <button class="btn btn-sm p-0" @click="handleMonthYearChange(false)">
            <svg-icon name="arrow-left"/>
          </button>
          <button class="btn btn-sm p-0" v-if="isLastYearRange(year, month)"
                  @click="handleMonthYearChange(true)">
            <svg-icon name="arrow-right"/>
          </button>
        </div>
      </div>
    </template>
    <template #action-row="{ internalModelValue, selectDate, closePicker }">
      <div class="w-100 mt-4">
        <div
          class="d-flex align-items-center justify-content-between w-100 pt-4 border-top"
        >
          <button class="btn btn-outline-primary border" @click="clickClosePicker(closePicker)">Сбросить</button>
          <button class="btn btn-primary" @click="clickSelectDate(selectDate)">
            Готово
          </button>
        </div>
      </div>
    </template>
    <template #trigger>
      <button
        ref="dateInput"
        class="calendar-button"
        @click="() => (isInputActive = false)"
      >
        <input
          ref="dateInput"
          type="text"
          :value="displayDate"
          @click="() => isInputActive = false"
          readonly
          class="date-input"
          :class="{'date-input-placeholder': displayDate === 'Дата'}"
        >

        <svg-icon name="calendar" class="calendar-icon"/>
      </button>
    </template>
  </date-pick>
</template>

<script>
import useCrossCuttingSearchStore from '~/stores/cross-cutting-search';
import DatePick from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import _debounce from "lodash.debounce";
import {
  differenceInCalendarDays,
  differenceInCalendarMonths,
  differenceInCalendarWeeks,
  endOfWeek,
  format,
  lastDayOfWeek,
  startOfWeek,
} from "date-fns";

export default {
  components: {
    DatePick,
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const ADDITIONAL_NUMBER_COUNT_YEARS_MAX_DATE = 100;
    const ADDITIONAL_NUMBER_COUNT_YEARS_MIN_DATE = 5;
    const store = useCrossCuttingSearchStore();
    const yearRange = [new Date().getFullYear() - ADDITIONAL_NUMBER_COUNT_YEARS_MIN_DATE, new Date().getFullYear() + ADDITIONAL_NUMBER_COUNT_YEARS_MAX_DATE];
    const calendar = computed(() => store.calendar);
    const dateInput = ref(null);
    const period = ref(1);
    const stepCalendar = ref(1);

    const isLastYearRange = (year, month) => {
      const LAST_MONTH = 11;
      const lastYear = yearRange[1];

      return (year < lastYear) || (month < LAST_MONTH)
    };

    const rows = [
      {id: "day", name: "По дням"},
      {id: "week", name: "По неделям"},
      {id: "month", name: "По месяцам"},
    ];


    const monthsNames = [
      "января",
      "февраля",
      "марта",
      "апреля",
      "мая",
      "июня",
      "июля",
      "августа",
      "сентября",
      "октября",
      "ноября",
      "декабря",
    ];

    const setValue = (a, b) => {
      store.calendar.date[0] = a;
      store.calendar.date[1] = b;
    };

    const d = new Date();
    d.setDate(new Date().getDate() - 7);
    const date = computed(() => store.calendar.date);
    const rowList = computed(() => {
      store.calendar.updated = true;
      const [start, end] = store.calendar.date;
      const d = new Date(end);
      const monthValue = d.getMonth() - 3;
      d.setDate(end.getDate() + 1);
      d.setMonth(monthValue);
      if (+start < +d) {
        if (store.calendar.row === "day") {
          store.calendar.row = "week";
        }
        return rows.filter((r) => r.id !== "day");
      }
      return rows;
    });
    const getDate = (num) => num ? `${num.getDate()} ${monthsNames[num.getMonth()]}` : "...";

    const displayDate = computed(() => {
      const start = store.calendar.date[0];
      const end = store.calendar.date[1];

      if (!start || !end) {
        return 'Дата'
      }

      const formattedStart = format(start, 'dd.MM');
      const formattedEnd = format(end, 'dd.MM.yyyy');
      return `${formattedStart} - ${formattedEnd}`;
    });

    const isShow = ref(false);
    watch(
      () => period.value,
      () => {
        store.calendar.updated = false;
        if (period.value === 1) {
          const d = new Date();
          d.setDate(new Date().getDate() - 7);
          setValue(d, new Date());
        }
        if (period.value === 2) {
          const d = new Date();
          d.setMonth(new Date().getMonth() - 1);
          setValue(d, new Date());
        }
        if (period.value === 3) {
          const d = new Date();
          d.setMonth(0);
          d.setDate(1);
          setValue(d, new Date());
        }
        if (period.value === 4 && !isShow.value) {
          // dateInput.value.click();

        }
      }
    );
    const daysVal = computed(() => {
      const arr = [];
      const sd = new Date(date.value[0]);
      const diff = differenceInCalendarDays(+date.value[1], +date.value[0]);
      for (let i = 0; i <= diff; i++) {
        arr.push(getDate(sd));
        sd.setDate(sd.getDate() + 1);
      }
      return arr;
    });
    const weeksVal = computed(() => {
      const arr = [];
      const sd = startOfWeek(new Date(date.value[0]), {weekStartsOn: 1});
      const start = startOfWeek(new Date(date.value[0]), {weekStartsOn: 1});
      const end = endOfWeek(new Date(date.value[1]), {weekStartsOn: 1});
      const diff = differenceInCalendarWeeks(end, start);
      for (let i = 0; i < diff; i++) {
        const ld = lastDayOfWeek(sd, {weekStartsOn: 1});
        arr.push(`${getDate(sd)} - ${getDate(ld)}`);
        sd.setDate(sd.getDate() + 7);
      }
      return arr;
    });
    const monthsVal = computed(() => {
      const arr = [];
      const sd = new Date(date.value[0]);
      const diff = differenceInCalendarMonths(+date.value[1], +date.value[0]);
      for (let i = 0; i <= diff; i++) {
        arr.push(sd.toLocaleString("ru", {month: "long"}));
        sd.setMonth(sd.getMonth() + 1);
      }
      return arr;
    });
    const resultArr = computed(() => {
      if (store.calendar.row === "day") return daysVal.value;
      if (store.calendar.row === "week") return weeksVal.value;
      if (store.calendar.row === "month") return monthsVal.value;
    });
    watch(
      () => resultArr.value,
      () => {
        store.calendar.labels = resultArr.value;
        store.calendar.select = period.value;
      }
    );
    const updateMonth = (e, updateMonthYear, year) => {
      updateMonthYear(+e, year);
    };
    const updateYear = (e, updateMonthYear, month) => {
      updateMonthYear(month, +e);
    };
    const clickSelectDate = (selectDate) => {
      selectDate();
      store.calendar.activeButtonFilter = null;
      const [start, end] = calendar.value.date
      setValue(start, end)
    };

    const clickClosePicker = (closePicker) => {
      store.calendar.activeButtonFilter = 0;
      store.resetDate()
      closePicker();
    };


    const regterms = [
      "^(?:(?:31-(?:(?:0?[13578])|(1[02])))-20[0-9]{2})$",
      "^(?:(?:29|30)-(?:(?:0?[13-9])|(?:1[0-2]))-20[0-9]{2})$",
      "^(?:29-0?2-20(?:(?:[02468][048])|(?:[13579][26])))$",
      "^(?:(?:(?:0?[1-9])|(?:1[0-9])|(?:2[0-8]))-(?:(?:0?[1-9])|(?:1[0-2]))-20[0-9]{2})$",
    ];

    const setInputDate = _debounce((value, str, internalModelValue) => {
      internalModelValue[str === "start" ? 0 : 1] = value;
    }, 1000);
    const isInputActive = ref(false);
    const inputDate = (internalModelValue, str, e) => {
      inputDates.value[str].value = e.target.value;
      const [day, month, year] = inputDates.value[str].value.split(/[-./ ]/);
      const d = [
        +day,
        monthsNames.includes(month?.toLowerCase())
          ? monthsNames.indexOf(month.toLowerCase()) + 1
          : +month,
        +year || new Date(date.value[0]).getFullYear(),
      ];
      const reg = new RegExp(regterms.join("|"));
      const isValid = reg.test(d.join("-"));
      inputDates.value[str].isValid = isValid;
      if (isValid) {
        const sd = new Date();
        sd.setFullYear(d[2]);
        sd.setMonth(d[1] - 1);
        sd.setDate(d[0]);
        if (str === "start" && +sd > +internalModelValue[1]) {
          if (!year) {
            d[2]--;
            sd.setFullYear(d[2]);
          } else {
            inputDates.value[str].isValid = false;
          }
        }
        if (str === "end" && +sd < +internalModelValue[0]) {
          if (!year) {
            d[2]++;
            sd.setFullYear(d[2]);
          } else {
            inputDates.value[str].isValid = false;
          }
        }
        if (sd > new Date() || d[2] < yearRange[0]) {
          inputDates.value[str].isValid = false;
        }
        if (inputDates.value[str].isValid) {
          setInputDate(sd, str, internalModelValue);
        }
      }
    };

    const inputDates = ref({
      start: {
        isValid: true,
        value: '' || getDate(store.calendar.date[0]),
        isActive: false,
      },
      end: {
        isValid: true,
        value: '' || getDate(store.calendar.date[1]),
        isActive: false,
      },
    });

    const syncDate = (value, str) => {
      const d = getDate(value);
      inputDates.value[str].value = d;
      return d;
    };

    setTimeout(() => {
      store.calendar.labels = resultArr.value;
      store.calendar.select = period.value;
    }, 0);

    return {
      yearRange,
      calendar,
      dateInput,
      period,
      rowList,
      updateMonth,
      updateYear,
      displayDate,
      getDate,
      clickSelectDate,
      clickClosePicker,
      isInputActive,
      inputDate,
      inputDates,
      syncDate,
      isLastYearRange,
    };
  },
};
</script>

<style lang="scss" scoped>
:global(.hover-cell:not(.dp__range_between):hover) {
  border-radius: 50% !important;
  background-color: rgba(40, 118, 251, .25);
}

:global(.date-select-search div) {
  height: 100%;
}


.label-select-date {
  border: none;
  background-color: transparent;
  padding: 6px 10px;
  border-radius: 8px;

  &:hover {
    background-color: rgb(243 243 241/1);
  }
}

.date-input-placeholder {
  color: #93979E;
}

.calendar-icon {
  color: #0C1524;
}

.date-input {
  border: none;
  height: 100%;
  pointer-events: none;
}

.calendar-button {
  background: #FFF;
  padding: 10px 16px;
  font-size: 16px;
  color: #1b59f5;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 100%;
  border-radius: 12px;
  border: 1px solid #DDDEE0;

  span {
    text-decoration-line: underline;
    text-underline-offset: 6px;
    text-decoration-style: dotted;
    text-decoration-color: #c5d0ff;
  }
}


.dp-controls {
  display: grid;
  grid-template-columns: 120px 1fr 40px;
  gap: 0.5rem;
  padding: 0 0.5rem;
}

.dp-arrows {
  button {
    font-size: 0.6rem;
    padding: 8px 10px;

    &:first-child {
      border-radius: 0.5rem 0 0 0.5rem;
    }

    &:last-child {
      border-radius: 0 0.5rem 0.5rem 0;
      margin: 0 0 0 -1px;
    }

  }
}
</style>
