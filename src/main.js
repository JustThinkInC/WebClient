import Vue from 'vue';
import App from './App.vue';
import  Home  from  './Home.vue';
import  Users  from  './Users.vue';

import VueRouter from 'vue‑router';
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Home
  },
  {
    path: "/users",
    component: Users
  }
];

const router = new VueRouter ({
  routes: routes,
  mode: 'history'
});

new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
});
