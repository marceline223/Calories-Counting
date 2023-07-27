<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary sticky-top mb-2">
    <div class="container-fluid justify-content-start">
      <router-link
          to="/main"
          class="navbar-brand"
      >
        <img
            class="logo"
            src="/logo.png"
            alt="ЗОЖ-Учёт"
        >
      </router-link>
      <div>
        <router-link
            to="/main"
            class="header-link mx-3"
        >
          Главная
        </router-link>
        <router-link
            to="/statistic"
            class="header-link mx-3"
        >
          Статистика
        </router-link>
        <router-link
            to="/product-list"
            class="header-link mx-3"
        >
          Справочник
        </router-link>
        <router-link
            to="/settings"
            class="header-link mx-3"
        >
          Настройки
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script>


export default {
  name: "HeaderComponent"
}

</script>

<style scoped>
.header-link {
  text-decoration: none;
  color: black;
  font-size: medium;
  font-weight: bold;
}

.logo {
  width: 2em;
}
</style>
