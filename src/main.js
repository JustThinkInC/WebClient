import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import 'vuetify/dist/vuetify.css';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App.vue';
import Home from './Home.vue';
import Users from './Users.vue';
import Venues from './Venues.vue';
import Login from './Login.vue';
import SignUp from './SignUp.vue';

Vue.use(Vuetify,{iconfont: 'md'});
Vue.use(VueRouter);
Vue.use(VueResource);
Vue.http.options.emulateJSON = true;

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/users/:userId",
    name: "user",
    component: Users
  },
  {
    path: "/users",
    name: "users",
    component: Users
  },
  {
    path:  "/venues",
    name: "venues",
    component: Venues
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/signup",
    name: "SignUp",
    component: SignUp
  }
];

const router = new VueRouter({
  routes: routes,
  mode: 'history'
});


new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
});
