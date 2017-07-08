<template>
  <div class="listAll">
    <h1>All employment contract</h1>
    <table class="center">
      <tr>
        <th>Employee address</th>
        <th>Contract address</th>
      </tr>
  
      <tr v-for="item in response">
        <th>{{ item.employee }}</th>
        <th>
          <router-link :to="{ name: 'Contract', params: { id: item.contract }}">{{ item.contract}}</router-link>
        </th>
      </tr>
    </table>
  </div>
</template>

<script>
import axios from 'axios';
import apiConfig from '../../config/apiurls.js'
export default {
  name: 'listAll',
  data() {
    return {
      response: ""
    }
  },
  mounted() {
    console.log('Getting all');
    let vm = this;
    axios.get(`${apiConfig.getApiUrl()}/contracts`)
      .then(function (response) {
        console.log("Response")

        vm.response = response.data;
        console.log(response);
      })
      .catch(function (error) {
        console.log("Error")

        console.log(error);
      });
  }
}
</script>

<style scoped>
table.center {
  margin-left: auto;
  margin-right: auto;
}
</style>