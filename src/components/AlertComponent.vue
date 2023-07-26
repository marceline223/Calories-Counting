<template>
  <div
      :id="idAlert"
      class="alert alert-primary d-flex justify-content-between"
      role="alert"
  >
    Вы можете рассчитать свою норму калорий на странице настроек.
    <button
        type="button"
        class="btn-close"
        data-bs-dismiss="alert"
        :data-bs-target="'#' + idAlert"
        aria-label="Закрыть"
    />
  </div>
</template>

<script>
export default {
  name: "AlertComponent",
  props: {
    idAlert: {
      type: String,
      default: 'mainPageAlert'
    }
  }
}
</script>

<style scoped>

</style>
