<template>
  <date-pick
    v-model="calendar.date"
    range
    six-weeks
    hide-input-icon
    locale="ru"
    menu-class-name="rounded-4 border-0 p-4 shadow"
    calendar-class-name="mt-4 pt-2 align-items-stretch"
    calendar-cell-class-name="rounded-0 border-0 m-0"
    monthNameFormat="long"
    :disabled="disabled"
    :month-change-on-scroll="false"
    :day-names="['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']"
    :year-range="yearRange"
    :enable-time-picker="false"
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
      <div class="dp-controls w-100 gap-2">
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
            <svg-icon name="arrow-left" />
          </button>
          <button
            class="btn btn-sm p-0"
            v-if="isLastYearRange(year, month)"
            @click="handleMonthYearChange(true)"
          >
            <svg-icon name="arrow-right" />
          </button>
        </div>
      </div>
    </template>
    <template #action-row="{ internalModelValue, selectDate, closePicker }">
      <div class="w-100 mt-4">
        <div
          class="d-flex align-items-center justify-content-between w-100 pt-4 border-top"
        >
          <button class="btn border" @click="clickClosePicker(closePicker)">
            Сбросить
          </button>
          <button class="btn btn-primary" @click="clickSelectDate(selectDate)">
            Готово
          </button>
        </div>
      </div>
    </template>
    <template #trigger>
      <button
        ref="dateInput"
        class="calendar-button w-100 h-100 d-flex align-items-center"
        @click="() => (isInputActive = false)"
      >
        <input
          ref="dateInput"
          type="text"
          :value="displayDate"
          placeholder="Выбрать даты"
          @click="() => (isInputActive = false)"
          readonly
          class="date-input pe-none h-100"
        />

        <svg-icon name="calendar" class="calendar-icon" />
      </button>
    </template>
  </date-pick>
</template>

<script>
import useMaterialsStore from "~/stores/materials-library";
import DatePick from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import _debounce from "lodash.debounce";
import {
  format,
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
    const ADDITIONAL_NUMBER_COUNT_YEARS_MAX_DATE = 5;
    const ADDITIONAL_NUMBER_COUNT_YEARS_MIN_DATE = 5;
    const store = useMaterialsStore();
    const yearRange = [
      new Date().getFullYear() - ADDITIONAL_NUMBER_COUNT_YEARS_MIN_DATE,
      new Date().getFullYear() + ADDITIONAL_NUMBER_COUNT_YEARS_MAX_DATE,
    ];
    const calendar = computed(() => store.calendar);
    const dateInput = ref(null);

    const isLastYearRange = (year, month) => {
      const LAST_MONTH = 11;
      const lastYear = yearRange[1];

      return year < lastYear || month < LAST_MONTH;
    };

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

    const getDate = (num) =>
      num ? `${num.getDate()} ${monthsNames[num.getMonth()]}` : "...";

    const displayDate = computed(() => {
      const dateFrom = store.calendar.date[0];
      const dateTo = store.calendar.date[1];

      const dateFormating = formatDateRange([dateFrom, dateTo]);

      if (dateFrom && dateTo) {
        return dateFormating;
      }

      return "";
    });

    const updateMonth = (e, updateMonthYear, year) => {
      updateMonthYear(+e, year);
    };

    const updateYear = (e, updateMonthYear, month) => {
      updateMonthYear(month, +e);
    };

    const clickSelectDate = (selectDate) => {
      selectDate();
      const [start, end] = calendar.value.date;
      setValue(start, end);
    };

    const clickClosePicker = (closePicker) => {
      store.resetDate();
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
        value: "" || getDate(store.calendar.date[0]),
        isActive: false,
      },
      end: {
        isValid: true,
        value: "" || getDate(store.calendar.date[1]),
        isActive: false,
      },
    });

    return {
      yearRange,
      calendar,
      dateInput,
      updateMonth,
      updateYear,
      displayDate,
      getDate,
      clickSelectDate,
      clickClosePicker,
      isInputActive,
      inputDate,
      inputDates,
      isLastYearRange,
    };
  },
};
</script>

<style lang="scss" scoped>
.label-select-date {
  border: none;
  background-color: transparent;
  padding: 6px 10px;
  border-radius: 8px;

  &:hover {
    background-color: rgb(243 243 241/1);
  }
}

.calendar-icon {
  color: #0c1524;
}

.date-input {
  border: none;
  width: calc(100% - 2rem);
}

.calendar-button {
  background: #fff;
  padding: 10px 16px;
  font-size: 16px;
  gap: 8px;
  border-radius: 0.5rem;
  border: 1px solid #ced6e0;
  transition: border-color 0.15s ease-in-out;

  &:hover {
    border-color: #7f838a;
  }
}

.dp-controls {
  display: grid;
  grid-template-columns: 120px 1fr 40px;
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
