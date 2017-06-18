<template>
  <div class="hello">
    <label>Current address:</label>
    <span>{{currentAddress}}</span>
  </div>
</template>

<script>
  import Web3 from 'web3'
  
  var web3Provided;
  
  export default {
    name: 'hello',
    data() {
      return {
        currentAddress: "Loading data.." // ei päivity?
      }
    },
    created: function() {
  
      var vm = this;
  
      window.addEventListener('load', function() {
  
  
        if (typeof web3 !== 'undefined') {
          web3Provided = new Web3(web3.currentProvider);
        } else {
          web3Provided = new Web3()
        }
  
        web3Provided.eth.getAccounts(function(error, result) {
  
          if (!error) {
            vm.currentAddress = result[0];
  
          } else {
  
          }
  
        });
  
      })
    }
  
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1,
  h2 {
    font-weight: normal;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    display: inline-block;
    margin: 0 10px;
  }
  
  a {
    color: #42b983;
  }
</style>
