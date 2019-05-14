<template>
  <v-app>
    <Menu/>


    <v-container fluid grid-list-lg id="venues">
      <v-layout align-center fill-height justify-space-around row wrap>
        <v-flex md4 v-for="(venue, index) in pagedVenues" :key="index">
          <v-card hover>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-icon v-on:click="edit = !edit; venue.id=venue.venueId">edit</v-icon>
            </v-card-actions>
            <v-img :src="getVenuePrimaryPhoto(venue.venueId, venue.primaryPhoto)" contain height="150px"></v-img>
            <!--Venue Name with link-->
            <v-card-title primary-title>
              <div class="column">
                <div class="headline" v-on:click="showVenue=!showVenue; getVenue(venue.venueId)">
                  <!--<router-link :to="{name: 'venue', params: {venueId: venue.venueId}}">-->
                  {{ venue.venueName }}
                  <!--</router-link>-->
                </div>

                <div class="subheading">
                  {{ getVenueCategoryName(venue.categoryId) }}
                </div>
              </div>
            </v-card-title>

            <!--Show venue star and cost ratings-->
            <v-card-title>
              <div class="column">
                <span class="grey--text">Avg. Rating:
                  <v-rating dense small v-model=venue.meanStarRating color="yellow darken-3" half-increments readonly
                            background-color="grey darken-1" empty-icon="$vuetify.icons.ratingFull" length="5">
                  </v-rating>
                </span>
              </div>

              <v-spacer></v-spacer>

              <div class="column">
                <span class="grey--text">Cost Rating:
                  <v-rating dense small v-model=venue.modeCostRating color="red darken-3" full-icon="$" empty-icon="$"
                            background-color="grey darken-1" half-increments readonly length="5">
                  </v-rating>
                </span>
              </div>
            </v-card-title>

            <v-card-text>
              {{ venue.shortDescription }}
            </v-card-text>

          </v-card>
        </v-flex>


        <!--<v-flex fill-height>-->
        <v-btn fab color="success" v-on:click="create = !create">
          <v-icon>add</v-icon>
        </v-btn>
        <!--</v-flex>-->

      </v-layout>

    </v-container>


    <v-layout fluid align-center justify-center id="container">
      <v-dialog v-model="create" width="50%">
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
                <v-text-field v-model="venue.name" name="name" :rules="[rules.required]" label="Name"
                              type="text">
                </v-text-field>
              </v-flex>

              <v-flex>
                <!--<v-text-field outline v-model="category" name="category" :rules="[rules.required]" label="Category"-->
                <!--id="category" type="text"></v-text-field>-->
                <v-autocomplete
                  v-model="venue.category"
                  :items=categories
                  label="Category"
                  attach=""

                  :rules="[rules.required]">
                </v-autocomplete>
              </v-flex>

              <!--City-->
              <v-flex>
                <v-text-field v-model="venue.city" name="city" :rules="[rules.required]" label="City" type="text">
                </v-text-field>
              </v-flex>

              <v-flex>
                <v-text-field v-model="venue.address" name="address" :rules="[rules.required]" label="Address"
                              type="text">
                </v-text-field>
              </v-flex>
              <!--Short & Long description-->
              <v-flex>
                <v-text-field v-model="venue.shortDescription" name="shortDescription"
                              :rules="[rules.required]"
                              label="Short Description" id="shortDescription" type="text"></v-text-field>
              </v-flex>

              <v-flex>
                <v-text-field v-model="venue.longDescription" name="longDescription" :rules="[rules.required]"
                              label="Long Description" id="longDescription" type="text">
                </v-text-field>
              </v-flex>

              <!--Latitude & Longitude-->
              <v-flex>
                <v-text-field v-model="venue.latitude" name="latitude" :rules="[rules.required]"
                              label="Latitude" id="latitude" type="number">
                </v-text-field>
              </v-flex>

              <v-flex>
                <v-text-field v-model="venue.longitude" name="longitude" :rules="[rules.required]"
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
      </v-dialog>
    </v-layout>


    <v-layout fluid align-center fill-height justify-space-around row>
      <v-dialog v-model="edit" width="50%">
        <v-card>
          <v-card-text>
            <div class="text-xs-center">
              <h3 class="font-weight-regular">Swoosh<br> <h4>Edit your venue</h4></h3>
              <br><br>
            </div>
            <div v-if="this.errorFlag" class="red--text">
              <v-icon color="red">error</v-icon>
              {{this.error}}
            </div>
            <v-form v-model="valid">
              <!--Name & Category-->
              <v-flex>
                <v-text-field v-model="venue.name" name="name" label="Name"
                              type="text">
                </v-text-field>
              </v-flex>

              <v-spacer></v-spacer>

              <v-flex>
                <v-autocomplete v-model="venue.category" :items=categories label="Category" attach=""></v-autocomplete>
              </v-flex>

              <!--Short & Long description-->
              <v-flex>
                <v-text-field v-model="venue.shortDescription" name="shortDescription" label="Short Description"
                              id="shortDescription" type="text"></v-text-field>
              </v-flex>

              <v-spacer></v-spacer>

              <v-flex>
                <v-textarea v-model="venue.longDescription" name="longDescription" rows="1" label="Long Description"
                            id="longDescription" type="text">
                </v-textarea>
              </v-flex>

              <!--Latitude & Longitude-->
              <v-flex>
                <v-text-field v-model="venue.latitude" name="latitude" label="Latitude" id="latitude" type="number">
                </v-text-field>
              </v-flex>

              <v-spacer></v-spacer>

              <v-flex>
                <v-text-field v-model="venue.longitude" name="longitude" label="Longitude" id="longitude" type="number">
                </v-text-field>
              </v-flex>
            </v-form>

          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" :disabled="!valid" v-on:click="createVenue">Create</v-btn>
          </v-card-actions>

        </v-card>
      </v-dialog>
    </v-layout>

    <!--Pagination-->
    <v-layout justify-center row class="text-xs-center">
      <div class="text-xs-center">
        <v-flex>
          {{ this.pageIndex }}
        </v-flex>
        <v-pagination id="pagination" v-model="currentPage" color="blue" :length="totalRows" circle
                      @input="onPageChanged">
        </v-pagination>
      </div>
    </v-layout>

  </v-app>

