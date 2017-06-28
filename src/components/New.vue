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
  
    <li v-for="item in response">
      {{ item }}
    </li>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'new',
  data() {
    return {
      employeeName: "",
      employeeAddr: "",
      lastAccTime: "",
      response: ""
    }
  },
  methods: {
    send() {
      var vm = this;
      console.log("Sending")
      // Send
      axios.post('http://localhost:3000/contract/new', {
        employeeName: this.employeeName,
        employeeAddr: this.employeeAddr,
        lastAccTime: this.lastAccTime
      })
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
}
</script>