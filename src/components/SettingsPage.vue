<template>
  <div class="content">
    <h4>Персональные настройки</h4>
    <div class="my-4">
      <h5>Пол</h5>
      <div class="form-check">
        <input
            v-model="sex"
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
            v-model="sex"
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

    <div class="my-4">
      <h5>Возраст</h5>
      <div class="input-group mb-3">
        <input
            v-model="age"
            type="text"
            class="form-control"
            placeholder="Введите свой возраст"
            aria-label="Username"
            min="0"
            max="200"
        >
      </div>
    </div>

    <div class="my-4">
      <h5>Рост</h5>
      <div class="input-group mb-3">
        <input
            v-model="height"
            type="number"
            inputmode="numeric"
            class="form-control"
            placeholder="Введите свой рост в см"
            aria-label="Username"
            aria-describedby="basic-addon1"
            min="0"
            max="300"
        >
        <span class="input-group-text">
          см
        </span>
      </div>
    </div>

    <div class="my-4">
      <h5>
        Вес
      </h5>
      <div class="input-group mb-3">
        <input
            v-model="weight"
            type="text"
            class="form-control"
            placeholder="Введите свой вес в кг"
            aria-label="Username"
            aria-describedby="basic-addon1"
            min="0"
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
            v-model="activity"
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
    <button
        class="btn btn-outline-primary"
        :disabled="!checkForms"
    >
      Сохранить
    </button>
  </div>
</template>

<script>
export default {
  name: "SettingsPage",
  data() {
    return {
      sex: null,
      weight: null,
      height: null,
      age: null,
      activity: 1.2
    }
  },
  computed: {
    checkForms() {
      return true;
    },
    normOfCalories() {
      if (this.sex === "female") {
        return (10 * this.weight + 6.25 * this.height - 5 * this.age - 161) * this.activity;
      } else {
        return (10 * this.weight + 6.25 * this.height - 5 * this.age + 5) * this.activity;
      }
    }
  },
  methods: {
    saveSettings() {
      //отправка в pinia
    }
  }
}
</script>

<style scoped>
.input-group {
  width: 20em;
}
</style>
