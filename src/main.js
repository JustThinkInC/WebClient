import Vue from 'vue';
import Vuetify from 'vuetify';
import VueCookie from 'vue-cookie';
import 'vuetify/dist/vuetify.min.css';
import 'vuetify/dist/vuetify.css';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App.vue';
import Home from './Home.vue';
import Venues from './Venues.vue';
import Login from './Login.vue';
import SignUp from './SignUp.vue';
import Profile from './Profile.vue';
import Admin from './Admin.vue';

Vue.use(Vuetify,{iconfont: 'md'});
Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(VueCookie);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
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
  },
  {
    path: "/profile",
    name: "profile",
    component: Profile
  },
  {
    path: "/admin",
    name: "admin",
    component: Admin
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
