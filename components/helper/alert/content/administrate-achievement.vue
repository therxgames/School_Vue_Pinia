<template>
  <div class="administrate">
    <div class="administrate-list">
      <div
          class="administrate-list__item">
        <span class="list__name" v-html="'Статус'"/>
        <input-select-single
            placeholder="Выберите статус"
            :list="directory.status"
            :value="inputValues.status"
            v-model:value="selectStatus"
            :resetBtn="false"/>
        <span v-if="errorForm?.status?.[0]"
              v-html="errorForm.status[0]"
              class="error-message"/>
      </div>
      <div
          class="administrate-list__item">
        <span class="list__name" v-html="'Название'"/>
        <input
            required
            type="text"
            @input="(e) => input(e, 'name')"
            :value="inputValues.name"
            placeholder="Введите название"
            class="input-text">
        <span v-if="errorForm?.name?.[0]"
              v-html="errorForm.name[0]"
              class="error-message"/>
      </div>
      <div
          class="administrate-list__item">
        <span class="list__name" v-html="'Изображение'"/>
        <div class="file-load__wrapper">
          <div class="file-load__label">
            <label
                v-if="!inputValues.image"
                for="fileInputImage"
                class="btn btn-simple px-4 py-2">
              Загрузите с компьютера
            </label>
            <label
                v-else
                @click="removeImage"
                class="btn btn-simple px-4 py-2">
              Удалить Изображение
            </label>
            <input
                id="fileInputImage"
                ref="fileInputImage"
                type="file"
                accept=".jpg, .jpeg, .png, .gif"
                hidden
                @change="fileOnChangeImage">
          </div>
          <p
              v-if="inputValues.image"
              v-html="inputValues?.image?.name || inputValues.image"
              class="file-load__name"/>
        </div>
      </div>
      <div
          class="administrate-list__item">
          <span class="list__name"
                v-html="'Описание для пользователя'"/>
        <input
            type="text"
            @input="(e) => input(e, 'user_descriptions')"
            :value="inputValues.user_descriptions"
            placeholder="Введите описание"
            class="input-text">
        <span v-if="errorForm?.user_descriptions?.[0]"
              v-html="errorForm.user_descriptions[0]"
              class="error-message"/>
      </div>
      <div
          class="administrate-list__item">
        <span class="list__name"
              v-html="'Описание для администратора'"/>
        <input
            type="text"
            @input="(e) => input(e, 'admin_descriptions')"
            :value="inputValues.admin_descriptions"
            placeholder="Введите описание"
            class="input-text">
        <span v-if="errorForm?.admin_descriptions?.[0]"
              v-html="errorForm.admin_descriptions[0]"
              class="error-message"/>
      </div>
      <div
          class="administrate-list__item">
        <span class="list__name" v-html="'Предмет'"/>
        <input-select-single
            placeholder="Выберите предмет"
            :list="directory.subject"
            :value="inputValues.subject"
            v-model:value="selectSubject"
            :resetBtn="false"/>
        <span v-if="errorForm?.subject?.[0]"
              v-html="errorForm.subject[0]"
              class="error-message"/>
      </div>
      <div
          class="administrate-list__item">
        <span class="list__name" v-html="'Класс'"/>
        <input-select-single
            placeholder="Выберите класс"
            :list="directory.class"
            :value="inputValues.class"
            v-model:value="selectClass"
            :resetBtn="false"/>
        <span v-if="errorForm?.class?.[0]"
              v-html="errorForm.class[0]"
              class="error-message"/>
      </div>
      <div
          class="administrate-list__item">
        <span class="list__name" v-html="'Тип ГИА'"/>
        <input-select-single
            placeholder="Выберите тип ГИА"
            :list="directory.course_type_gia"
            :value="inputValues.course_type_gia"
            v-model:value="selectCourseTypeQia"
            :resetBtn="false"/>
        <span v-if="errorForm?.course_type_gia?.[0]"
              v-html="errorForm.course_type_gia[0]"
              class="error-message"/>
      </div>
      <div
          class="administrate-list__item">
        <span class="list__name" v-html="'Раздел курса'"/>
        <input-select-single
            placeholder="Выберите раздел курса"
            :list="directory.course_section"
            :value="inputValues.course_section"
            v-model:value="selectCourseSection"
            :resetBtn="false"/>
        <span v-if="errorForm?.course_section?.[0]"
              v-html="errorForm.course_section[0]"
              class="error-message"/>
      </div>
      <div
          class="administrate-list__item">
        <span class="list__name"
              v-html="'Подраздел курса'"/>
        <input-select-single
            placeholder="Выберите подраздел курса"
            :list="directory.course_subsection"
            :value="inputValues.course_subsection"
            v-model:value="selectCourseSubsection"
            :resetBtn="false"/>
        <span v-if="errorForm?.course_subsection?.[0]"
              v-html="errorForm.course_subsection[0]"
              class="error-message"/>
      </div>

      <div
          class="administrate-list__item">
        <span class="list__name" v-html="'Тема'"/>
        <input-search
            placeholder="Фильтр по теме"
            :autocomplete-list="adminAchievementsStore.themeList"
            v-model:value="inputValues.theme"
            :min-length="2"
            @clickItem="onClickTheme"
            :autocomplete-options="{ filter: true }"
        />
        <span v-if="errorForm?.theme?.[0]"
              v-html="errorForm.theme[0]"
              class="error-message"/>
      </div>
      <div
          class="administrate-list__item">
        <span class="list__name" v-html="'Год'"/>
        <div
            class="list-inputs__wrapper">
          <input-select-single
              placeholder="Введите год"
              :list="directory.year"
              :value="inputValues.year"
              v-model:value="selectYear"
              :resetBtn="false"/>
          <input
              v-if="inputValues.year > 9999"
              type="number"
              @input="(e) => input(e, 'year_input')"
              :value="inputValues.year_input"
              placeholder="Укажите год"
              class="input-text ">
        </div>
        <span v-if="errorForm?.year?.[0]"
              v-html="errorForm.year[0]"
              class="error-message"/>
        <span v-if="errorForm?.year_input?.[0]"
              v-html="errorForm.year_input[0]"
              class="error-message"/>
      </div>
      <div
          class="administrate-list__item">
        <span class="list__name" v-html="'Режим'"/>
        <input-select-single
            placeholder="Введите режим"
            :list="directory.mode"
            :value="inputValues.mode"
            v-model:value="selectMode"
            :resetBtn="false"/>
        <span v-if="errorForm?.mode?.[0]"
              v-html="errorForm.mode[0]"
              class="error-message"/>
      </div>
      <div
          class="administrate-list__item">
        <span class="list__name" v-html="'Действие'"/>
        <input-select-single
            placeholder="Введите действие"
            :list="directory.action"
            :value="inputValues.action"
            v-model:value="selectAction"
            :resetBtn="false"/>
        <span v-if="errorForm?.action?.[0]"
              v-html="errorForm.action[0]"
              class="error-message"/>
      </div>
      <div
          class="administrate-list__item">
        <span class="list__name" v-html="'Количество действий / опыта'"/>
        <input
            type="number"
            @input="(e) => input(e, 'experience')"
            :value="inputValues.experience"
            placeholder="Введите количество"
            class="input-text ">
        <span v-if="errorForm?.experience?.[0]"
              v-html="errorForm.experience[0]"
              class="error-message"/>
      </div>
    </div>

    <div class="administrate__footer mt-4">
      <button
          @click="save"
          type="button"
          class="btn btn-primary">
        Сохранить
      </button>
      <button
          type="button"
          @click="hide"
          class="btn btn-outline-primary mx-4">
        Отмена
      </button>
    </div>
  </div>
