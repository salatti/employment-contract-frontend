<template>
  <div class="new">
    <h1>New employment contract</h1>
  
    Employee name:
    <input v-model="employeeName" placeholder="edit me">
    <br> Employee address:
    <input v-model="employeeAddr" placeholder="edit me">
    <br> Last acceptance time:
    <input v-model="lastAccTime" type="date">
  
    <br>
    <button v-on:click="send">Send</button>
  
    <li v-for="item in response" v-bind:key="item">
      {{ item }}
    </li>
  </div>
</template>

<script>
import axios from 'axios';
import apiConfig from '../../config/apiurls';

export default {
  name: 'new',
  data() {
    return {
      employeeName: '',
      employeeAddr: '',
      lastAccTime: '',
      response: '',
    };
  },
  methods: {
    send() {
      const vm = this;
      console.log('Sending');
      // Send
      axios.post(`${apiConfig.getApiUrl()}/contracts`, {
        employeeName: this.employeeName,
        employeeAddr: this.employeeAddr,
        lastAccTime: this.lastAccTime,
      })
        .then((response) => {
          console.log('Response');
          vm.response = response;
          console.log(response);
        })
        .catch((error) => {
          console.log('Error');
          console.log(error);
        });
    },
  },
};
</script>
