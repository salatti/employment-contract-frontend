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
    };
  },
  methods: {
    send() {
      axios.post(`${apiConfig.getApiUrl()}/contracts`, {
        employeeName: this.employeeName,
        employeeAddr: this.employeeAddr,
        lastAccTime: this.lastAccTime,
      })
        .then((response) => {
          const newContractId = response.data.address;
          this.$router.push({ name: 'Contract', params: { id: newContractId } });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
