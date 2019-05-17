<template>
  <v-app>
    <Menu/>

    <!--View-->
    <v-container fluid grid-list-lg id="venues">

      <!--Add venue button-->
      <v-layout align-end justify-end>
        <v-tooltip bottom nudge-right>
          <template v-slot:activator="{ on }">
            <v-btn fab color="success" v-on:click="create = !create" v-on="on">
              <v-icon>add</v-icon>
            </v-btn>
          </template>
          <span>Add a venue</span>
        </v-tooltip>
      </v-layout>

      <v-layout align-center fill-height justify-space-around row wrap>
        <v-flex md4 v-for="(venue, index) in pagedVenues" :key="index">
          <v-card>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon v-on:click="edit = !edit; venue.id=venue.venueId">edit</v-icon>
              </v-btn>
            </v-card-actions>
            <v-img :src="getVenuePrimaryPhoto(venue.venueId, venue.primaryPhoto)" contain height="150px"></v-img>
            <!--Venue Name with link-->
            <v-card-title primary-title>
              <div class="column">
                <div class="headline">
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

            <!--Detail panels-->
            <v-expansion-panel>
              <!--Description panel-->
              <v-expansion-panel-content>
                <template v-slot:header>
                  <div>
                    <!--<span>-->
                    <i>Description:</i>
                    <!--</span>-->
                    <v-spacer></v-spacer>
                    <!--<span class="font-italic"> -->
                    {{ venue.shortDescription }}
                    <!--</span>-->
                  </div>
                </template>

                <v-card>
                  <v-card-text class="grey lighten-3">
                    <p>
                      {{venue.shortDescription}}
                      {{ venue.longDescription}}
                    </p>
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>

              <!--Reviews panel-->
              <v-expansion-panel-content>
                <template v-slot:header>
                  <div>
                    <i>Reviews</i>
                  </div>
                </template>
                <!--Show 'No Reviews Yet' if there are none-->
                <v-card>
                  <v-card-text v-if="venue.reviews === undefined || venue.reviews === null">
                    No Reviews yet
                  </v-card-text>
                </v-card>
                <!--Show reviews-->
                <v-card v-for="review in venue.reviews">
                  <v-card-text class="grey lighten-5">
                    <div class="font-weight-bold">
                      {{ review.reviewAuthor.username}}
                      <p class="grey--text">
                        {{ review.timePosted.split("T")[0].replace(/-/g, "/")}}
                      </p>
                    </div>

                    <!--Ratings & Time of review-->
                    <v-layout align-start justify-start>
                      <v-rating dense small :value="venue.meanStarRating" color="yellow darken-3" readonly
                                half-increments>
                      </v-rating>
                      <v-rating dense small :value="venue.modeCostRating" color="red darken-3" readonly
                                half-increments
                                empty-icon="$" full-icon="$">
                      </v-rating>
                    </v-layout>
                    <br>
                    <p>{{ review.reviewBody }}</p>
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>

              <!--Photos panel-->
              <v-expansion-panel-content>
                <template v-slot:header>
                  <div>
                    <i>Photos</i>
                  </div>
                </template>
                <v-card>
                  <v-card-text>
                    <label for="photoUpload"><a class="font-weight-light">Add photo</a></label>
                    <input id="photoUpload" type="file" accept="image/png,image/jpeg" style="display: none" ref="file"
                           @change="addPhoto(venue.venueId)">
                  </v-card-text>

                </v-card>
                <v-card v-for="photo in venue.photos">
                  <v-card-text class="grey lighten-5">
                    <!--<div class="font-weight-bold">-->
                    <!--{{ review.reviewAuthor.username}}-->
                    <!--<p class="grey&#45;&#45;text">-->
                    <!--{{ review.timePosted.split("T")[0].replace(/-/g, "/")}}-->
                    <!--</p>-->
                    <!--</div>-->

                    <v-layout align-start justify-start>
                      <v-img
                        :src="'http://localhost:4941/api/v1/venues/'+venue.venueId+'/photos/'+photo.photoFilename"></v-img>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>


            </v-expansion-panel>

          </v-card>
        </v-flex>

      </v-layout>
    </v-container>

    <!--Create-->
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
                <v-autocomplete
                  v-model="venue.category"
                  :items=categories
                  label="Category"
                  attach=""

                  :rules="[rules.required]">
                </v-autocomplete>
              </v-flex>

              <!--City & Address-->
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
            <v-btn color="primary" :disabled="!valid" v-on:click="create = !create">Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" :disabled="!valid" v-on:click="createVenue">Create</v-btn>
          </v-card-actions>

        </v-card>
      </v-dialog>
    </v-layout>

    <!--Edit-->
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
              <v-flex>
                <v-autocomplete v-model="venue.category" :items=categories label="Category" attach=""></v-autocomplete>
              </v-flex>

              <!--Short & Long description-->
              <v-flex>
                <v-text-field v-model="venue.shortDescription" name="shortDescription" label="Short Description"
                              id="shortDescription" type="text"></v-text-field>
              </v-flex>
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
              <v-flex>
                <v-text-field v-model="venue.longitude" name="longitude" label="Longitude" id="longitude" type="number">
                </v-text-field>
              </v-flex>
            </v-form>

          </v-card-text>

          <!--Cancel & Edit buttons-->
          <v-card-actions>
            <v-btn color="primary" :disabled="!valid" v-on:click="edit = !edit">Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" v-on:click="editVenue">Edit</v-btn>
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
    created: function () {
      this.checkLoggedIn();
    },
    mounted: function () {
      this.getUser();
      this.getVenues();
      this.getCategories();
    },
    methods: {
      checkLoggedIn: function () {
        if (!this.$cookie.get("currentUser")) {
          this.$router.push("/venues");
        }
      },
      getUser: function () {
        this.currentUser = JSON.parse(this.$cookie.get("currentUser"));
      },
      getVenues: function () {
        this.$http.get("http://localhost:4941/api/v1/venues?adminId=" + this.currentUser.userId)
          .then(function (response) {
            this.venues = response.data;
            this.getVenueReviews();
            this.getVenuePhotos();
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },
      getVenuePhotos: function () {
        for (let i = 0; i < this.venues.length; i++) {
          this.$http.get("http://localhost:4941/api/v1/venues/" + this.venues[i].venueId)
            .then(function (response) {
              this.venues[i]["photos"] = response.data.photos;
            })
            .then(function (resolve) {
              this.paginate(this.perPage, 0);
            });
        }
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
      getVenueReviews: function () {
        for (let i = 0; i < this.venues.length; i++) {
          this.$http.get("http://localhost:4941/api/v1/venues/" + this.venues[i].venueId + "/reviews")
            .then(function (response) {
              this.venues[i]["reviews"] = response.data;
            });
        }
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
      checkForm: function () {
        if (this.venue.name || this.venue.category || this.venue.city || this.venue.shortDescription
          || this.venue.longDescription || this.venue.address || this.venue.latitude || this.venue.longitude) {
          return true;
        } else {
          this.valid = false;
          return false;
        }
      },
      addPhoto: function (venueId) {
        this.photoFile = document.querySelector('input[type=file]').files[0];
        // console.log(this.photoFile);
        // return;
        if (!this.photoFile) return;
        if ((this.photoFile.size / (1024 * 1024)) > this.MAX_PHOTO_SIZE) {
          this.message = "Photo size must be less than 20MB";
          this.errorSnackbar = true;
          this.successSnackbar = false;
          return;
        }
        console.log(venueId);
        console.log(this.photoFile)
        let formData = new FormData();
        formData.append("photo", this.photoFile);
        formData.append("description", "");
        formData.append("makePrimary", false);
        this.$http.post("http://localhost:4941/api/v1/venues/" + venueId + "/photos",
          JSON.stringify({
            // "form-data": formData
            photo: this.photoFile,
            description: "a new image",
            makePrimary: false
          }),
          {
            headers: {
              // "Content-Type": "application/x-www-form-urlencoded",
              "X-Authorization": this.$cookie.get("authToken")
            }
          }
      ).then(function (response) {
        // console.log(response)
        this.message = "Photo added!";
        this.successSnackbar = true;
        this.errorSnackbar = false;
        this.setNewPhoto();
      }, function (error) {
        this.message = "Could not add photo";
        this.successSnackbar = false;
        this.errorSnackbar = true;
      })
    },
    editVenue: function () {
      if (this.checkForm()) {
        //   this.$http.patch("http://localhost:4941/api/v1/venues" + this.venue.venueId,
        //     JSON.stringify({
        //       "venueName": this.venue.name,
        //       "categoryId": this.categories.indexOf(this.venue.category),
        //       "city": this.venue.city,
        //       "address": this.venue.address,
        //       "shortDescription": this.venue.shortDescription,
        //       "longDescription": this.venue.longDescription,
        //       "latitude": this.venue.latitude,
        //       "longitude": this.venue.longitude
        //     }), {
        //       headers: {
        //         "Content-type": "application/json",
        //         "X-Authorization": this.$cookie.get("authToken")
        //       }
        //     }).then(function (response) {
        //     this.edit = !this.edit;
        //   }, function (error) {
        //     this.error = error;
        //     this.errorFlag = true;
        //   });
      } else {
        console.log("INVALID")
      }
    }
  }
  ,
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
    margin-top: 5%;
    margin-bottom: 1%;
    width: 60%;
  }

</style>
