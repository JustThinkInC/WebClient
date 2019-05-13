<template>
  <div>
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
    <v-container fluid grid-list-xl id="venues">
      <v-layout align-center fill-height justify-space-around row>
        <v-flex xs6 v-for="(venue, index) in pagedVenues" :key="index">

          <v-card hover>
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
      </v-layout>
    </v-container>

    <!--Detailed venue information-->
    <v-layout fluid align-center fill-height justify-space-around row>
      <v-dialog v-model="showVenue" id="venueModal" aria-labelledby="venueModal" aria-hidden="true" width="50%">
        <v-card flat v-if="selectedVenue">
          <!--TODO Add all Venues images, emphasises primary...maybe use carousel-->
          <v-img :src="getVenuePrimaryPhoto(selectedVenue.venueId, selectedVenue.primaryPhoto)" contain height="150px"></v-img>

          <!--Venue Name with link-->
          <v-card-title primary-title>
            <div class="column">
              <div class="headline">
                {{ selectedVenue.venueName }}
              </div>

              <div class="subheading">
                {{ selectedVenue.category.categoryName }}
              </div>

              <!--TODO: Add an information menu here, maybe use an accordion menu component-->
              <v-list-tile-content>
                <p>
                  <br>
                  <i>Registered: </i> {{ selectedVenue.dateAdded.split("T")[0].replace(/-/g, "/")}}
                  <br>
                  <i>City: </i> {{ selectedVenue.city }}
                  <br>
                  <i>Address: </i> {{ selectedVenue.address}}
                  <br>
                  <i>Administrator: </i> {{ selectedVenue.admin.username}}
                </p>
              </v-list-tile-content>

            </div>
          </v-card-title>

          <!--Show venue star and cost ratings-->
          <v-card-title>

            <div class="column">
                <span class="grey--text">Avg. Rating:
                  <v-rating dense small v-model=selectedVenue.meanStarRating color="yellow darken-3"
                            background-color="grey darken-1"
                            empty-icon="$vuetify.icons.ratingFull" half-increments readonly length="5">
                  </v-rating>
                </span>
            </div>
            <!--<v-spacer></v-spacer>-->
            <div class="column">
                <span class="grey--text">Cost Rating:
                  <v-rating dense small v-model=selectedVenue.modeCostRating color="red darken-3"
                            background-color="grey darken-1" full-icon="$"
                            empty-icon="$" half-increments readonly length="5">
                  </v-rating>
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
                          <v-rating dense small :value="review.costRating" color="red darken-3" readonly half-increments
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
            </v-expansion-panel>
          </v-layout>

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

  </div>
</template>

<script>
  import Menu from "./Menu";

  export default {
    data() {
      return {
        error: "",
        errorFlag: false,
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
          {query: "maxCostRating=0", text: "Free"},
          {query: "maxCostRating=1", text: "$"},
          {query: "maxCostRating=2", text: "$$"},
          {query: "maxCostRating=3", text: "$$$"},
          {query: "maxCostRating=4", text: "$$$$"},
        ],
        showVenueItems: [
          {info: false},
          {reviews: false}
        ],
        pagedVenues: [],
        perPage: 1,
        totalRows: 1,
        currentPage: 1,
        pageIndex: ""
      }
    },
    mounted: function () {
      this.getVenues();
      this.getCategories();
      this.getCities();
      this.browserLocation();
    },
    computed: {},
    methods: {
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
          return 'src/assets/logo.png'
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
            this.selectedVenue.meanStarRating = venue.meanStarRating;
            this.selectedVenue.modeCostRating = venue.modeCostRating;
            this.selectedVenue.primaryPhoto = venue.primaryPhoto;
            this.getVenueReviews(venueId);
          });
      },
      getVenueReviews: function (venueId) {
        this.$http.get("http://localhost:4941/api/v1/venues/" + venueId + "/reviews")
          .then(function (response) {
            this.selectedVenueReviews = response.data;
          });
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
