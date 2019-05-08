<template>
  <div>
    <!--Search venues button-->
    <button type="button" class="btn btn-primary" v-on:click="getVenues()">
      Search
    </button>
    <div id="venues">
      <table>
        <tr>
          <td>Venue ID</td>
          <td>Venue Name</td>
          <td>Venue Photo</td>
        </tr>
        <tr v-for="venue in venues">
          <td> {{ venue.venueName }} <br></td>
          <td> {{ venue.categoryId }} <br></td>
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
  export default {
    data() {
      return {
        error: "",
        errorFlag: false,
        venues: []
      }
    },
    mounted: function () {
      // this.getVenues();
    },
    methods: {
      getVenues: function () {
        this.$http.get("http://localhost:4941/api/v1/venues")
          .then(function (response) {
            this.venues = response.data;
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },
      getVenuePrimaryPhoto: function (id, filename) {
        if (filename === null) {
          return 'src/assets/logo.png'
        }
        return "http://localhost:4941/api/v1/venues/" + id + "/photos/" + filename
      }
    }
  }
</script>

<style scoped>

</style>
