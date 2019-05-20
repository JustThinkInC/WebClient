<template>
  <v-app>
    <Menu/>

    <v-container align-center mt-5 justify-center>
      <v-layout align-center justify-center column>
        <h1>Swoosh</h1>
        <h2>Your venue manager</h2>
        <v-carousel>
          <v-carousel-item src="src/assets/defaultProfile.jpg"></v-carousel-item>
          <v-carousel-item src="src/assets/logo.png"></v-carousel-item>
          <v-carousel-item src="src/assets/defaultProfile.png"></v-carousel-item>
        </v-carousel>
      </v-layout>
    </v-container>

  </v-app>
</template>

<script>
  import Menu from "./Menu";

  export default {
    name: "Home",
    components: {Menu}
  }
</script>

<style scoped>

</style>