</template>

<script setup>
import useAdminAchievementsStore from '~/stores/admin-achievements'
import _debounce from "lodash.debounce";

const route = useRoute();
const router = useRouter();
const props = defineProps(alertContentProps())
const achievement = ref(props.data)
const adminAchievementsStore = useAdminAchievementsStore()
const directory = computed(() => adminAchievementsStore.directory)
const errorForm = computed(() => adminAchievementsStore.errorForm)
const fileInputImage = ref(null)

const inputValues = ref({
  status: achievement?.value?.status || 0,
  subject: achievement?.value?.subject || 0,
  class: achievement?.value?.class || 0,
  course_type_gia: achievement?.value?.course_type_gia || 0,
  course_section: achievement?.value?.course_section || 0,
  course_subsection: achievement?.value?.course_subsection || 0,
  theme: achievement?.value?.theme_name || '',
  year: achievement?.value?.year || 0,
  year_input: achievement?.value?.year_input || 0,
  mode: achievement?.value?.mode || 0,
  action: achievement?.value?.action || 0,
  name: achievement?.value?.name || '',
  image: achievement?.value?.image || '',
  user_descriptions: achievement?.value?.user_descriptions || '',
  admin_descriptions: achievement?.value?.admin_descriptions || '',
  experience: achievement?.value?.experience || 0
})

