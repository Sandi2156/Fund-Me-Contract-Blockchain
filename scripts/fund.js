const { getNamedAccounts, network, ethers } = require('hardhat');
async function main() {
	const { deployer } = await getNamedAccounts();
	const fundMeContract = await ethers.getContract('FundMe', deployer);

	const trans = await fundMeContract.fund({
		value: ethers.utils.parseEther('0.2'),
	});
	await trans.wait(1);
	console.log('...funded');
}

main()
	.then(() => process.exit(0))
	.catch((e) => {
		console.log(e);
		process.exit(1);
	});
