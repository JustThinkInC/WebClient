<template>
  <!--<div>-->
  <!--User Page-->
  <!--</div>-->
  <div>
    <div v-if="errorFlag" style=" color: red ; ">
      {{ error }}
    </div>

    <div v-if="$route.params.userId">
      <div id="user">
        <router-link :to="{ name: 'users'}">Back to Users</router-link>
        <br>
        <!--Display users in a table-->
        <table>
          <tr>
            <td>Venue ID</td>
            <td>Venue Name</td>
          </tr>
          <tr>
            <td>{{ $route.params.userId }}</td>
            <td>{{ getSingleUser($route.params.userId).venueName}}</td>
          </tr>
        </table>

        <!--Delete user button-->
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#deleteUserModal">
          Delete
        </button>

        <!--Modal for deleting a user-->
        <div class="modal fade" id="deleteUserModal" tabindex="-1" role="dialog" aria-labelledby="deleteUserModal"
             aria-hidden="true">
          <div class="modal-dialog" role="dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="deleteUserModalLabel">Delete User</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                Are you sure that you want to delete this user?
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-dismiss="modal"
                        v-on:click="deleteUser($route.params.userId)">
                  Delete User
                </button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div v-else>
      <div id="users">
        <table>
          <tr v-for="user in users">
            <td> {{ user.venueName }}</td>
            <td>
              <router-link :to="{name: 'user', params: {userId: user.venueId}}">View</router-link>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        error: "",
        errorFlag: false,
        users: []
      }
    },
    mounted: function () {
      this.getUsers();
    },
    methods: {
      getUsers: function () {
        this.$http.get("http://localhost:4941/api/v1/venues") //('http://localhost/api/users')
          .then(function (response) {
            this.users = response.data;
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },

      getSingleUser: function (id) {
        for (var i = 0; i < this.users.length; i++) {
          if (this.users[i].venueId == id) {
            return this.users[i];
          }
        }
      },

      deleteUser: function (user_id) {
        this.$http.delete('http://localhost:4941/api/venues/' + user_id)
          .then(function (response) {
            for (var i = 0; i < this.users.length; i++) {
              if (user_id == this.users[i].venueId) {
                this.users.splice(i, 1);
              }
            }
            this.$router.push('/users');
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      }

    }
  }
</script>

<style scoped>

</style>
