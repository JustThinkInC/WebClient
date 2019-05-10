import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import 'vuetify/dist/vuetify.css';
import App from './App.vue';
import Home from './Home.vue';
import Users from './Users.vue';
import Venues from './Venues.vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import Menu from './Menu';

Vue.use(Vuetify);
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
    path: "/menu",
    name: "menu",
    component: Menu
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
