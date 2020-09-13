export class AirlineService {
    constructor(contract) {
        this.contract = contract;
    }

    async getTotalFlights() {
        var total = (await this.contract.totalFlights()).toNumber();
        return total;
    }

    async getRefundableEther(from){
        var points = (await this.contract.getRefundableEther({ from })).toNumber();
        return points;
    }

    async refound(from){
        await this.contract.redeemLoyaltyPoints({ from });
    }

    async getFlights() {
        var total = await this.getTotalFlights();
        var flights = [];

        for(var i = 0; i < total; i++) {
            var f = await this.contract.flights(i);
            flights.push(f);
        }

        var result = this.mapFlights(flights);

        return result;
    }

    mapFlights(flights) {
        return flights.map(flight => {
            return {
                name: flight[0],
                price: flight[1]
            }
        })
    }

    async buyFLight(flightIndex, from, value){
        return this.contract.buyFlight(flightIndex, { from, value });
    }

    async getCustomerFlights(from){
        var total = (await this.contract.customerTotalFlights(from)).toNumber();
        var flights = [];
        var flight = undefined;
        for(var i = 0; i < total; i++){
            flight = await this.contract.customerFlights(from, i);
            flights.push(flight);
        }

        return this.mapFlights(flights);
    }

}

