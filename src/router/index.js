import Vue from 'vue';
import Router from 'vue-router';
import Hello from '@/components/Hello';
import New from '@/components/New';
import ListAll from '@/components/ListAll';
import Contract from '@/components/Contract';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/new',
      name: 'New',
      component: New
    },
    {
      path: '/all',
      name: 'ListAll',
      component: ListAll
    },
    {
      path: '/contract/:id',
      name: 'Contract',
      component: Contract,
      props: true
    }
  ]
})
