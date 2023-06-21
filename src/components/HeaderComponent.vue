<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary sticky-top">
    <div class="container-fluid justify-content-start">
      <router-link to="/main" class="navbar-brand">
        <img src="/logo.png" alt="ЗОЖ-Учёт" width="30">
      </router-link>
      <div>
        <router-link to="/main" class="mx-3">Главная</router-link>
        <router-link to="/statistic" class="mx-3">Статистика</router-link>
        <router-link to="/product-list" class="mx-3">Справочник</router-link>
      </div>
    </div>
  </nav>
</template>

<script>


export default {
  name: "Header"
}

</script>

<style scoped>
  a {
    text-decoration: none;
    color: black;
    font-weight: bold;
    font-size: large;
  }


</style>
