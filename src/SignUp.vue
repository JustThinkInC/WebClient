<template>
  <v-app>
    <Menu/>
    <v-container fluid align-center justify-center id="container">
      <v-layout align-center justify-center fill-height>
        <v-flex md5 id="login">
          <v-card>
            <v-card-text>
              <div class="text-xs-center">
                <h3 class="font-weight-regular">Swoosh <br> <h4>Sign Up</h4></h3>
                <br><br>
              </div>
              <div v-if="this.errorFlag" class="red--text">
                <v-icon color="red">error</v-icon>
                {{this.error}}
              </div>
              <v-form v-model="valid">
                <v-layout wrap>
                  <!--First Name and Last Name-->
                  <v-flex>
                    <v-text-field outline v-model="givenName" name="name" :rules="[rules.required]" label="Name"
                                  type="text">
                    </v-text-field>
                  </v-flex>

                  <v-spacer></v-spacer>

                  <v-flex>
                    <v-text-field outline v-model="lastName" name="lastName" :rules="[rules.required]" label="Last Name"
                                  id="lastName" type="text"></v-text-field>
                  </v-flex>

                  <!--Username & Email-->
                  <v-flex>
                    <v-text-field outline v-model="username" name="username" :rules="[rules.required]"
                                  label="Username" id="username" type="text"></v-text-field>
                  </v-flex>

                  <v-spacer></v-spacer>

                  <v-flex>
                    <v-text-field outline v-model="email" name="email" :rules="[rules.required, rules.emailRule]"
                                  label="Email" id="email" type="email">
                    </v-text-field>
                  </v-flex>

                  <!--Password-->
                  <v-flex>
                    <v-text-field outline v-model="password" name="password" :rules="[rules.required, rules.min]"
                                  label="Password" id="password" type="password">
                    </v-text-field>
                  </v-flex>

                  <v-spacer></v-spacer>

                  <v-flex>
                    <v-text-field outline v-model="passConfirm" name="confirm" :rules="[rules.required, rules.min,
                  rules.passwordMatch]" label="Confirm Password" id="confirm" type="password">
                    </v-text-field>
                  </v-flex>
                </v-layout>
              </v-form>

            </v-card-text>
            <v-card-actions>
              <router-link :to="{name: 'login'}">
                <v-subheader id="loginText">Have an account? Sign In</v-subheader>
              </router-link>
              <v-spacer></v-spacer>
              <v-btn color="primary" :disabled="!valid" v-on:click="submitSignUp">Sign Up</v-btn>
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
    name: "SignUp",
    data() {
      return {
        error: "",
        errorFlag: false,
        valid: true,
        givenName: "",
        lastName: "",
        password: "",
        passConfirm: "",
        email: "",
        username: "",
        rules: {
          required: value => !!value || 'Required.',
          emailRule: value => (/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)
            .test(value) || 'Invalid Email Address',
          max: value => value.length <= 64 || 'Max 64 characters',
          min: value => value.length >= 6 || 'Min 6 characters',
          passwordMatch: () => this.password === this.passConfirm || ('The password you entered doesn\'t match')
        }
      }
    },
    components: {
      Menu
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
      submitSignUp: function () {
        this.$http.post("http://localhost:4941/api/v1/users",
          JSON.stringify({
            "username": this.username,
            "email": this.email,
            "givenName": this.givenName,
            "familyName": this.lastName,
            "password": this.passConfirm
          }), {
            headers: {
              "Content-type": "application/json",
            }
          }).then(function (response) {
          this.autoLogin();
        }, (function (error) {
          this.error = error.statusText.split(":")[1];
          this.errorFlag = true;
        }));
      },
      autoLogin: function () {
        this.$http.post("http://localhost:4941/api/v1/users/login",
          JSON.stringify({
            "username": this.username,
            "password": this.passConfirm
          }), {
            headers: {
              "Content-type": "application/json"
            }
          }).then(function (response) {
          const data = response.data;
          this.$cookie.set("authToken", data.token);
          this.setUser(response.data.userId, data.token);
        });
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
          this.$cookie.set("currentUser", JSON.stringify(userData));
          this.$router.push("/venues");
        });
      }
    }
  }
</script>

<style scoped>

  #container {
    margin-top: 5%;
  }

  #loginText {
    color: #1a73e8;
  }

</style>
