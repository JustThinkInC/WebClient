<template>
  <v-app>
    <Menu/>

    <v-container fluid align-center justify-center id="container">
      <v-layout align-center justify-center fill-height>
        <v-flex md5 id="addVenue">
          <v-card>
            <v-card-text>
              <div class="text-xs-center">
                <h3 class="font-weight-regular">Swoosh <br> <h4>Add your venue!</h4></h3>
                <br><br>
              </div>
              <div v-if="this.errorFlag" class="red--text">
                <v-icon color="red">error</v-icon>
                {{this.error}}
              </div>
              <v-form v-model="valid">
                  <!--Name & Category-->
                  <v-flex>
                    <v-text-field outline v-model="name" name="name" :rules="[rules.required]" label="Name"
                                  type="text">
                    </v-text-field>
                  </v-flex>

                  <v-spacer></v-spacer>

                  <v-flex>
                    <v-text-field outline v-model="category" name="category" :rules="[rules.required]" label="Category"
                                  id="category" type="text"></v-text-field>
                  </v-flex>

                  <!--Short & Long description-->
                  <v-flex>
                    <v-text-field outline v-model="shortDescription" name="shortDescription" :rules="[rules.required]"
                                  label="Short Description" id="shortDescription" type="text"></v-text-field>
                  </v-flex>

                  <v-spacer></v-spacer>

                  <v-flex>
                    <v-text-field outline v-model="longDescription" name="longDescription" :rules="[rules.required]"
                                  label="Long Description" id="longDescription" type="text">
                    </v-text-field>
                  </v-flex>

                  <!--Latitude & Longitude-->
                  <v-flex>
                    <v-text-field outline v-model="latitude" name="latitude" :rules="[rules.required]"
                                  label="Latitude" id="latitude" type="number">
                    </v-text-field>
                  </v-flex>

                  <v-spacer></v-spacer>

                  <v-flex>
                    <v-text-field outline v-model="longitude" name="longitude" :rules="[rules.required]"
                                  label="Longitude" id="longitude" type="number">
                    </v-text-field>
                  </v-flex>
              </v-form>

            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" :disabled="!valid" v-on:click="createVenue">Create</v-btn>
            </v-card-actions>

          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

  </v-app>

</template>

<script>
  import Menu from './Menu.vue';

  export default {
    name: "Admin",
    data() {
      return {
        error: "",
        errorFlag: false,
        valid: true,
        name: "",
        category: "",
        shortDescription: "",
        longDescription: "",
        city: "",
        address: "",
        latitude: null,
        longitude: null,
        rules: {
          required: value => !!value || 'Required.'
        }
      }
    },
    components: {
      Menu
    }
  }
</script>

<style scoped>

  #container {
    margin-top: 5%;
  }

</style>
