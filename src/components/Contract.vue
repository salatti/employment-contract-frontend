<template>
  <div class="Contract">
    <span v-if="show">
      <p class="bg-danger">{{errorMsg}}</p>
      <div class="row">
        <div class="col-md-6 text-left">
          <h2>Network</h2>
          <label>Current network:</label> {{currentNetwork}}
          <br>
          <label>Current provider:</label> {{currentProvider}}
          <br>
          <label>Current account:</label> {{currentAccount}}
          <br>
        </div>
        <div class="col-md-6 text-left">
          <h2>Emplyoment Contract</h2>
          <label>Contract address:</label> {{id}}
          <br>
          <h3>Data</h3>
          <label>Employee address:</label> {{dataEmployee}}
          <br>
          <label>Employee name:</label> {{name}}
          <br>
          <label>Contract created:</label> {{creationTime}}
          <br>
          <label>Contract accepted:</label> {{acceptTime}}
          <br>
        </div>
      </div>
    </span>
    <span v-else>
      <br>Loading...</span>
  </div>
</template>

<script>
/* global web3 */
import Web3 from 'web3';

const contract = require('truffle-contract');
const moment = require('moment');
const employmentContractArtifacts = require('../../../employment-contract-backend/truffle/build/contracts/EmploymentContract.json');

let web3Provided;
let provider;
let web3RequestInterval;
let employmentContractInstance;

export default {
  name: 'Contract',
  props: ['id'],
  data() {
    return {
      show: false,
      currentNetwork: '',
      currentAccount: '',
      // currentBalance: '',
      currentProvider: '',
      errorMsg: null,
      dataEmployee: '',
      name: '',
      creationTime: '',
      acceptTime: '',
    };
  },
  mounted() {
    const vm = this;

    setTimeout(() => {
      if (typeof web3 !== 'undefined') {
        web3Provided = new Web3(web3.currentProvider);
        provider = web3.currentProvider;
        vm.currentProvider = 'Metamask';
      } else {
        const defaultProvider = new Web3.providers.HttpProvider('http://localhost:8545');
        web3Provided = new Web3(defaultProvider);
        provider = defaultProvider;
        vm.currentProvider = 'TestRPC';
      }

      function updateCurrentAccountBalance() {
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
          vm.errorMsg = error;
        }
      });

      web3RequestInterval = setInterval(() => {
        if (web3Provided.eth.accounts[0] !== vm.currentAccount) {
          vm.currentAccount = web3.eth.accounts[0];
          updateCurrentAccountBalance();
        }
      }, 2000);

      web3Provided.version.getNetwork((err, netId) => {
        // console.log(`netid: ${netId}`);
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

      // console.log(`Getting employment contract at ${vm.id}`);
      EmploymentContract.at(vm.id)
        .then((instance) => {
          employmentContractInstance = instance;
          Promise.all([
            employmentContractInstance.employeeAddr.call(),
            employmentContractInstance.employeeName.call(),
            employmentContractInstance.creationTime.call(),
            employmentContractInstance.acceptTime.call(),
          ]).then(([employeeAddr, name, creationTimeUnix, acceptTimeUnix]) => {
            vm.dataEmployee = employeeAddr;
            vm.name = web3Provided.toAscii(name);
            vm.creationTime = moment.unix(creationTimeUnix).format('DD/MM/YYYY HH:mm:ss');
            if (acceptTimeUnix.toNumber() === 0) {
              vm.acceptTime = 'False';
            } else {
              vm.acceptTime = moment.unix(acceptTimeUnix).format('DD/MM/YYYY HH:mm:ss');
            }
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

