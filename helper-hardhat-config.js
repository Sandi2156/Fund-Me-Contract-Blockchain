const networkConfig = {
	4: {
		name: 'rinkeby',
		priceFeedAddress: '0x8A753747A1Fa494EC906cE90E9f37563A8AF630e',
	},
	5: {
		name: 'goerli',
		priceFeedAddress: '0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e',
	},
};

const testChains = ['hardhat', 'localhost', 'localNode'];
const decimals = 8;
const initial_answer = 100000000000;

module.exports = {
	networkConfig,
	testChains,
	decimals,
	initial_answer,
};
