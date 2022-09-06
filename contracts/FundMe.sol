// SPDX-License-Identifier: MIT
// pragma
pragma solidity ^0.8.8;

// imports
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";

// errors
error Fundme__NotOwner();

// interfaces, library

/**
 * @title FundMe Contract
 * @author Sandipan Mahata
 * @notice this contract implements the funding for practice
 * @dev we have used pricefeed from chain link
 */
contract FundMe {
    // Type Declarations
    using PriceConverter for uint256;

    // State Variables
    mapping(address => uint256) public s_addressToAmountFunded;
    address[] public s_funders;
    // Could we make this constant?  /* hint: no! We should make it immutable! */
    address public immutable i_owner;
    uint256 public constant MINIMUM_USD = 50 * 10**18;
    AggregatorV3Interface public s_priceFeedInterface;
    modifier onlyOwner() {
        // require(msg.sender == owner);
        if (msg.sender != i_owner) revert Fundme__NotOwner();
        _;
    }

    /* Functions order  
        1. constructor
        2. receive
        3. fallback
        4. external
        5. public
        6. internal
        7. private
        8. view/pure
    */

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeedInterface = AggregatorV3Interface(priceFeedAddress);
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    function getOwnerAddress() public view returns (address) {
        return i_owner;
    }

    function fund() public payable {
        require(
            msg.value.getConversionRate(s_priceFeedInterface) >= MINIMUM_USD,
            "You need to spend more ETH!"
        );
        // require(PriceConverter.getConversionRate(msg.value) >= MINIMUM_USD, "You need to spend more ETH!");
        s_addressToAmountFunded[msg.sender] += msg.value;
        s_funders.push(msg.sender);
    }

    function getVersion() public view returns (uint256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
        );
        return priceFeed.version();
    }

    /**
     * @notice this function transfer the accumulated fund to the owner of the contract
     */
    function withdraw() public payable onlyOwner {
        for (
            uint256 funderIndex = 0;
            funderIndex < s_funders.length;
            funderIndex++
        ) {
            address funder = s_funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);
        // // transfer
        // payable(msg.sender).transfer(address(this).balance);
        // // send
        // bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // require(sendSuccess, "Send failed");
        // call
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call failed");
    }

    function cheaperWithdraw() public payable onlyOwner {
        address[] memory funders = s_funders;
        uint256 len = funders.length;
        for (uint256 funderIndex = 0; funderIndex < len; funderIndex++) {
            address funder = funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call failed");
    }
}
