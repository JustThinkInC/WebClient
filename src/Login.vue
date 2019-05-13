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
    methods: {
      submitLogin: function () {
        console.log(this.login, this.pass);
        this.$http.post("http://localhost:4941/api/v1/users/login",
          JSON.stringify({
            "username": this.login,
            "email": "",
            "password": this.pass
          }), {
            headers: {
              "Content-type": "application/json",
            }
          }).then(function (response) {
          this.$cookie.set("authToken", response.data.token);
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
