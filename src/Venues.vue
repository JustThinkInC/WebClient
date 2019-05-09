<template>
  <div>
    <Menu/>


    <div id="search-wrapper">
      <input type="text" v-model="search" placeholder="City"/>
      <!--Search venues button-->
      <button type="button" class="btn btn-primary" v-on:click="getVenues()">
        Search
      </button>
    </div>

    <div id="venues">
      <table>
        <tr>
          <td>Venue ID</td>
          <td>Venue Name</td>
          <td>Venue Photo</td>
        </tr>
        <tr v-for="venue in venues">
          <td> {{ venue.venueName }} <br></td>
          <td> {{ getCategoryName(venue.categoryId) }} <br></td>
          <td>
            <img :src="getVenuePrimaryPhoto(venue.venueId,venue.primaryPhoto)" width="100px">
            <br>
          </td>
          <!--TODO: Add mean star rating and mode cost rating-->
          <td>
            <router-link :to="{name: 'venue', params: {venueId: venue.venueId}}">View</router-link>
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
        search: ""
      }
    },
    mounted: function () {
      this.getVenueCategory();
    },
    computed: {

    },
    methods: {
      getVenues: function () {
        this.$http.get("http://localhost:4941/api/v1/venues?city=" + this.search)
          .then(function (response) {
            this.venues = response.data;
          }, function(error) {
            this.error = error;
            this.errorFlag = true;
          })
      },
      getVenueCategory: function() {
        this.$http.get("http://localhost:4941/api/v1/categories")
          .then(function (response) {
            this.categories = response.data;
          });
      },
      getCategoryName: function(id) {
        if (typeof(this.categories[id-1]) !== "undefined") {
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

</style>