</template>

<script>
  import Menu from './Menu.vue';

  export default {
    name: "Admin",
    data() {
      return {
        currentUser: null,
        error: "",
        errorFlag: false,
        categories: [],
        valid: true,
        create: false,
        edit: false,
        venue: [
          {id: null},
          {name: ""},
          {category: ""},
          {city: ""},
          {shortDescription: ""},
          {longDescription: ""},
          {address: ""},
          {latitude: null},
          {longitude: null}
        ],
        pagedVenues: [],
        perPage: 10,
        totalRows: 1,
        currentPage: 1,
        pageIndex: "",
        rules: {
          required: value => !!value || 'Required.'
        }
      }
    },
    mounted: function () {
      this.getUser();
      this.getVenues();
      this.getCategories();
    }
    ,
    methods: {
      getUser: function () {
        this.currentUser = JSON.parse(this.$cookie.get("currentUser"));
      },
      getVenues: function () {
        this.$http.get("http://localhost:4941/api/v1/venues?adminId=" + this.currentUser.userId)
          .then(function (response) {
            this.venues = response.data;
            this.paginate(this.perPage, 0);
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          })
      },
      getCategories: function () {
        this.$http.get("http://localhost:4941/api/v1/categories")
          .then(function (response) {
            for (let i = 0; i < response.data.length; i++) {
              this.categories.push(response.data[i].categoryName);
            }
          });
      },
      getVenueCategoryName: function (id) {
        if (typeof (this.categories[id - 1]) !== "undefined") {
          return this.categories[id - 1];
        }
      },
      getVenuePrimaryPhoto: function (id, filename) {
        if (filename === null) {
          return 'src/assets/logo.png'
        }
        return "http://localhost:4941/api/v1/venues/" + id + "/photos/" + filename
      },
      paginate: function (pageSize, pageNumber) {
        let venuesToPage = this.venues;
        this.pagedVenues = venuesToPage.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
        this.totalRows = Math.ceil(this.venues.length / this.perPage);

        let start = (this.currentPage - 1) * this.perPage + 1;
        let end = Math.min(start + this.perPage - 1, this.venues.length);
        this.pageIndex = "Venues: " + start + "-" + end + " of " + this.venues.length;
      },
      onPageChanged: function (page) {
        this.paginate(this.perPage, page - 1)
      },
      createVenue: function () {
        this.$http.post("http://localhost:4941/api/v1/venues",
          JSON.stringify({
            "venueName": this.venue.name,
            "categoryId": this.categories.indexOf(this.venue.category),
            "city": this.venue.city,
            "address": this.venue.address,
            "shortDescription": this.venue.shortDescription,
            "longDescription": this.venue.longDescription,
            "latitude": parseFloat(this.venue.latitude),
            "longitude": parseFloat(this.venue.longitude)
          }), {
            headers: {
              "Content-type": "application/json",
              "X-Authorization": this.$cookie.get("authToken")
            }
          }).then(function (response) {
          this.create = !this.create;
          this.getVenues();
        }, function (error) {
          this.error = error;
          this.errorFlag = true;
        });
      },
      editVenue: function () {
        this.$http.patch("http://localhost:4941/api/v1/venues" + this.venue.venueId,
          JSON.stringify({
            "venueName": this.venue.name,
            "categoryId": this.categories.indexOf(this.venue.category),
            "city": this.venue.city,
            "address": this.venue.address,
            "shortDescription": this.venue.shortDescription,
            "longDescription": this.venue.longDescription,
            "latitude": this.venue.latitude,
            "longitude": this.venue.longitude
          }), {
            headers: {
              "Content-type": "application/json",
              "X-Authorization": this.$cookie.get("authToken")
            }
          }).then(function (response) {
          this.edit = !this.edit;
        }, function (error) {
          this.error = error;
          this.errorFlag = true;
        });
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

  #venues {
    margin-top: 10%;
    margin-bottom: 1%;
    width: 60%;
  }

</style>
