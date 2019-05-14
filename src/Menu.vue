<template>
  <div>
    <v-layout>
      <v-toolbar id="NavMenu" fixed>
        <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
        <v-toolbar-title>Swoosh</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn flat>Link One</v-btn>
          <v-btn flat>Link Two</v-btn>
          <v-btn flat>Link Three</v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-navigation-drawer v-model="drawer" absolute temporary>
        <v-list class="pa-1">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <v-icon v-if="currentUser">
                {{ this.currentUser.profilePhoto}}
              </v-icon>
              <v-icon v-else>person</v-icon>
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>
                <!--Show username if user logged in, else show sign in-->
                <div v-if="currentUser">
                  <router-link :to="{name: 'profile'}">{{ this.currentUser.username }}</router-link>
                </div>
                <router-link v-else :to="{name: 'login'}">Sign In</router-link>

              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>

        <v-list class="pt-0" dense>
          <v-divider></v-divider>

          <!--<v-list-tile v-for="item in items" :key="item.title" :to="item.route">-->
          <!--Home option-->
          <v-list-tile :to="'/'">
            <v-list-tile-action>
              <v-icon>home</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>Home</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <!--Venues option-->
          <v-list-tile :to="'/venues'">
            <v-list-tile-action>
              <v-icon>place</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>Venues</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <!--Logout option, only if user logged in-->
          <v-list-tile v-if="currentUser" v-on:click="logout">
            <v-list-tile-action>
              <v-icon>exit_to_app</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>Log out</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

        </v-list>
      </v-navigation-drawer>
    </v-layout>
  </div>
</template>


<script>
  export default {
    name: "Menu",
    data() {
      return {
        drawer: false,
        currentUser: null,
      }
    },
    mounted: function () {
      this.getCurrentUser();
    },
    methods: {
      getCurrentUser: function () {
        this.currentUser = JSON.parse(this.$cookie.get("currentUser"));
      },
      logout: function () {
        this.$cookie.delete("currentUser");
        this.$cookie.delete("authToken");
        location.reload();  // Refresh page
      }
    }
  }
</script>

<style scoped>

  #NavMenu {
    margin-bottom: 5%;
  }


</style>
