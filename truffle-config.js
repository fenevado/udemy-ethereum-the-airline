const HDWalletProvider = require('truffle-hdwallet-provider');

const mnemonic = 'orient leisure mule broccoli sure fox focus dynamic crisp alarm faculty nasty';

module.exports = {
    networks: {
        development: {      
            host: 'localhost',
            port: 7545,
            network_id: '*',
            gas: 5000000
        },
        kovan: {
            network_id: 42,
            provider: () => new HDWalletProvider(mnemonic, 'https://kovan.infura.io/v3/2e177770da78469eb3c5f11186ef952e')
        }
    }
}