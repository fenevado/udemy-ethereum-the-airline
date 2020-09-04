pragma solidity ^0.4.24;

contract Airline{

    struct Customer {
        uint loyaltyPoints;
        uint totalFlights;
    }

    struct Flight {
        string name;
        uint price;
    }

    mapping(address => Customer) public customers;
    mapping(address => Flight[]) public customerFlights;
    mapping(address => uint) public customerTotalFlights;

    event FlightPurchased(address indexed customer, uint price);

    address public owner;
    Flight[] public flights;

    uint pointValue = 0.5 ether;

    constructor() public {
        owner = msg.sender;
        flights.push(Flight('Tokio', 4 ether));
        flights.push(Flight('Berlin', 5 ether));
        flights.push(Flight('Madrid', 3 ether));
    }

    function buyFlight(uint flightIndex) public payable {
        Flight memory flight = flights[flightIndex];
        require(msg.value == flight.price);

        Customer storage customer = customers[msg.sender];
        customer.loyaltyPoints += 5;
        customer.totalFlights += 1;
        customerFlights[msg.sender].push(flight);
        customerTotalFlights[msg.sender]++;

        emit FlightPurchased(msg.sender, flight.price);
    }

    function totalFlights() public view returns(uint) {
        return flights.length;
    }

    function redeemLoyaltyPoints() public {
        Customer storage customer = customers[msg.sender];
        uint etherToRefund = customer.loyaltyPoints * pointValue;

        msg.sender.transfer(etherToRefund);
        customer.loyaltyPoints = 0;
    }

    function getAirlineBalance() public view returns (uint) {
        address airlineAddress = this;
        return airlineAddress.balance;
    }

    function getRefundableEther() public view returns (uint) {
        return pointValue * customers[msg.sender].loyaltyPoints;
    }
    
    modifier isOwner(){
        require(owner == msg.sender);
        _;
    }

}
