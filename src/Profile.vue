<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-app>
    <Menu/>

    <!--View-->
    <v-layout align-center fill-height id="profileCard">
      <v-flex md4 offset-sm4>
        <v-card>
          <v-img :src="getUserPhoto()" height="300px">
            <v-layout column fill-height>
              <v-card-title>
                <v-spacer></v-spacer>
                <v-btn icon class="mr-3" v-on:click="edit = !edit">
                  <v-icon>edit</v-icon>
                </v-btn>

                <v-menu>
                  <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on">
                      <v-icon>more_vert</v-icon>
                    </v-btn>
                  </template>

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

    <!--Edit-->
    <v-layout fluid align-center fill-height justify-space-around row>
      <v-dialog v-model="edit" width="50%">
        <v-card>
          <v-card-text>
            <div class="text-xs-center">
              <h3 class="font-weight-regular">Swoosh<br> <h4>Edit your profile</h4></h3>
              <br><br>
            </div>
            <!--Error message for invalid form-->
            <div v-if="this.errorFlag" class="red--text">
              <v-icon color="red">error</v-icon>
              {{error}}
            </div>
            <v-form v-model="valid">
              <!--Given name & Last Name-->
              <v-flex>
                <v-text-field v-model="editProfileValues.givenName" label="Given Name" type="text">
                </v-text-field>
              </v-flex>
              <v-flex>
                <v-text-field v-model="editProfileValues.familyName" label="Family Name" type="text"></v-text-field>
              </v-flex>

              <!--Password change-->
              <v-label v-on:click="editPassword = !editPassword"><a>Change password</a></v-label>

            </v-form>
          </v-card-text>

          <!--Cancel & Edit buttons-->
          <v-card-actions>
            <v-btn color="primary" v-on:click="edit = !edit">Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" v-on:click="editProfile">Edit</v-btn>
          </v-card-actions>

        </v-card>
      </v-dialog>
    </v-layout>

    <!--Edit password-->
    <v-layout fluid align-center fill-height justify-space-around row>
      <v-dialog v-model="editPassword" width="50%">
        <v-card>
          <v-card-text>
            <div class="text-xs-center">
              <h3 class="font-weight-regular">Swoosh<br> <h4>Edit Password</h4></h3>
              <br><br>
            </div>
            <!--Error message for invalid form-->
            <div v-if="this.errorPasswordFlag" class="red--text">
              <v-icon color="red">error</v-icon>
              {{errorPassword}}
            </div>
            <v-form v-model="valid">
              <v-flex>
                <v-text-field v-model="currentPassword" label="Current Password" type="password">
                </v-text-field>
              </v-flex>
              <v-flex>
                <v-text-field v-model="password" label="New Password" type="password"></v-text-field>
              </v-flex>
            </v-form>
          </v-card-text>

          <!--Cancel & Edit buttons-->
          <v-card-actions>
            <v-btn color="primary" v-on:click="editPassword = !editPassword">Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" v-on:click="checkPassword">Edit</v-btn>
          </v-card-actions>

        </v-card>
      </v-dialog>
    </v-layout>

    <v-snackbar right top v-model="successSnackbar" color="success">
      {{message}}
      <v-btn color="white" flat icon @click="successSnackbar = false"><v-icon>close</v-icon></v-btn>
    </v-snackbar>

    <v-snackbar right top v-model="errorSnackbar" color="error">
      {{message}}
      <v-btn color="white" flat icon @click="errorSnackbar = false"><v-icon>close</v-icon></v-btn>
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
        editProfileValues: [
          {givenName: ""},
          {familyName: ""},
        ],
        currentPassword: "",
        password: "",
        editPassword: false,
        valid: false,
        edit: false,
        uploadPhoto: false,
        successSnackbar: false,
        errorSnackbar: false,
        error: "",
        errorFlag: "",
        errorPasswordFlag: false,
        errorPassword: "",
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
        this.$http.delete("http://localhost:4941/api/v1/users/" + this.currentUser.userId + "/photo", {
          headers: {
            "X-Authorization": this.$cookie.get("authToken")
          }
        }).then(function (response) {
          this.message = "Photo deleted!";
          this.successSnackbar = true;
          this.errorSnackbar = false;
          this.currentUser.photo = "src/assets/defaultProfile.png";
          this.$cookie.set("currentUser", this.currentUser);
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
        this.$http.put("http://localhost:4941/api/v1/users/" + this.currentUser.userId + "/photo", this.photoFile,
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
        });
      },
      getUserPhoto: function () {
        return this.currentUser.photo;
      },
      checkPassword: function () {
        if (!this.currentPassword) {
          this.errorPassword = "Please enter your current password to set a new one";
          this.errorPasswordFlag = true;
          return;
        } else if (!this.password) {
          this.errorPassword = "Please enter a new password";
          this.errorPasswordFlag = true;
          return;
        }


        this.$http.post("http://localhost:4941/api/v1/users/login",
          JSON.stringify({
            "username": this.currentUser.username,
            "password": this.currentPassword,
          }), {headers: {"Content-type": "application/json"}}).then(function (response) {
          this.$cookie.set("authToken", response.data.token);
          this.changePassword();
        }), function (error) {
          this.errorPasswordFlag = true;
          this.errorPassword = "Password is incorrect";
        };

      },
      changePassword: function () {
        this.$http.patch("http://localhost:4941/api/v1/users/" + this.currentUser.userId,
          {"password": this.password}, {
            headers: {
              "Content-type": "application/json",
              "X-Authorization": this.$cookie.get("authToken")
            }
          }).then(function (response) {
          this.message = "Password updated";
          this.password = "";
          this.currentPassword = "";
          this.successSnackbar = true;
          this.errorSnackbar = false;
          this.editPassword = false;
        }, function (error) {
          this.message = "Failed to update password";
          this.successSnackbar = false;
          this.errorSnackbar = true;
        })
      },
      editProfile: function () {
        let query = {};
        for (let i = 0; i < this.editProfileValues.length; i++) {
          if (this.editProfileValues[i]) {
            query.push()
          }
        }

        // for (let key in this.editProfileValues) {
        //   if (this.editProfileValues.hasOwnProperty(key)) {
        //     query[key] = this.editProfileValues[key];
        //   }
        // }

        if (Object.entries(query).length === 0) {
          this.errorFlag = true;
          this.error = "Please fill in the form";
          return;
        }

        return;

        this.$http.patch("http://localhost:4941/api/v1/users/" + this.currentUser.userId, query,
          {
            headers: {
              "Content-type": "application/json",
              "X-Authorization": this.$cookie.get("authToken")
            }
          }).then(function (response) {
          this.updateCookie();
          this.edit = !this.edit;
          this.message = "Edit saved!";
          this.successSnackbar = true;
          this.errorSnackbar = false;
        }, function (error) {
          this.message = "Edit failed";
          this.errorSnackbar = true;
          this.successSnackbar = false;
        });
      },
      updateCookie: function () {
        this.$http.get("http://localhost:4941/api/v1/users/" + this.currentUser.userId)
          .then(function (response) {
            this.currentUser.givenName = response.data.givenName;
            this.currentUser.familyName = response.data.familyName;
          });
      }
    }
    ,
    components: {
      Menu
    }
  }
</script>

<style scoped>

  #profileCard {
    margin-top: 5%;
  }

</style>
