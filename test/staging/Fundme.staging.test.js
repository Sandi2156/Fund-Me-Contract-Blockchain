const { network, getNamedAccounts, ethers } = require('hardhat');
const { testChains } = require('../../helper-hardhat-config');
const { assert } = require('chai');

testChains.includes(network.name)
	? describe.skip
	: describe('fundMe', async function() {
			let deployer, fundMeContract;
			const ethValue = await ethers.utils.parseEther('0.1');
			beforeEach(async function() {
				deployer = (await getNamedAccounts()).deployer;
				fundMeContract = await ethers.getContract('FundMe');
			});

			it('will fund and withdraw', async function() {
				await fundMeContract.fund({
					value: ethValue,
				});

				await fundMeContract.cheaperWithdraw();

				const totalAmount = await fundMeContract.provider.getBalance(
					fundMeContract.address
				);
				assert.equal(totalAmount.toString(), '0');
			});
	  });
