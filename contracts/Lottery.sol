//SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "./components/IsPausable.sol";

contract Lottery is
    Initializable,
    OwnableUpgradeable,
    ReentrancyGuardUpgradeable,
    IsPausable
{
    //============== CONSTRUCTOR ==============
    constructor() {
        _disableInitializers();
    }

    //============== INITIALIZE ==============

    function initialize(uint256 _miniumPayment) initializer public {
        miniumPayment = _miniumPayment;
        islotteryOngoing = true;
        __Ownable_init();
        __IsPausable_init();
    }

    //============== VARIABLES ==============

    address payable[] public players;
    uint256 public miniumPayment;
    bool public islotteryOngoing;
    address public player;
    address public winner;
    uint256 public value;
    uint256 public totalQtyWon;

    //============== EVENTS ===============

    event newPlayer(address player, uint256 value);
    event selectedWinner(address winner, uint256 totalQtyWon);
    event newMiniumPayment(uint256 miniumPayment);

    //============== MODIFIERS ==============

    modifier lotteryOngoing() {
        require(islotteryOngoing, "Lottery has ended");
        _;
    }

    modifier paymentMeetRequirements() {
        require(msg.value > 0, "You must send Ether to enter the lottery");
        require(msg.value >= miniumPayment, "You must send a Minium amout of Ether");
        _;
    }

    function enterLottery() 
        public payable
        nonReentrant
        whenNotPaused
        paymentMeetRequirements
        lotteryOngoing
    {
        players.push(payable(msg.sender));
        emit newPlayer(msg.sender, msg.value);
    }

    function selectWinner() 
        public payable 
        onlyOwner
    {
        islotteryOngoing = false;
        uint index = getRandomNumber() % players.length;
        address lotteryWinner = players[index];
        // reset the state of the contract
        players = new address payable[](0);
        (bool success, ) = payable(lotteryWinner).call{value: address(this).balance}("");
        require(success, "error sending BNB");
        islotteryOngoing = true;
        emit selectedWinner(lotteryWinner, address(this).balance);
    }

    function changeContractOwner(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        transferOwnership(newOwner);
    }

    function changeDefaultMiniumPayment(uint256 _newMiniumPayment)
        public
        onlyOwner
    {
        require(_newMiniumPayment != 0, "New Minium Payment should be up to 0");
        miniumPayment = _newMiniumPayment;
        emit newMiniumPayment(_newMiniumPayment);
    }

    function getMiniumPayment() public view returns (uint256) {
        return miniumPayment;
    }

    function getRandomNumber() internal view returns (uint) {
        uint256 seed = uint256(block.timestamp) + uint256(block.difficulty);
        return uint256(keccak256(abi.encodePacked(seed)));
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}