const previousInputImage = ref({...inputValues.value.image});

const currentTheme = ref();

const onClickTheme = (item) => {
  currentTheme.value = item
};

watch(() => currentTheme.value,
    (theme) => {
      inputValues.value.theme = theme.name
    })

const debouncedFetchAchievementsThemes = _debounce((value) => {
  adminAchievementsStore.fetchAchievementsTheme(value);
}, 300);

watch(
    () => inputValues.value.theme,
    (newValue) => {
      if (newValue.length > 2) {
        debouncedFetchAchievementsThemes(newValue);
      }
    }
);

const input = (e, name) => {
  inputValues.value[name] = e.target.value
}

const fileOnChangeImage = () => {
  inputValues.value.image = fileInputImage?.value?.files[0]
}

const removeImage = () => {
  inputValues.value.image = ''
  achievement.value.image = undefined;
}

const selectStatus = computed({
  get: () => inputValues.value.status,
  set: (value) => {
    inputValues.value.status = value
  }
})

const selectSubject = computed({
  get: () => inputValues.value.subject,
  set: (value) => {
    inputValues.value.subject = value
  }
})

const selectClass = computed({
  get: () => inputValues.value.class,
  set: (value) => {
    inputValues.value.class = value
  }
})

const selectCourseTypeQia = computed({
  get: () => inputValues.value.course_type_gia,
  set: (value) => {
    inputValues.value.course_type_gia = value
  }
})

const selectCourseSection = computed({
  get: () => inputValues.value.course_section,
  set: (value) => {
    inputValues.value.course_section = value
  }
})

const selectCourseSubsection = computed({
  get: () => inputValues.value.course_subsection,
  set: (value) => {
    inputValues.value.course_subsection = value
  }
})

const selectTheme = computed({
  get: () => inputValues.value.theme,
  set: (value) => {
    inputValues.value.theme = value
  }
})

const customYearShow = ref(!!achievement?.value?.year_input)

const selectYear = computed({
  get: () => inputValues.value.year,
  set: (value) => {
    if (value > 9999) { // договоренность с бэком, кастомное поле для этого справочника с id более от 10000
      customYearShow.value = true
    } else {
      customYearShow.value = false
    }

    inputValues.value.year = value
  }
})

const selectMode = computed({
  get: () => inputValues.value.mode,
  set: (value) => {
    inputValues.value.mode = value
  }
})

const selectAction = computed({
  get: () => inputValues.value.action,
  set: (value) => {
    inputValues.value.action = value
  }
})

onUnmounted(() => {
  adminAchievementsStore.errorFormClear()
})

const createAndUpdateBody = (id) => {
  const body = {
    id: id,
    status: inputValues?.value?.status || 0,
    subject: inputValues?.value?.subject || 0,
    class: inputValues?.value?.class || 0,
    course_type_gia: inputValues?.value?.course_type_gia || 0,
    course_section: inputValues?.value?.course_section || 0,
    course_subsection: inputValues?.value?.course_subsection || 0,
    theme: inputValues?.value?.theme || '',
    mode: inputValues?.value?.mode || 0,
    year: inputValues?.value?.year || 0,
    action: inputValues?.value?.action || 0,
    name: inputValues?.value?.name || '',
    image: inputValues?.value?.image || '',
    user_descriptions: inputValues?.value?.user_descriptions || '',
    admin_descriptions: inputValues?.value?.admin_descriptions || '',
    experience: inputValues?.value?.experience || 0
  }

  if (customYearShow.value) {
    body.year_input = inputValues?.value?.year_input
  } else {
    body.year = inputValues?.value?.year || 0
  }

  if (!achievement?.value?.image && inputValues?.value?.image) {
    body.image = inputValues?.value?.image
  }

  return body
}

const hide = () => {
  props.context.hide()
}

