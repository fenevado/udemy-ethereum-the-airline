const Airline = artifacts.require('Airline');

let instance;

beforeEach(async () => {
    // Desplegamos un nuevo contrato antes de cada test
    instance = await Airline.new();
});

/* truffle trae automáticamente las cuentas en accounts */
contract('Airline', accounts => {
    it('should have avaliable flights', async() => {
        var total = await instance.totalFlights();
        assert(total > 0);
    });

    it('should allow a customer to buy a flight if buy', async () => {
        var flight = await instance.flights(0);
        var fligthName = flight[0], fligthPrice = flight[1];

        await instance.buyFlight(0, { from: accounts[0], value: fligthPrice });

        // accounts[0] para el mapping, y el otro cero para el array que retorna
        var customerFlight = await instance.customerFlights(accounts[0], 0);
        var customerTotalFlights = await instance.customerTotalFlights(accounts[0]);

        // customerFlight[0] el primer valor del struct => el nombre
        // customerFlight[1] el segundo valor del struct => el precio
        assert(customerFlight[0], fligthName);
        assert(customerFlight[1], fligthPrice);
        assert(customerTotalFlights, 1);
    });

    it ('should not allow customer to buy if not provide the correct value', async() => {
        var flight = await instance.flights(0);
        let fligthPrice = flight[1] - 1000;

        try {
            await instance.buyFlight(0, { from: accounts[0], value: fligthPrice });
        }
        catch {
            return;
        }

        assert.fail();


    });

    it('should retrieve the real balance of the contract', async () => {
        var flight = await instance.flights(0);
        let fligthPrice = flight[1];

        var flight2 = await instance.flights(1);
        let fligthPrice2 = flight2[1];

        await instance.buyFlight(0, { from: accounts[0], value: fligthPrice });
        await instance.buyFlight(1, { from: accounts[0], value: fligthPrice2 });

        var airlineBalance = await instance.getAirlineBalance();

        assert(airlineBalance.toNumber(), fligthPrice2.toNumber() + fligthPrice.toNumber());
    });
    
    it('should allow customers to redeem loyalty points', async() => {
        var flight = await instance.flights(0);
        var fligthPrice = flight[1];

        await instance.buyFlight(0, { from: accounts[0], value: fligthPrice });
        
        var preBalance = await web3.eth.getBalance(accounts[0]);
        await instance.redeemLoyaltyPoints({ from: accounts[0] });
        var postBalance = await web3.eth.getBalance(accounts[0]);

        var customer = await instance.customers(accounts[0]);
        var loyaltyPoints = customer[0];

        assert(loyaltyPoints, 0);
        assert(preBalance.toNumber() < postBalance.toNumber());
    });

});
