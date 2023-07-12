<template>
  <div class="content">
    <h4>Персональные настройки</h4>
    <div class="row">
      <div class="col">
        <!--   ПОЛ     -->
        <div class="mb-4">
          <h5>Пол</h5>
          <div class="form-check">
            <input
                v-model="input.sex.value"
                class="form-check-input"
                type="radio"
                name="sex"
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
                v-model="input.sex.value"
                class="form-check-input"
                type="radio"
                name="sex"
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

        <!--   ВОЗРАСТ     -->
        <div class="my-4">
          <h5>
            Возраст
            <i
                v-if="input.age.isDirty"
                class="bi"
                :class="getIconClass('age')"
            />
          </h5>
          <div class="input-group mb-3">
            <input
                :value="input.age.value"
                type="text"
                class="form-control"
                placeholder="Введите свой возраст"
                @input="onInputForm('age', $event)"
            >
          </div>
        </div>

        <!--   РОСТ     -->
        <div class="my-4">
          <h5>
            Рост
            <i
                v-if="input.height.isDirty"
                class="bi"
                :class="getIconClass('height')"
            />
          </h5>
          <div class="input-group mb-3">
            <input
                :value="input.height.value"
                type="text"
                inputmode="numeric"
                class="form-control"
                placeholder="Введите свой рост в см"
                @input="onInputForm('height', $event)"
            >
            <span class="input-group-text">
              см
            </span>
          </div>
        </div>

        <!--   ВЕС     -->
        <div class="my-4">
          <h5>
            Вес
            <i
                v-if="input.weight.isDirty"
                class="bi"
                :class="getIconClass('weight')"
            />
          </h5>
          <div class="input-group mb-3">
            <input
                :value="input.weight.value"
                type="text"
                class="form-control"
                placeholder="Введите свой вес в кг"
                @input="onInputForm('weight', $event)"
            >
            <span class="input-group-text">
              кг
            </span>
          </div>
        </div>

        <div class="my-4">
          <h5>
            Степень активности
          </h5>
          <div class="input-group mb-3">
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
        <h5>
          Норма
        </h5>
        {{ normOfCalories }} кКал/день
      </div>
    </div>

    <button
        class="btn btn-labeled btn-success"
        :disabled="!checkForms"
        @click="saveSettings"
    >
      Сохранить
    </button>
  </div>
</template>

<script>
import {useRecordsStore} from "../store/index.ts";
import {mapActions} from "pinia";

export default {
  name: "SettingsPage",
  data() {
    return {
      recordsStore: useRecordsStore(),
      input: {
        sex: {
          value: 'female'
        },
        weight: {
          value: null,
          pattern: /^[0-9]+$/,
          isDirty: false,
          isValid: false
        },
        height: {
          value: null,
          pattern: /^[0-9]+$/,
          isDirty: false,
          isValid: false
        },
        age: {
          value: null,
          pattern: /^[0-9]+$/,
          isDirty: false,
          isValid: false
        },
        activity: {
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
      return (this.input.sex.value === 'female') ?
          Math.round((10 * this.input.weight.value + 6.25 * this.input.height.value - 5 * this.input.age.value - 161) * this.input.activity.value) :
          Math.round((10 * this.input.weight.value + 6.25 * this.input.height.value - 5 * this.input.age.value + 5) * this.input.activity.value);
    }
  },
  beforeMount() {
    // this.recordsStore.fetchSettings();
    this.input.sex.value = this.recordsStore.settings.sex;
    this.input.age.value = this.recordsStore.settings.age;
    this.input.activity.value = this.recordsStore.settings.activity;
    this.input.weight.value = this.recordsStore.settings.weight;
    this.input.height.value = this.recordsStore.settings.height;
    this.input.age.isValid = this.input.age.pattern.test(this.input.age.value) && (this.input.age.value < 200);
    this.input.height.isValid = this.input.height.pattern.test(this.input.height.value) && (this.input.height.value < 300);
    this.input.weight.isValid = this.input.weight.pattern.test(this.input.weight.value);
  },
  methods: {
    saveSettings() {
      //отправка в pinia
      this.recordsStore.setSettings({
        normOfCalories: this.normOfCalories,
        weight: this.input.weight.value,
        height: this.input.height.value,
        age: this.input.age.value,
        sex: this.input.sex.value,
        activity: this.input.activity.value
      });
      console.log('отправлено');
    },
    onInputForm(type, e) {
      switch (type) {
        case 'age':
          this.input.age.value = e.target.value;
          this.input.age.isValid = this.input.age.pattern.test(this.input.age.value) && (this.input.age.value < 200) && (this.input.age.value > 0);
          this.input.age.isDirty = true;
          break;
        case 'height':
          this.input.height.value = e.target.value;
          this.input.height.isValid = this.input.height.pattern.test(this.input.height.value) && (this.input.height.value < 300) && (this.input.height.value > 0);
          this.input.height.isDirty = true;
          break;
        case 'weight':
          this.input.weight.value = e.target.value;
          this.input.weight.isValid = this.input.weight.pattern.test(this.input.weight.value) && (this.input.weight.value > 0);
          this.input.weight.isDirty = true;
          break;
      }
    },
    getIconClass(type) {
      switch (type) {
        case 'age':
          return this.input.age.isValid ? 'bi-check-circle text-success' : 'bi-exclamation-circle text-danger';
        case 'height':
          return this.input.height.isValid ? 'bi-check-circle text-success' : 'bi-exclamation-circle text-danger';
        case 'weight':
          return this.input.weight.isValid ? 'bi-check-circle text-success' : 'bi-exclamation-circle text-danger';
      }
    },
    ...mapActions(useRecordsStore, {
      setSettings: 'setSettings'
    })
  }
}
</script>

<style scoped>
.input-group {
  width: 20em;
}

i {
  font-size: 1em;
}
</style>
