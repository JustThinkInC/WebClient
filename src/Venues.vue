<template>
  <div>
    <Menu/>
    <v-form>
    <v-container id="citySelect">
      <v-layout wrap>

        <v-flex xs12 md6>
          <v-text-field
            v-model="nameSearch"
            label="Name"
            v-on:input="searchVenues">
          </v-text-field>
        </v-flex>

        <v-flex xs12 md6>
          <v-autocomplete
            v-model="citySearch"
            :items=cities
            label="City"
            attach="citySelect"
            v-on:input="searchVenues">
          </v-autocomplete>
        </v-flex>

      </v-layout>
    </v-container>
    </v-form>

    <div id="venues">
      <table>
        <tr>
          <td><span>Name</span></td>
          <td><span>Category</span></td>
          <td><span>Venue Photo</span></td>
          <td><span>Star Rating</span></td>
          <td><span>Cost Rating</span></td>
        </tr>

        <tr v-for="venue in venues">
          <td>
            <router-link :to="{name: 'venue', params: {venueId: venue.venueId}}">{{ venue.venueName }}</router-link>
          </td>
          <td>{{ getCategoryName(venue.categoryId) }}<br></td>
          <td>
            <img :src="getVenuePrimaryPhoto(venue.venueId,venue.primaryPhoto)" width="100px">
          </td>
          <td>
            <v-rating dense v-model=venue.meanStarRating color="yellow darken-3" background-color="grey darken-1"
                      empty-icon="$vuetify.icons.ratingFull" half-increments readonly length="5">

            </v-rating>
          </td>
          <td>
            <v-rating dense v-model=venue.meanStarRating color="yellow darken-3" background-color="grey darken-1"
                      empty-icon="$vuetify.icons.ratingFull" half-increments readonly length="5">
            </v-rating>
          </td>
        </tr>
      </table>
    </div>
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
        categories: [],
        cities: [],
        nameSearch: "",
        citySearch: ""
      }
    },
    mounted: function () {
      this.getVenues();
      this.getVenueCategory();
      this.getCities();
    },
    computed: {},
    methods: {
      getVenues: function () {
        this.$http.get("http://localhost:4941/api/v1/venues")
          .then(function (response) {
            this.venues = response.data;
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          })
      },
      searchVenues: function () {
        let baseUrl = "http://localhost:4941/api/v1/venues?";
        if (this.citySearch !== "") baseUrl += "city=" + this.citySearch + "&";
        if (this.nameSearch !== "") baseUrl += "q=" + this.nameSearch;
        this.$http.get(baseUrl)
          .then(function (response) {
            console.log("HELLLO")
            this.venues = response.data;
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          })
      },
      getVenueCategory: function () {
        this.$http.get("http://localhost:4941/api/v1/categories")
          .then(function (response) {
            this.categories = response.data;
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
      getCategoryName: function (id) {
        if (typeof (this.categories[id - 1]) !== "undefined") {
          return this.categories[id - 1].categoryName;
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
  table {
    display: block;
    margin: 10% 25%;
    width: 50%;
  }

  td {
    width: 25%;
  }

  #citySelect {
    margin-left: 25%;
    width: 50%;
  }

  #venues {
    margin-top: 5%;
  }
</style>
