<template>
  <div
      :id="idAlert"
      class="alert alert-primary d-flex justify-content-between alert-dismissible"
      role="alert"
  >
    {{ text }}
    <button
        type="button"
        class="btn-close"
        data-bs-dismiss="alert"
        :data-bs-target="'#' + idAlert"
        aria-label="Закрыть"
        @click="onClickCloseAlert"
    />
  </div>
</template>

<script>
export default {
  name: "AlertComponent",
  props: {
    idAlert: {
      type: String,
      default: null
    },
    text: {
      type: String,
      default: "Вы можете рассчитать свою норму калорий на странице настроек."
    }
  },
  emits: ['close'],
  methods: {
    onClickCloseAlert() {
      this.$emit('close');
    }
  }
}
</script>
