<template>
  <div id="app">
    <img src="./assets/ethereum.png">
    <br>
    <router-link to="/">Metamask info</router-link>
    <router-link to="/new">Create a new contract</router-link>
    <router-link to="/all">List all contracts</router-link>
  
    <router-view></router-view>
  
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
