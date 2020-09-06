import React, { Component } from "react";
import Panel from "./Panel";
import getWeb3 from './getweb3';
import AirlineContract from './airline';
import { AirlineService } from './airlineService';

export class App extends Component {

    /*
        Para poder usar las cuentas de Metamask, necesitamos 
        ejecutar el método ethereum.enable()!
    */

    constructor(props) {
        super(props);
        this.state = {
            account: undefined,
            balance: 0,
            flights: []
        }
    }

    // una vez montado
    async componentDidMount() {
        this.web3 = await getWeb3();
        this.toEther = converter(this.web3);
        this.airline = await AirlineContract(this.web3.currentProvider);
        this.airlineService = new AirlineService(this.airline);
        
        var account = (await this.web3.eth.getAccounts())[0];

        this.setState({
            account: account.toLowerCase()

        }, function() {
            this.load();
        });
        
    }

    async getFlights() {
        var f = await this.airlineService.getFlights();
        this.setState({
            flights: f
        });
    }

    async getBalance() {
        var weiBalance = await this.web3.eth.getBalance(this.state.account);
        var etherBalance = this.toEther(weiBalance);
        this.setState({
            balance: etherBalance
        });

        
    }

    async load() {
        this.getBalance();
        this.getFlights();
    }

    render() {
        return <React.Fragment>
            <div className="jumbotron">
                <h4 className="display-4">Welcome to the Airline!</h4>
            </div>

            <div className="row">
                <div className="col-sm">
                    <Panel title="Balance">
                        <p><strong>{ this.state.account }</strong></p>
                        <span><strong>Balance</strong> { this.state.balance } ETHER</span>
                    </Panel>
                </div>
                <div className="col-sm">
                    <Panel title="Loyalty points - refundable ether">
                        
                    </Panel>
                </div>
            </div>
            <div className="row">
                <div className="col-sm">
                    <Panel title="Available flights">
                        { this.state.flights.map((flight, i) => {
                            return <div key={i}>
                                <span>{ flight.name } - { this.toEther(flight.price) } ETHER</span>
                            </div>
                        })}

                    </Panel>
                </div>
                <div className="col-sm">
                    <Panel title="Your flights">

                    </Panel>
                </div>
            </div>
        </React.Fragment>
    }
}

const converter = (web3) => {
    return (value) => {
        return web3.utils.fromWei(value.toString(), 'ether');
    }
}