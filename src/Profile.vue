<template>
  <v-app>
    <Menu/>

    <v-layout align-center fill-height id="profileCard">
      <v-flex md4 offset-sm4>
        <v-card>
          <v-img :src="getUserPhoto()" height="300px">
            <v-layout column fill-height>
              <v-card-title>
                <!--TODO open edit form-->
                <v-spacer></v-spacer>
                <v-btn icon class="mr-3" v-on:click="editProfile = !editProfile">
                  <v-icon>edit</v-icon>
                </v-btn>

                <v-menu>
                  <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on">
                      <v-icon>more_vert</v-icon>
                    </v-btn>
                  </template>

                  <!--TODO: Add photo uploader-->
                  <v-list>
                    <v-list-tile v-on:click="addPhoto()">
                      <input type="file" ref="file" style="display: none" @change="addPhoto">

                      <v-list-tile-title hover v-on:click="$refs.file.click()">Set profile photo
                      </v-list-tile-title>
                    </v-list-tile>

                    <v-list-tile v-on:click="deleteProfilePhoto()">
                      <v-list-tile-title>Delete profile photo</v-list-tile-title>
                    </v-list-tile>
                  </v-list>

                </v-menu>

              </v-card-title>
            </v-layout>
          </v-img>

          <v-list>
            <br>
            <v-list-tile>
              <v-list-tile-action></v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-sub-title>Username</v-list-tile-sub-title>
                <v-list-tile-title>{{currentUser.username}}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider inset></v-divider>

            <v-list-tile>
              <v-list-tile-action></v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-sub-title>Given name</v-list-tile-sub-title>
                <v-list-tile-title>{{currentUser.givenName}}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider inset></v-divider>

            <v-list-tile>
              <v-list-tile-action></v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-sub-title>Last name</v-list-tile-sub-title>
                <v-list-tile-title>{{currentUser.familyName}}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>


            <v-divider inset></v-divider>

            <v-list-tile>
              <v-list-tile-action></v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-sub-title>Email
                  <v-icon small color="indigo">mail</v-icon>
                </v-list-tile-sub-title>
                <v-list-tile-title>{{currentUser.email}}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider inset></v-divider>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>


    <v-snackbar right top v-model="successSnackbar" color="success">
      {{message}}
      <v-btn color="white" flat @click="successSnackbar = false">Close</v-btn>
    </v-snackbar>

    <v-snackbar right top v-model="errorSnackbar" color="error">
      {{message}}
      <v-btn color="white" flat @click="errorSnackbar = false">Close</v-btn>
    </v-snackbar>

  </v-app>
</template>

<script>
  import Menu from "./Menu";

  export default {
    name: "Profile",
    data() {
      return {
        currentUser: JSON.parse(this.$cookie.get("currentUser")),
        editProfile: false,
        uploadPhoto: false,
        successSnackbar: false,
        errorSnackbar: false,
        filename: "",
        message: "",
        MAX_PHOTO_SIZE: 20
      }
    },
    created: function () {
      this.checkLoggedIn();
    },
    methods: {
      checkLoggedIn: function () {
        if (!this.$cookie.get("currentUser")) {
          this.$router.push("/venues");
        }
      },
      deleteProfilePhoto: function () {
        this.$http.delete("http://localhost:4941/api/v1/users/" + this.currentUser.userId + "/photo")
          .then(function (response) {
            this.message = "Photo deleted!";
            this.successSnackbar = true;
            this.errorSnackbar = false;
          }, function (error) {
            this.message = "Could not delete photo";
            this.successSnackbar = false;
            this.errorSnackbar = true;
          });
      },
      setNewPhoto: function () {
        this.currentUser.photo = "http://localhost:4941/api/v1/users/" + this.currentUser.userId + "/photo";
        this.$cookie.set("currentUser", JSON.stringify(this.currentUser))
      },
      addPhoto: function () {
        this.photoFile = this.$refs.file.files[0];
        if (!this.photoFile) return;
        if ((this.photoFile.size / (1024 * 1024)) > this.MAX_PHOTO_SIZE) {
          this.message = "Photo size must be less than 20MB";
          this.errorSnackbar = true;
          this.successSnackbar = false;
          return;
        }
        console.log("NAME " + this.photoFile.name);
        console.log("LEN " + this.photoFile.type);
        // return;
        const reader = new FileReader();
        this.$http.put("http://localhost:4941/api/v1/users/" + this.currentUser.userId + "/photo",
          this.photoFile,
          {
            headers: {
              "Content-Type": this.photoFile.type,
              "X-Authorization": this.$cookie.get("authToken")
            }
          }).then(function (response) {
          this.message = "Photo set!";
          this.successSnackbar = true;
          this.errorSnackbar = false;
          this.setNewPhoto();
        }, function (error) {
          this.message = "Could not set photo";
          this.successSnackbar = false;
          this.errorSnackbar = true;
        })
      },
      getUserPhoto: function () {
        return this.currentUser.photo;
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