const save = async () => {
  props.context.setProgress(true)
  adminAchievementsStore.messSuccess = '';
  const formData = new FormData()
  const {value} = inputValues
  const appendToFormData = (key) => {
    if (value[key]) {
      if (key === 'theme') {
        formData.append(key, currentTheme?.value?.id || achievement?.value?.theme || 0)
        return;
      }

      formData.append(key, value[key])
    }
  }

  const fieldsToAppend = [
    'status', 'subject', 'class',
    'course_type_gia', 'course_section', 'course_subsection',
    'theme', 'mode', 'action', 'year', 'name',
    'user_descriptions', 'admin_descriptions', 'experience'
  ]

  fieldsToAppend.forEach(appendToFormData)

  // Существует ли уже изображение
  const isPrevImage = !!Object.keys(previousInputImage.value).length;

  // Если добавили файл - он есть в инпуте - отправляем на сервер
  if (fileInputImage?.value?.files[0]) {
    formData.append('image', fileInputImage?.value?.files[0])
  }

  // Если мы удалили файл - у нас поле становится пустой строкой - отправляем пустую строку на сервер на удаления файла
  if (!inputValues?.value?.image && isPrevImage) {
    formData.append('image', '')
  }

  if (inputValues?.value.year > 9999) {
    formData.append('year_input', inputValues?.value?.year_input)
  }

  if (achievement?.value.isCreate) {
    await adminAchievementsStore.achievementsCreate(formData).then(id => {
      if (id) {
        adminAchievementsStore.addAchievement(id, createAndUpdateBody(id))
        props.context.hide()
        eventBus.emit('toast:show', {text: `Достижение ${inputValues?.value?.name} успешно создано`})
      }
    })
  } else {
    await adminAchievementsStore.achievementsUpdate(achievement?.value.id, formData)
    .then(id => {
      if (id) {
        adminAchievementsStore.updateAchievement(id, createAndUpdateBody(id))
        props.context.hide()
        eventBus.emit('toast:show', {text: `Достижение ${inputValues?.value?.name} успешно изменено`})
      }
    })
  }

  if (!!adminAchievementsStore.messSuccess) {
    console.log('--adminAchievementsStore.messSuccess:', adminAchievementsStore.messSuccess)
    const getQueryFiltersInFetch = () => {
      const queryParams = {};

      if (!!adminAchievementsStore.filters.courseTypeGia.length) {
        queryParams.course_type_gia =
            adminAchievementsStore.filters.courseTypeGia.join(",");
      }

      if (!!adminAchievementsStore.filters.status.length) {
        queryParams.status = adminAchievementsStore.filters.status.join(",");
      }

      if (!!adminAchievementsStore.filters.subject.length) {
        queryParams.subject = adminAchievementsStore.filters.subject.join(",");
      }

      if (!!adminAchievementsStore.filters.class.length) {
        queryParams.class = adminAchievementsStore.filters.class.join(",");
      }

      return queryParams;
    };
    const filterQuery = getQueryFiltersInFetch();
    const themes = adminAchievementsStore.filters.currentThemes.map((item) => item.id).join(",");
    const queryParams = {...route.query};
    await router.push({query: queryParams});
    await adminAchievementsStore.fetchAchievements({...filterQuery, ...queryParams, theme: themes})
  }

  props.context.setProgress(false)
}
</script>

<style lang="scss">
@import '/assets/scss/theme';

.administrate {
  max-height: calc(100vh - 240px);
  overflow-y: scroll;

  .file-load {
    &__wrapper {
      display: flex;
      flex-direction: column;
    }

    &__name {
      width: 100%;
      margin: 8px 0 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  input.input-text {
    width: 100%;
    height: 44px;
    border: 1px solid #ced6e0;
    border-radius: 8px;
    padding: 10px 16px;
    color: #0c1524;

    &:focus {
      outline: none;
    }
  }
}

.administrate-list {
  display: flex;
  flex-direction: column;
  padding: 0 0 16px 0;

  &__item {
    display: flex;
    flex-direction: column;

    &:not(:last-child) {
      margin-bottom: 16px;
    }

    .list {
      &__name {
        margin-bottom: 6px;
      }
    }

    .list-inputs__wrapper {
      display: flex;
      align-items: center;
      gap: 12px
    }
  }

  .error-message {
    color: #bc2f13;
  }
}
</style>
