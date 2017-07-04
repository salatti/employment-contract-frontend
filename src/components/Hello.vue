<template>
  <div class="hello">
    <span v-if="show">
      <h1>{{currentNetwork}}</h1>
      <div v-if="errorMsg" class="alert alert-danger" role="alert">
        {{errorMsg}}
      </div>
      <label>Current address:</label>
      <span>{{currentAccount}}</span>
      <br>
      <label>Current balance:</label>
      <span>{{currentBalance}}
        <i>wei</i>
      </span>
      <br>
      <label>Current balance in ether:</label>
      <span>{{currentBalanceInEther}}
        <i>ether</i>
      </span>
      <br>
      <label>Current blocknumber: </label>
      <span>{{currentBlocknumber}}</span>
    </span>
    <span v-else><br>Loading...</span>
  </div>
</template>

<script>
import Web3 from 'web3'

var web3Provided;

var bigNumberBalance;

export default {
  name: 'hello',
  data() {
    return {
      show: false,
      currentNetwork: '',
      currentAccount: '',
      currentBalance: '',
      errorMsg: null,
      currentBlocknumber: 0
    }
  },
  mounted: function () {

    var vm = this;

    setTimeout(function () {


      if (typeof web3 !== 'undefined') {
        web3Provided = new Web3(web3.currentProvider);
        console.log(vm.web3LoadInterval);
      } else {
        web3Provided = new Web3()
      }



      web3Provided.eth.getAccounts(function (error, result) {

        if (!error) {
          console.log("getAccounts() returned " + typeof (result))
          console.log(result.length)
          if (result.length > 0) {
            vm.currentAccount = result[0]
            updateCurrentAccountBalance();
          } else {
            vm.errorMsg = "Check your MetaMask login!"
          }
        } else {
          console.log("error" + error)
          vm.currentAccount = error
        }

      });


      // var web3Interval = setInterval(function () {
      //   if (web3Provided.eth.accounts[0] !== vm.currentAccount) {
      //     vm.currentAccount = web3.eth.accounts[0];
      //     updateCurrentAccountBalance()
      //   }

      //   web3Provided.eth.getBlockNumber(function (error, result) {
      //     if (!error) {
      //       console.log(result)
      //       vm.currentBlocknumber = result
      //     } else {

      //     }
      //   })

      // }, 20000);

      function updateCurrentAccountBalance() {
        console.log("Updating current account balance..")
        console.log("Current account: " + vm.currentAccount)
        web3Provided.eth.getBalance(vm.currentAccount, function (error, result) {
          if (!error) {
            bigNumberBalance = result
            vm.currentBalance = result.toNumber()
          } else {
            vm.currentBalance = 'Error'
          }
        })

      }

      web3Provided.version.getNetwork((err, netId) => {
        //console.log(netId)
        switch (netId) {
          case "1":
            vm.currentNetwork = 'Mainnet'
            break
          case "2":
            vm.currentNetwork = 'Deprecated Morden test'
            break
          case "3":
            vm.currentNetwork = 'Ropsten test network.'
            break
          case "4":
            vm.currentNetwork = 'Rinkeby test network.'
            break
          case "42":
            vm.currentNetwork = 'Kovan test network.'
            break
          default:
            vm.currentNetwork = 'An unknown network.'
        }
        vm.show = true;
      });

    }, 1000);

  },
  computed: {
    currentBalanceInEther: function () {
      return web3Provided.fromWei(this.currentBalance, 'ether')
    }
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
