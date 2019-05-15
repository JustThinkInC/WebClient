<template>
  <v-app>
    <Menu/>

    <v-layout align-center fill-height id="profileCard">
      <v-flex md4 offset-sm4>
        <v-card>
          <v-img :src="currentUser.profilePhoto">
            <v-layout column fill-height>
              <v-card-title>
                <!--TODO open edit form-->
                <v-spacer></v-spacer>
                <v-btn icon class="mr-3">
                  <v-icon>edit</v-icon>
                </v-btn>
              </v-card-title>

              <v-spacer></v-spacer>

              <v-card-title class="white--text pl-5 pt-5">
                <div class="display-1 pl-5 pt-5">Example</div>
              </v-card-title>
            </v-layout>
          </v-img>

          <v-list>
            <br>
            <v-list-tile>
              <v-list-tile-action></v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title>{{currentUser.username}}</v-list-tile-title>
                <v-list-tile-sub-title>Username</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider inset></v-divider>

            <v-list-tile>
              <v-list-tile-action></v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title>{{currentUser.givenName}}</v-list-tile-title>
                <v-list-tile-sub-title>Given name</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider inset></v-divider>

            <v-list-tile>
              <v-list-tile-action></v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title>{{currentUser.lastName}}</v-list-tile-title>
                <v-list-tile-sub-title>Last name</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>


            <v-divider inset></v-divider>

            <v-list-tile>
              <v-list-tile-action></v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title>{{currentUser.email}}</v-list-tile-title>
                <v-list-tile-sub-title>Email
                  <v-icon small color="indigo">mail</v-icon>
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider inset></v-divider>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>


  </v-app>
</template>

<script>
  import Menu from "./Menu";

  export default {
    name: "Profile",
    data() {
      return {
        currentUser: JSON.parse(this.$cookie.get("currentUser")),
      }
    },
    components: {Menu}
  }
</script>

<style scoped>

  #profileCard {
    margin-top: 5%;
  }

</style>
