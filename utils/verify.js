const { run } = require('hardhat');

const verify = async (contractAddress, args) => {
	try {
		console.log('verifying....');
		await run('verify:verify', {
			address: contractAddress,
			constructorArguments: args,
		});
		console.log('verified....');
	} catch (error) {
		if (error?.message?.toLowerCase().includes('already verifyed'))
			console.log('Already verified');
		else console.error(error);
	}
};

module.exports = verify;
