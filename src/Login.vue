<template>
  <v-app>
    <Menu/>

    <v-container fluid align-center justify-center fill-height>
      <v-layout align-center justify-center fill-height>
        <v-flex md4 id="login">
          <v-card>
            <v-card-text>
              <div class="text-xs-center">
                <h3 class="font-weight-regular">Swoosh <br> <h4>Sign In</h4></h3>
                <br>
              </div>
              <div v-if="this.errorFlag" class="red--text">
                <v-icon color="red">error</v-icon>
                Login failed. Incorrect username/password
              </div>

              <v-form>
                <v-text-field v-model="login" prepend-icon="person" name="login" label="Username/Email" type="text">
                </v-text-field>
                <v-text-field v-model="pass" prepend-icon="lock" name="password" label="Password" id="password"
                              type="password"></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <router-link :to="{name: 'SignUp'}">
                <v-subheader id="signUpText">No account? Sign Up</v-subheader>
              </router-link>
              <v-spacer></v-spacer>
              <v-btn color="primary" v-on:click="submitLogin">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
  import Menu from "./Menu";

  export default {
    name: "login",
    components: {Menu},
    data() {
      return {
        error: "",
        errorFlag: false,
        login: null,
        pass: null
      }
    },
    created: function () {
      this.checkLoggedIn();
    },
    methods: {
      checkLoggedIn: function () {
        if (this.$cookie.get("currentUser")) {
          this.$router.push("/venues");
        }
      },
      setUser: function (userId, auth) {
        this.$http.get("http://localhost:4941/api/v1/users/" + userId,
          {
            headers: {
              "X-Authorization": auth
            }
          }).then(function (response) {
          let userData = response.data;
          userData['userId'] = userId;
          this.$http.get("http://localhost:4941/api/v1/users/" + userId + "/photo")
            .then(function (response) {
              userData['photo'] = response.url;
            }, function (error) {
              userData['photo'] = "src/assets/defaultProfile.png";
            }).then(function (resolve) {
            this.$cookie.set("currentUser", JSON.stringify(userData));
            this.$router.push("/venues");
          })

        });
      },
      submitLogin: function () {
        this.$http.post("http://localhost:4941/api/v1/users/login",
          JSON.stringify({
            "username": this.login,
            "email": this.login,
            "password": this.pass
          }), {
            headers: {
              "Content-type": "application/json",
            }
          }).then(function (response) {
          const data = response.data;
          this.$cookie.set("authToken", data.token);
          this.setUser(response.data.userId, data.token);
        }, (function (error) {
          this.error = error;
          this.errorFlag = true;
        }));
      }
    }
  }
</script>

<style scoped>
  #signUpText {
    color: #1a73e8;
  }
</style>
