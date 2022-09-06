const { network } = require('hardhat');
const { networkConfig, testChains } = require('../helper-hardhat-config');
const verify = require('../utils/verify');

module.exports = async (hre) => {
	const { getNamedAccounts, deployments } = hre;
	const { deploy, log } = deployments;
	const { deployer } = await getNamedAccounts();
	const chainId = network.config.chainId;

	// const priceFeedAddress = networkConfig[chainId]['priceFeedAddress'];
	let priceFeedAddress;
	console.log(`chainId : ${chainId}`);
	if (testChains.includes(network.name)) {
		const mock = await deployments.get('MockV3Aggregator');
		priceFeedAddress = mock.address;
	} else {
		priceFeedAddress = networkConfig[chainId]['priceFeedAddress'];
		console.log(
			`chainlink priceFeedAddress for ${networkConfig[chainId]['name']} network : ${priceFeedAddress}`
		);
	}

	// well what will happen when we want to change chains
	// when going for localhost or hardhat network we want to use a mock
	log('fundme deploying....');
	const fundmeContract = await deploy('FundMe', {
		contract: 'FundMe',
		from: deployer,
		args: [priceFeedAddress],
		waitConfirmations: network.config.blockConfirmaions | 1,
	});
	log('fundme deployed...');
	if (!testChains.includes(network.name)) {
		await verify(fundmeContract.address, [priceFeedAddress]);
	}
	log('---------------------------------');
};

module.exports.tags = ['all', 'fundme'];
