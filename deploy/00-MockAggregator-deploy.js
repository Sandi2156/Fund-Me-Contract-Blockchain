const {
	testChains,
	decimals,
	initial_answer,
} = require('../helper-hardhat-config');
const { network } = require('hardhat');
module.exports = async (hre) => {
	const { getNamedAccounts, deployments } = hre;
	const { deploy, log } = deployments;
	const { deployer } = await getNamedAccounts();
	// console.log(deployer);
	const chainId = network.config.chainId;
	const chainName = network.name;

	if (testChains.includes(chainName)) {
		log('deploying mock v3 aggregator.....');
		await deploy('MockV3Aggregator', {
			contract: 'MockV3Aggregator',
			from: deployer,
			log: true,
			args: [decimals, initial_answer],
		});
		log('mock aggregator deployed...');
		log('-----------------------------------');
	}
};

module.exports.tags = ['all', 'mocks'];
