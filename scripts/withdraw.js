const { ethers, getNamedAccounts, network } = require('hardhat');

async function main() {
	try {
		const { deployer } = await getNamedAccounts();
		const fundMeContract = await ethers.getContract('FundMe', deployer);

		console.log('..funding');
		await fundMeContract.withdraw();
		console.log('done');
	} catch (error) {}
}

main();
