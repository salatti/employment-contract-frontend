<template>
  <div class="Contract">
    <span v-if="show">
      <h1>{{currentNetwork}}</h1>
      {{errorMsg}}
      <br> {{id}}
      <br> {{ownerOfEmploymentContract}}
      <br> {{name}}
      <br> {{currentBlocktime}}
      <br> {{acceptTimeFormatted}}
    </span>
    <span v-else>
      <br>Loading...</span>
  </div>
</template>

<script>
import Web3 from 'web3';

const contract = require('truffle-contract');
const moment = require('moment');
const employmentContractArtifacts = require('../../../employment-contract-backend/truffle/build/contracts/EmploymentContract.json');

let web3Provided;
let provider;
let web3RequestInterval;
let employmentContractInstance;
let web3;

export default {
  name: 'Contract',
  props: ['id'],
  data() {
    return {
      show: false,
      currentNetwork: '',
      // currentAccount: '',
      // currentBalance: '',
      errorMsg: null,
      ownerOfEmploymentContract: '',
      name: '',
      currentBlocktime: '',
      acceptTimeFormatted: '',
    };
  },
  mounted() {
    const vm = this;

    setTimeout(() => {
      if (typeof web3 !== 'undefined') {
        web3Provided = new Web3(web3.currentProvider);
        provider = web3.currentProvider;
      } else {
        const defaultProvider = new Web3.providers.HttpProvider('http://localhost:8545');
        web3Provided = new Web3(defaultProvider);
        provider = defaultProvider;
      }

      function updateCurrentAccountBalance() {
        console.log('Updating current account balance..');
        console.log(`Current account: ${vm.currentAccount}`);
        web3Provided.eth.getBalance(vm.currentAccount, (error, result) => {
          if (!error) {
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
          console.log(`error ${error}`);
          vm.currentAccount = error;
        }
      });

      web3RequestInterval = setInterval(() => {
        if (web3Provided.eth.accounts[0] !== vm.currentAccount) {
          vm.currentAccount = web3.eth.accounts[0];
          updateCurrentAccountBalance();
        }
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

      // GetContract
      const EmploymentContract = contract(employmentContractArtifacts);
      EmploymentContract.setProvider(provider);

      console.log(`Getting employment contract at ${vm.id}`);
      EmploymentContract.at(vm.id)
        .then((instance) => {
          employmentContractInstance = instance;
          Promise.all([
            employmentContractInstance.employeeAddr.call(),
            employmentContractInstance.employeeName.call(),
            employmentContractInstance.creationTime.call(),
            employmentContractInstance.acceptTime.call(),
          ]).then(([owner, name2, creationTime, acceptTime]) => {
            console.log('THENNN!');

            vm.ownerOfEmploymentContract = owner;
            vm.name = web3Provided.toAscii(name2);

            vm.currentBlocktime = moment.unix(creationTime).format('DD/MM/YYYY HH:mm:ss');
            vm.acceptTimeFormatted = moment.unix(acceptTime).format('DD/MM/YYYY HH:mm:ss');
          });
        })
        .catch((error) => {
          vm.errorMsg = error;
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

