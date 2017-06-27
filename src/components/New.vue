<template>
  <div class="new">
    <h1>New employment contract</h1>
  
    Employee name:
    <input v-model="employeeName" placeholder="edit me">
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
      response: ""
    }
  },
  methods: {
    send() {
      console.log(this.employeeName)
      var vm = this;
      // Send
      axios.post('http://localhost:3000/contract', {
        employeeName: this.employeeName
      })
        .then(function (response) {
          vm.response = response.data;
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });

    }
  }
}
</script>