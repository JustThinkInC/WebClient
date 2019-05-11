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
              attach="venueFilter"
              v-on:input="searchVenues">
            </v-autocomplete>
          </v-flex>

          <v-flex md md4>
            <v-autocomplete
              v-model="search.city"
              :items=cities
              label="City"
              attach="venueFilter"
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
              attach="venueFilter"
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
                <div class="headline">
                  <router-link :to="{name: 'venue', params: {venueId: venue.venueId}}">
                    {{ venue.venueName }}
                  </router-link>
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
                  <v-rating dense small v-model=venue.meanStarRating color="yellow darken-3"
                            background-color="grey darken-1"
                            empty-icon="$vuetify.icons.ratingFull" half-increments readonly length="5">
                  </v-rating>
                </span>
              </div>

              <v-spacer></v-spacer>

              <div class="column">
                <span class="grey--text">Cost Rating:
                  <v-rating dense small v-model=venue.modeCostRating color="yellow darken-3"
                            background-color="grey darken-1"
                            empty-icon="$vuetify.icons.ratingFull" half-increments readonly length="5">
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

    <!--Pagination-->
    <v-layout justify-center row>
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
        categories: ["All"],
        cities: ["All"],
        search: [
          {name: ""},
          {city: ""},
          {categoryName: ""},
          {sortBy: ""}
        ],
        sortOptions: [
          {query: "DISTANCE&reverseSort=false", text: "Nearest"},
          {query: "DISTANCE&reverseSort=true", text: "Furthest"},
          {query: "STAR_RATING&reverseSort=true", text: "Rating (low to high)"},
          {query: "STAR_RATING&reverseSort=false", text: "Rating (high to low)"},
          {query: "COST_RATING&reverseSort=false", text: "Cost (low to high)"},
          {query: "COST_RATING&reverseSort=true", text: "Cost (high to low)"}
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
        this.pageIndex = "Venues: " + start + "-" + end;
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
          if (this.search.sortBy.includes("DISTANCE") && this.lat && this.long) {
            return url + "sortBy=" + this.search.sortBy + "&myLatitude=" + this.lat +
              "&myLongitude=" + this.long;
          } else if (!this.search.sortBy.includes("DISTANCE")) {
            url += "sortBy=" + this.search.sortBy + "&";
          }
        }

        return url;
      },
      searchVenues: function () {
        const searchUrl = this.constructSearch();
        console.log("s " + searchUrl);
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
      }
    },
    components: {
      Menu
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
