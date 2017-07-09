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
    <span v-else>
      <br>Loading...</span>
  </div>
</template>

<script>
import Web3 from 'web3';

let web3Provided;
// let bigNumberBalance;
let web3RequestInterval;
let web3;

export default {
  name: 'hello',
  data() {
    return {
      show: false,
      currentNetwork: '',
      currentAccount: '',
      currentBalance: '',
      errorMsg: null,
      currentBlocknumber: 0,
    };
  },
  mounted() {
    const vm = this;

    setTimeout(() => {
      if (typeof web3 !== 'undefined') {
        // Get injected web3 object
        web3Provided = new Web3(web3.currentProvider);
      } else {
        web3Provided = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
      }

      function updateCurrentAccountBalance() {
        console.log('Updating current account balance..');
        console.log(`Current account: ${vm.currentAccount}`);
        web3Provided.eth.getBalance(vm.currentAccount, (error, result) => {
          if (!error) {
            vm.bigNumberBalance = result;
            vm.currentBalance = result.toNumber();
          } else {
            vm.currentBalance = 'Error';
          }
        });
      }

      web3Provided.eth.getAccounts((error, result) => {
        if (!error) {
          if (result.length > 0) {
            vm.currentAccount = result[0];
            updateCurrentAccountBalance();
          } else {
            vm.errorMsg = 'Check your MetaMask login!';
          }
        } else {
          console.log(`error: ${error}`);
          vm.currentAccount = error;
        }
      });

      web3RequestInterval = setInterval(() => {
        if (web3Provided.eth.accounts[0] !== vm.currentAccount) {
          vm.currentAccount = web3.eth.accounts[0];
          this.updateCurrentAccountBalance();
        }

        web3Provided.eth.getBlockNumber((error, result) => {
          if (!error) {
            console.log(result);
            vm.currentBlocknumber = result;
          }
        });
      }, 2000);

      web3Provided.version.getNetwork((err, netId) => {
        console.log(`netid: ${netId}`);
        switch (netId) {
          case '1':
            vm.currentNetwork = 'Mainnet';
            break;
          case '2':
            vm.currentNetwork = 'Deprecated Morden test';
            break;
          case '3':
            vm.currentNetwork = 'Ropsten test network.';
            break;
          case '4':
            vm.currentNetwork = 'Rinkeby test network.';
            break;
          case '42':
            vm.currentNetwork = 'Kovan test network.';
            break;
          default:
            vm.currentNetwork = 'An unknown network.';
        }
        vm.show = true;
      });
    }, 1000);
  },
  computed: {
    currentBalanceInEther() {
      return web3Provided.fromWei(this.currentBalance, 'ether');
    },
  },
  destroyed() {
    clearInterval(web3RequestInterval);
  },
};
</script>

