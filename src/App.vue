<template>
    <main-page></main-page>
</template>

<script>
  import MainPage from "./components/MainPage.vue";
  export default {
    components: {MainPage}
  }

</script>


<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
