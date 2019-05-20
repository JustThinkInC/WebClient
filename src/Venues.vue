<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-app>
    <Menu/>

    <!--Filters for venues-->
    <v-form>
      <v-container id="venueFilter">
        <v-layout wrap>

          <!--Name search by phrase/letters-->
          <v-flex md md4>
            <v-text-field
              v-model="search.name"
              label="Name"
              v-on:input="searchVenues">
            </v-text-field>
          </v-flex>

          <!--Category search/selection-->
          <v-flex md md4>
            <v-autocomplete
              v-model="search.categoryName"
              :items=categories
              label="Category"
              attach=""
              v-on:input="searchVenues">
            </v-autocomplete>
          </v-flex>

          <v-flex md md4>
            <v-autocomplete
              v-model="search.city"
              :items=cities
              label="City"
              attach=""
              v-on:input="searchVenues">
            </v-autocomplete>
          </v-flex>

          <v-flex md md4>
            <v-select
              v-model="search.sortBy"
              :items=sortOptions
              item-text="text"
              item-value="query"
              label="Sort"
              attach=""
              v-on:input="searchVenues">
            </v-select>
          </v-flex>

          <v-flex md md4>
            <v-label>Min Rating</v-label>
            <v-rating small hover v-model=search.minStarRating color="yellow darken-3" clearable
                      background-color="grey darken-1" empty-icon="$vuetify.icons.ratingFull" length="5"
                      v-on:input="searchVenues">
            </v-rating>
          </v-flex>

          <v-flex md md4>
            <v-select
              v-model="search.maxCostRating"
              :items=maxCostOptions
              item-text="text"
              item-value="query"
              label="Max Cost"
              attach=""
              v-on:input="searchVenues">
            </v-select>
          </v-flex>

        </v-layout>
      </v-container>
    </v-form>

    <!--List all venues as cards in a container-->
    <v-container fluid grid-list-lg id="venues">
      <v-layout align-center fill-height justify-space-around row wrap>
        <v-flex md4 v-for="(venue, index) in pagedVenues" :key="index">

          <v-card>
            <v-img :src="getVenuePrimaryPhoto(venue.venueId, venue.primaryPhoto)" contain height="150px"></v-img>
            <!--Venue Name with link-->
            <v-card-title primary-title>
              <div class="column">
                <a class="headline" v-on:click="showVenue=!showVenue; getVenue(venue.venueId)">
                  {{ venue.venueName }}
                </a>

                <div class="subheading">
                  {{ getVenueCategoryName(venue.categoryId) }}
                  <div>
                    {{ getVenueDistance(venue)}}
                  </div>
                </div>
              </div>
            </v-card-title>

            <!--Show venue star and cost ratings-->
            <v-card-title>
              <div class="column">
                <span class="grey--text">Avg. Rating:
                  <v-rating v-if="venue.meanStarRating" dense small v-model=venue.meanStarRating color="yellow darken-3"
                            half-increments readonly
                            background-color="grey darken-1" empty-icon="$vuetify.icons.ratingFull" length="5">
                  </v-rating>
                  <p v-else>No Rating</p>
                </span>
              </div>

              <v-spacer></v-spacer>

              <div class="column">
                <span class="grey--text">Cost Rating:
                  <v-rating v-if="venue.modeCostRating" dense small v-model=venue.modeCostRating color="red darken-3"
                            full-icon="$" empty-icon="$"
                            background-color="grey darken-1" half-increments readonly length="5">
                  </v-rating>
                  <p v-else>No Rating</p>
                </span>
              </div>
            </v-card-title>

            <v-card-text>
              {{ venue.shortDescription }}
            </v-card-text>
          </v-card>

        </v-flex>
      </v-layout>
    </v-container>

    <!--Detailed venue information-->
    <v-layout fluid align-center fill-height justify-space-around row>
      <v-dialog v-model="showVenue" id="venueModal" aria-labelledby="venueModal" aria-hidden="true" width="50%">
        <v-card flat v-if="selectedVenue">
          <v-img :src="getVenuePrimaryPhoto(selectedVenue.venueId, selectedVenue.primaryPhoto)" contain height="150px">
          </v-img>

          <!--Venue info-->
          <v-card-title primary-title>
            <div class="column">
              <div class="headline">
                {{ selectedVenue.venueName }}
              </div>

              <div class="subheading">
                {{ selectedVenue.category.categoryName }}
              </div>

              <v-list-tile-content>
                <p>
                  <br>
                  <i>Registered: </i> {{ selectedVenue.dateAdded.split("T")[0].replace(/-/g, "/")}}
                  <br>
                  <i>City: </i> {{ selectedVenue.city }}
                  <br>
                  <i>Address: </i> {{ selectedVenue.address}}
                  <br>
                  <i>Administrator: </i> <a v-on:click="showAdmin = !showAdmin">{{ selectedVenue.admin.username}}</a>
                </p>
              </v-list-tile-content>

            </div>
          </v-card-title>

          <!--Show venue star and cost ratings-->
          <v-card-title>

            <div class="column">
                <span class="grey--text">Avg. Rating:
                  <v-rating v-if="selectedVenue.meanStarRating" dense small v-model=selectedVenue.meanStarRating
                            color="yellow darken-3"
                            background-color="grey darken-1"
                            empty-icon="$vuetify.icons.ratingFull" half-increments readonly length="5">
                  </v-rating>
                  <p v-else>No Rating</p>
                </span>
            </div>
            <!--<v-spacer></v-spacer>-->
            <div class="column">
                <span class="grey--text">Cost Rating:
                  <v-rating v-if="selectedVenue.costRating" dense small v-model=selectedVenue.modeCostRating
                            color="red darken-3"
                            background-color="grey darken-1" full-icon="$"
                            empty-icon="$" half-increments readonly length="5">
                  </v-rating>
                  <p v-else>No Rating</p>
                </span>
            </div>
          </v-card-title>

          <v-layout>
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
                    {{ selectedVenue.shortDescription }}
                    <!--</span>-->
                  </div>
                </template>

                <v-card>
                  <v-card-text class="grey lighten-3">
                    <p>
                      {{selectedVenue.shortDescription}}
                      {{ selectedVenue.longDescription}}
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

                <!--Add a review-->
                <v-card>
                  <v-card-text>
                    <v-flex md4>
                      <a v-if="canReview()" v-on:click="addReview = !addReview">Add your review</a>
                      <v-dialog width="20%" v-model="addReview">

                        <v-card>
                          <v-card-title class="headline">
                            Review {{ selectedVenue.venueName }}
                          </v-card-title>

                          <v-form ref="form">
                            <v-card-text>
                              <p class="font-weight-light">All fields are required</p>
                              <!--Ratings-->
                              <div class="text-xs-center mt5">
                                <v-rating dense v-model="userReview.starRating" hover color="yellow darken-3">
                                </v-rating>
                                <v-select dense :items=maxCostOptions item-text="text" item-value="raw"
                                          label="Cost Rating"
                                          attach="" v-model="userReview.costRating" :rules="[rules.required]">
                                </v-select>
                              </div>

                              <!--Review body-->
                              <v-textarea dense v-model="userReview.body" outline single-line :rules="[rules.required]">
                              </v-textarea>
                            </v-card-text>
                            <v-divider></v-divider>


                            <!--Post & Cancel buttons-->
                            <v-card-actions class="justify-space-between">
                              <v-btn flat v-on:click="addReview = !addReview">Cancel</v-btn>
                              <v-btn color="primary" flat
                                     v-on:click="postReview(selectedVenue.venueId)">
                                Rate Now
                              </v-btn>
                            </v-card-actions>
                          </v-form>

                        </v-card>
                      </v-dialog>
                    </v-flex>
                  </v-card-text>
                </v-card>

                <!--Show 'No Reviews Yet' if there are none-->
                <v-card>
                  <v-card-text v-if="selectedVenueReviews !== null && selectedVenueReviews[0] === undefined">
                    No Reviews yet
                  </v-card-text>
                </v-card>
                <!--Show reviews-->
                <v-card v-for="review in selectedVenueReviews">
                  <v-card-text class="grey lighten-5">
                    <div class="font-weight-bold">
                      {{ review.reviewAuthor.username}}
                    </div>

                    <!--Ratings & Time of review-->
                    <v-layout align-start justify-start>
                      <v-flex md md4>
                        <div class="column">
                          <v-rating dense small :value="review.starRating" color="yellow darken-3" readonly
                                    half-increments>
                          </v-rating>
                          <p class="grey--text">
                            {{ review.timePosted.split("T")[0].replace(/-/g, "/")}}
                          </p>
                        </div>
                      </v-flex>
                      <v-flex md md4>
                        <div class="column">
                          <v-rating dense small :value="review.costRating" color="red darken-3" readonly
                                    half-increments
                                    empty-icon="$" full-icon="$">
                          </v-rating>
                        </div>
                      </v-flex>
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
                <v-container grid-list-md fluid>
                  <v-layout row wrap>
                    <span v-if="!selectedVenue.photos[0]">No Photos</span>
                    <v-flex md12 v-else v-for="photo in selectedVenue.photos">
                      <v-card flat tile>
                        <v-img
                          :src="'http://localhost:4941/api/v1/venues/'+ selectedVenue.venueId + '/photos/' + photo.photoFilename">
                          <v-layout column fill-height>
                            <v-card-title>
                              <v-spacer></v-spacer>
                              <v-menu>
                                <template v-slot:activator="{ on }">
                                  <v-btn small color="grey" icon v-on="on">
                                    <v-icon dark small>more_vert</v-icon>
                                  </v-btn>
                                </template>
                              </v-menu>
                            </v-card-title>
                          </v-layout>
                        </v-img>
                      </v-card>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-expansion-panel-content>

            </v-expansion-panel>
          </v-layout>

        </v-card>

      </v-dialog>
    </v-layout>

    <!--Show admin's profile-->
    <v-layout align-center fill-height id="adminCard">
      <v-dialog v-model="showAdmin" width="50%">
        <v-card v-if="selectedVenue.admin && selectedVenue.admin.info">
          <v-img :src="selectedVenue.admin.photo" contain height="150px"></v-img>

          <v-list>
            <br>
            <v-list-tile>
              <v-list-tile-action></v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-sub-title>Username</v-list-tile-sub-title>
                <v-list-tile-title>{{selectedVenue.admin.info.username}}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider inset></v-divider>

            <v-list-tile>
              <v-list-tile-action></v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-sub-title>Given name</v-list-tile-sub-title>
                <v-list-tile-title>{{selectedVenue.admin.info.givenName}}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider inset></v-divider>

            <v-list-tile>
              <v-list-tile-action></v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-sub-title>Last name</v-list-tile-sub-title>
                <v-list-tile-title>{{selectedVenue.admin.info.familyName}}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider inset></v-divider>
          </v-list>
        </v-card>
      </v-dialog>
    </v-layout>

    <v-snackbar right top v-model="successSnackbar" color="success">
      Review posted!
    </v-snackbar>

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
  import Menu from "./Menu";

  export default {
    data() {
      return {
        currentUser: null,
        error: "",
        errorFlag: false,
        addReview: false,
        showAdmin: false,
        successSnackbar: false,
        venues: [],
        selectedVenue: "",
        selectedVenueReviews: null,
        showVenue: false,
        categories: ["All"],
        cities: ["All"],
        search: [
          {name: ""},
          {city: ""},
          {categoryName: ""},
          {sortBy: ""},
          {minStarRating: ""},
          {maxCostRating: ""}
        ],
        sortOptions: [
          {query: "DISTANCE&reverseSort=false", text: "Nearest"},
          {query: "DISTANCE&reverseSort=true", text: "Furthest"},
          {query: "STAR_RATING&reverseSort=true", text: "Rating (low to high)"},
          {query: "STAR_RATING&reverseSort=false", text: "Rating (high to low)"},
          {query: "COST_RATING&reverseSort=false", text: "Cost (low to high)"},
          {query: "COST_RATING&reverseSort=true", text: "Cost (high to low)"}
        ],
        maxCostOptions: [
          {query: "maxCostRating=0", text: "Free", raw: 0},
          {query: "maxCostRating=1", text: "$", raw: 1},
          {query: "maxCostRating=2", text: "$$", raw: 2},
          {query: "maxCostRating=3", text: "$$$", raw: 3},
          {query: "maxCostRating=4", text: "$$$$", raw: 4},
        ],
        showVenueItems: [
          {info: false},
          {reviews: false}
        ],
        userReview: [
          {body: null},
          {starRating: null},
          {costRating: null},
        ],
        rules: {required: value => (value !== undefined && value !== null) || 'Required.'},
        pagedVenues: [],
        perPage: 10,
        totalRows: 1,
        currentPage: 1,
        pageIndex: ""
      }
    },
    mounted: function () {
      this.getCurrentUser();
      this.getVenues();
      this.getCategories();
      this.getCities();
      this.browserLocation();
    },
    methods: {
      canReview: function () {
        if (this.currentUser === null || this.currentUser.userId === this.selectedVenue.admin.userId) return false;
        if (this.selectedVenueReviews !== null) {
          const reviewed = this.selectedVenueReviews.find(review => review.reviewAuthor.userId === this.currentUser.userId);
          if (reviewed) return false;
        }

        return true;
      },
      getCurrentUser: function () {
        this.currentUser = JSON.parse(this.$cookie.get("currentUser"));
      },
      getVenues: function () {
        this.$http.get("http://localhost:4941/api/v1/venues")
          .then(function (response) {
            this.venues = response.data;
            this.paginate(this.perPage, 0);
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          })
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
      browserLocation: function () {
        let self = this;
        navigator.geolocation.getCurrentPosition(position => {
          self.lat = position.coords.latitude;
          self.long = position.coords.longitude;
        });
      },
      constructSearch: function () {
        let url = "http://localhost:4941/api/v1/venues?";
        const all = "All";
        if (this.search.city !== undefined && this.search.city !== all) url += "city=" + this.search.city + "&";
        if (this.search.name !== undefined && this.search.name !== "") url += "q=" + this.search.name + "&";
        if (this.search.categoryName !== undefined && this.search.categoryName !== all) {
          url += "categoryId=" + this.categories.indexOf(this.search.categoryName) + "&";
        }
        if (this.search.sortBy !== undefined && this.search.sortBy !== "") {
          if (this.search.sortBy.includes("DISTANCE") && this.lat !== undefined && this.long !== undefined) {
            return url + "sortBy=" + this.search.sortBy + "&myLatitude=" + this.lat +
              "&myLongitude=" + this.long;
          } else if (!this.search.sortBy.includes("DISTANCE")) {
            url += "sortBy=" + this.search.sortBy + "&";
          }
        }
        if (typeof (this.search.minStarRating) === "number" && this.search.minStarRating >= 1) {
          url += "minStarRating=" + this.search.minStarRating + "&";
        }
        if (this.search.maxCostRating !== "undefined") {
          url += this.search.maxCostRating + "&";
        }


        return url;
      },
      searchVenues: function () {
        const searchUrl = this.constructSearch();
        this.$http.get(searchUrl)
          .then(function (response) {
            this.venues = response.data;
            this.paginate(this.perPage, 0);
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },
      getCategories: function () {
        this.$http.get("http://localhost:4941/api/v1/categories")
          .then(function (response) {
            for (let i = 0; i < response.data.length; i++) {
              this.categories.push(response.data[i].categoryName);
            }
          });
      },
      getCities: function () {
        this.$http.get("http://localhost:4941/api/v1/venues")
          .then(function (response) {
            let allVenues = response.data;
            for (let i = 0; i < allVenues.length; i++) {
              this.cities.push(allVenues[i].city);
            }
            this.cities.push("Auck")
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          })
      },
      getVenueCategoryName: function (id) {
        if (typeof (this.categories[id]) !== "undefined") {
          return this.categories[id];
        }
      },
      getVenuePrimaryPhoto: function (id, filename) {
        if (filename === null) {
          return 'src/assets/defaultVenue.jpg'
        }
        return "http://localhost:4941/api/v1/venues/" + id + "/photos/" + filename
      },
      getVenue: function (venueId) {
        this.$http.get("http://localhost:4941/api/v1/venues/" + venueId)
          .then(function (response) {
            this.selectedVenue = response.data;
            // Workaround for API not returning these nicely for specific venue
            const venue = this.venues.find(venue => venue.venueId === venueId);
            this.selectedVenue.venueId = venueId;
            this.getVenueReviews(venueId);
            this.getVenueAdmin(this.selectedVenue.admin.userId);
            this.selectedVenue.meanStarRating = venue.meanStarRating;
            this.selectedVenue.modeCostRating = venue.modeCostRating;
            this.selectedVenue.primaryPhoto = venue.primaryPhoto;

          });
      },
      getVenueReviews: function (venueId) {
        this.$http.get("http://localhost:4941/api/v1/venues/" + venueId + "/reviews")
          .then(function (response) {
            this.selectedVenueReviews = response.data;
          });
      },
      getVenueDistance: function (venue) {
        let dist = venue.distance;
        if (!dist) return;
        if (dist < 1) {
          return "Distance  " + (dist * 100) + " m";
        } else {
          return "Distance  " + dist.toFixed(1) + " km";
        }
      },
      getVenueAdmin: function (adminId) {
        this.$http.get("http://localhost:4941/api/v1/users/" + adminId)
          .then(function (response) {
            this.selectedVenue.admin['info'] = response.data;
          });

        this.$http.get("http://localhost:4941/api/v1/users/" + adminId + "/photo")
          .then(function (response) {
            this.selectedVenue.admin['photo'] = response.data;
          }, function (error) {
            this.selectedVenue.admin['photo'] = "src/assets/defaultProfile.png";
          })
      },
      postReview: function (venueId) {
        if (this.$refs.form.validate() && this.userReview.starRating) {
          this.$http.post("http://localhost:4941/api/v1/venues/" + venueId + "/reviews",
            JSON.stringify({
              "reviewBody": this.userReview.body,
              "starRating": this.userReview.starRating,
              "costRating": this.userReview.costRating
            }),
            {
              headers: {
                "Content-type": "application/json",
                "X-Authorization": this.$cookie.get("authToken")
              }
            }).then(function (response) {
            this.addReview = !this.addReview;
            this.successSnackbar = true;
          })
        }
      }
    },
    components: {
      Menu,
    }

  }
</script>

<style scoped>
  #venueFilter {
    margin-top: 7%;
    margin-left: 30%;
    width: 40%;
  }

  #venues {
    margin-top: 2%;
    margin-bottom: 1%;
    width: 60%;
  }

</style>
