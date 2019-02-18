import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home.vue';
import Index from '@/views/Index.vue';
import BuyList from '@/views/Buy-list.vue';
import SupportProject from '@/views/Support-project.vue';
import Support from '@/views/Support.vue';
import Login from "@/views/Login"
import SignUp from "@/views/Sign-up"
import PrimeCost from "@/views/Prime-cost"
import AverageCheck from "@/views/Average-check"
import ResetPassword from "@/views/Reset-password"
import firebase from 'firebase'

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/Index',
      component: Index,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/Buy-list',
      component: BuyList,
      name: 'BuyList'
    },
    {
      path: '/Support',
      component: Support,
      name: 'Support'
    },
    {
      path: '/Support-project',
      component: SupportProject,
      name: 'Support-project'
    },
    {
      path: '/Home',
      name: 'Home',
      component: Home,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/Index',
      name: 'Index',
      component: Index,
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/Sign-up',
      name: 'signUp',
      component: SignUp,
    },
    {
      path: '/Reset-password',
      name: 'resetPassword',
      component: ResetPassword,
    },
    {
      path: '/Prime-cost',
      name: 'primeCost',
      component: PrimeCost,
    },
    {
      path: '/Average-check',
      name: 'averageChecks',
      component: AverageCheck,
    },
  ],
});


router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) next('index');
  else if (!requiresAuth && currentUser && (to.name == 'Login' || to.name == 'Sign-up' || to.name == 'Index')) next('home');
  else next();
});


export default router;