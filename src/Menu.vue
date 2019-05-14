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

          <v-list-tile v-for="item in items" :key="item.title" :to="item.route">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
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
        items: [
          {title: 'Home', icon: 'home', route: '/'},
          {title: 'Venues', icon: 'place', route: 'venues'},
          this.currentUser ? {title: 'logout', icon: 'exit_to_app', route: '/'} : {}//TODO: Add log out function call here
        ]
      }
    },
    computed: {
      getCurrentUser: function() {
        this.currentUser = this.$cookie.get("currentUser");
      }
    }
  }
</script>

<style scoped>

  #NavMenu {
    margin-bottom: 5%;
  }


</style>
