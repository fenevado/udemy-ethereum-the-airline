export class AirlineService {
    constructor(contract) {
        this.contract = contract;
    }

    async getTotalFlights() {
        var total = (await this.contract.totalFlights()).toNumber();
        return total;
    }

    async getFlights() {
        var total = await this.getTotalFlights();
        console.log(total);
        var flights = [];

        for(var i = 0; i < total; i++) {
            var f = await this.contract.flights(i);
            flights.push(f);
        }

        var result = this.mapFlights(flights);

        console.log(result);
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

}

