require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();
require('hardhat-gas-reporter');
require('solidity-coverage');
require('@nomiclabs/hardhat-etherscan');
require('@nomiclabs/hardhat-waffle');
require('hardhat-deploy');
require('@nomiclabs/hardhat-ethers');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	defaultNetwork: 'hardhat',
	// solidity: '0.8.8',
	solidity: {
		compilers: [
			{
				version: '0.8.8',
			},
			{
				version: '0.6.6',
			},
		],
	},
	networks: {
		goerli: {
			url: process.env.GORELI_RPC_URL,
			accounts: [process.env.PRIVATE_WALLET_KEY],
			chainId: 5,
			blockConfirmations: 6,
		},
		rinkeby: {
			url: process.env.RINKEBY_RPC_URL,
			accounts: [process.env.PRIVATE_WALLET_KEY],
			chainId: 4,
		},
		localNode: {
			url: 'http://127.0.0.1:8545/',
			accounts: [
				'0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
			],
			chainId: 31337,
		},
	},
	etherscan: {
		apiKey: process.env.ETHERSCAN_KEY,
	},
	gasReporter: {
		enabled: true,
		outputFile: 'cheap-gas-reporter.txt',
		noColors: true,
		currency: 'INR',
		// coinmarketcap: process.env.COINMARKETCAP_API_KEY,
	},
	namedAccounts: {
		deployer: {
			default: 0,
		},
		user: {
			default: 0,
		},
	},
};
