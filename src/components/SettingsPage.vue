<template>
  <div class="content">
    <h4 class="heading-with-margin">Персональные настройки</h4>
    <div class="row">
      <div class="col">
        <!--   пол    -->
        <div class="mb-4">
          <h6 class="heading-with-margin">Пол</h6>
          <div class="form-check">
            <input
                v-model="input.gender.value"
                class="form-check-input"
                type="radio"
                name="gender"
                value="female"
            >
            <label
                class="form-check-label"
                for="flexRadioDefault1"
            >
              Женский
            </label>
          </div>
          <div class="form-check">
            <input
                v-model="input.gender.value"
                class="form-check-input"
                type="radio"
                name="gender"
                value="male"
            >
            <label
                class="form-check-label"
                for="flexRadioDefault2"
            >
              Мужской
            </label>
          </div>
        </div>

        <!--   возраст    -->
        <input-with-validation
            :input-value="input.age.value"
            :title="input.age.title"
            :unit="input.age.unit"
            :pattern="input.age.pattern"
            :min-value="input.age.minValue"
            :max-value="input.age.maxValue"
            @input-form="onInputForm(input.age, $event)"
            @check-form="onCheckForm(input.age, $event)"
        />

        <!--   рост    -->
        <input-with-validation
            :input-value="input.height.value"
            :title="input.height.title"
            :unit="input.height.unit"
            :pattern="input.height.pattern"
            :min-value="input.height.minValue"
            :max-value="input.height.maxValue"
            @input-form="onInputForm(input.height, $event)"
            @check-form="onCheckForm(input.height, $event)"
        />

        <!--   вес    -->
        <input-with-validation
            :input-value="input.weight.value"
            :title="input.weight.title"
            :unit="input.weight.unit"
            :pattern="input.weight.pattern"
            :min-value="input.weight.minValue"
            :max-value="input.weight.maxValue"
            @input-form="onInputForm(input.weight, $event)"
            @check-form="onCheckForm(input.weight, $event)"
        />

        <!--   активность    -->
        <div class="my-4">
          <h6 class="heading-with-margin">
            {{ input.activity.title }}
          </h6>
          <div class="input-group small-input-group mb-3">
            <select
                v-model="input.activity.value"
                class="form-select"
            >
              <option
                  selected
                  value="1.2"
              >
                Минимальная активность
              </option>
              <option value="1.375">
                Слабый уровень активности
              </option>
              <option value="1.55">
                Умеренный уровень активности
              </option>
              <option value="1.7">
                Тяжелая или трудоемкая активность
              </option>
              <option value="1.9">
                Экстремальный уровень
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="col">
        <h6 class="heading-with-margin">
          Норма
        </h6>
        {{ normOfCalories }} кКал/день
      </div>
    </div>

    <button
        class="btn btn-labeled btn-success"
        :disabled="!checkForms"
        @click="onClickSaveSettings"
    >
      Сохранить
    </button>
  </div>
</template>

<script>
import {useRecordsStore} from "../store/index.ts";
import {mapActions} from "pinia";
import InputWithValidation from "./InputWithValidation.vue";

export default {
  name: "SettingsPage",
  components: {InputWithValidation},
  data() {
    return {
      recordsStore: useRecordsStore(),
      input: {
        gender: {
          title: 'Пол',
          value: 'female'
        },
        weight: {
          title: 'Вес',
          unit: 'кг',
          value: null,
          pattern: /([0-9]*[.])?[0-9]+/,
          minValue: 0,
          maxValue: null,
          isValid: false
        },
        height: {
          title: 'Рост',
          unit: 'см',
          value: null,
          pattern: /([0-9]*[.])?[0-9]+/,
          minValue: 0,
          maxValue: 300,
          isValid: false
        },
        age: {
          title: 'Возраст',
          unit: null,
          value: null,
          pattern: /^[0-9]+$/,
          minValue: 0,
          maxValue: 200,
          isValid: false
        },
        activity: {
          title: 'Степень активности',
          value: 1.2
        }
      }
    }
  },
  computed: {
    checkForms() {
      return (this.input.height.isValid && this.input.weight.isValid && this.input.age.isValid);
    },
    normOfCalories() {
      if (!this.checkForms) {
        //если формы не валидны, не используем формулу
        return 0;
      }
      return (this.input.gender.value === 'female') ?
          Math.round((10 * this.input.weight.value + 6.25 * this.input.height.value - 5 * this.input.age.value - 161) * this.input.activity.value) :
          Math.round((10 * this.input.weight.value + 6.25 * this.input.height.value - 5 * this.input.age.value + 5) * this.input.activity.value);
    }
  },
  beforeMount() {
    this.input.gender.value = this.recordsStore.settings.gender;
    this.input.age.value = this.recordsStore.settings.age;
    this.input.activity.value = this.recordsStore.settings.activity;
    this.input.weight.value = this.recordsStore.settings.weight;
    this.input.height.value = this.recordsStore.settings.height;
  },
  methods: {
    onClickSaveSettings() {
      //отправка в pinia
      this.recordsStore.setSettings({
        normOfCalories: this.normOfCalories,
        weight: this.input.weight.value,
        height: this.input.height.value,
        age: this.input.age.value,
        gender: this.input.gender.value,
        activity: this.input.activity.value
      });
    },
    onInputForm(inputRef, e) {
      inputRef.value = e.inputValue;
    },
    onCheckForm(inputRef, e) {
      inputRef.isValid = e.isValid;
    },
    ...mapActions(useRecordsStore, {
      setSettings: 'setSettings'
    })
  }
}
</script>
