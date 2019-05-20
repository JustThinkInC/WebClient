<template>
  <v-app>
    <Menu/>

    <v-carousel hide-controls hide-delimiters height="100vh">
      <v-carousel-item v-for="i in 7" :src="'src/assets/'+i+'.jpg'" :key="i">
        <v-sheet color="transparent" height="100%">
          <v-layout mt-5 fill-height justify-center>
            <span class="text-md-center">
              <h1><i>Swoosh</i></h1>
              <h2><i>Your venue manager</i></h2>
            </span>
          </v-layout>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>

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
