const { ethers, deployments, getNamedAccounts } = require('hardhat');
const { assert, expect } = require('chai');
const { testChains } = require('../../helper-hardhat-config');

!testChains.includes(network.name)
	? describe.skip
	: describe('FundMe', async function() {
			let fundMeContract, MockV3AggregatorContract, deployer;
			const ethAmount = ethers.utils.parseEther('1');
			beforeEach(async function() {
				deployer = (await getNamedAccounts()).deployer;
				await deployments.fixture(['all']);
				fundMeContract = await ethers.getContract('FundMe', deployer);
				MockV3AggregatorContract = await ethers.getContract(
					'MockV3Aggregator',
					deployer
				);
			});

			describe('constructor', async function() {
				it('should check whether the aggregator is set correctly', async function() {
					const priceFeed = await fundMeContract.s_priceFeedInterface();
					assert.equal(priceFeed, MockV3AggregatorContract.address);
				});
			});

			describe('fund', async function() {
				it("fails when we don't pass minimum amount of ether", async function() {
					await expect(fundMeContract.fund()).to.be.reverted;
				});

				it('stores fund-sender-address in a map', async function() {
					await fundMeContract.fund({ value: ethAmount });
					const fundAmount = await fundMeContract.s_addressToAmountFunded(
						deployer
					);
					assert.equal(fundAmount.toString(), ethAmount.toString());
				});

				it('pushes the fund-sender-address in an array', async function() {
					await fundMeContract.fund({ value: ethAmount });
					const fundAddress = await fundMeContract.s_funders(0);
					assert.equal(fundAddress, deployer);
				});
			});

			describe('withdraw', async function() {
				beforeEach(async function() {
					await fundMeContract.fund({ value: ethAmount });
					await fundMeContract.cheaperWithdraw();
				});

				it('withdraw money from contract and add it to deployer wallet', async function() {
					const prevContractBalance = await fundMeContract.provider.getBalance(
						fundMeContract.address
					);
					const prevDeployerBalance = await fundMeContract.provider.getBalance(
						deployer
					);

					const transaction = await fundMeContract.cheaperWithdraw();
					const transactionReceipt = await transaction.wait(1);

					const { gasUsed, effectiveGasPrice } = transactionReceipt;
					const gasCost = gasUsed.mul(effectiveGasPrice);

					const postContractBalance = await fundMeContract.provider.getBalance(
						fundMeContract.address
					);
					const postDeployerBalance = await fundMeContract.provider.getBalance(
						deployer
					);

					assert.equal(postContractBalance.toString(), '0');
					assert.equal(
						prevContractBalance.add(prevDeployerBalance).toString(),
						postDeployerBalance.add(gasCost).toString()
					);
				});

				it('withdraw money for multiple accounts', async function() {
					const accounts = await ethers.getSigners();
					for (let i = 1; i < 6; i++) {
						const connectedContract = await fundMeContract.connect(accounts[i]);
						await connectedContract.fund({ value: ethAmount });
					}

					const prevContractBalance = await fundMeContract.provider.getBalance(
						fundMeContract.address
					);
					const prevDeployerBalance = await fundMeContract.provider.getBalance(
						deployer
					);

					const transaction = await fundMeContract.cheaperWithdraw();
					const transactionReceipt = await transaction.wait(1);

					const { gasUsed, effectiveGasPrice } = transactionReceipt;
					const gasCost = gasUsed.mul(effectiveGasPrice);

					const postContractBalance = await fundMeContract.provider.getBalance(
						fundMeContract.address
					);
					const postDeployerBalance = await fundMeContract.provider.getBalance(
						deployer
					);

					assert.equal(postContractBalance.toString(), '0');
					assert.equal(
						prevContractBalance.add(prevDeployerBalance).toString(),
						postDeployerBalance.add(gasCost).toString()
					);

					for (let i = 1; i < 6; i++) {
						assert.equal(
							await fundMeContract.s_addressToAmountFunded(accounts[i].address),
							'0'
						);
					}

					await expect(fundMeContract.s_funders(0)).to.be.reverted;
				});

				it('only allows the owner to withdraw', async function() {
					const accounts = await ethers.getSigners();
					const connected = await fundMeContract.connect(accounts[1]);

					await expect(
						connected.cheaperWithdraw()
					).to.be.revertedWithCustomError(fundMeContract, 'Fundme__NotOwner');
					// await connected.withdraw();
				});
			});
	  });
