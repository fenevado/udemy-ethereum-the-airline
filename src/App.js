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
            flights: [],
            customerFlights: [],
            refundable: 0
        }
    }

    // una vez montado
    async componentDidMount() {
        this.web3 = await getWeb3();
        this.toEther = converter(this.web3);
        this.airline = await AirlineContract(this.web3.currentProvider);
        this.airlineService = new AirlineService(this.airline);
        
        var account = (await this.web3.eth.getAccounts())[0];

        // deprecated
        // this.web3.currentProvider.publicConfigStore.on('update', async function(event){
            // this.setState({
            //     account: event.selectedAddress.toLowerCase()
            // }, () => {
            //     this.load()
            // });
            
        // });

        ethereum.on('accountsChanged', (accounts) => {
            this.setState({
                account: accounts[0]
            }, () => {
                this.load();
            })
        });

        // para otros cambios
        ethereum.on('chainChanged', (chainId) => {
            // Handle the new chain.
            // Correctly handling chain changes can be complicated.
            // We recommend reloading the page unless you have a very good reason not to.
            window.location.reload();
        });
          

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

    async getRefundable() {
        var ref = await this.airlineService.getRefundableEther(this.state.account);
        var refE = this.toEther(ref);
        this.setState({
            refundable: refE
        })
    }

    async refound(){
        await this.airlineService.refound(this.state.account);
    }
    
    async buy(flightIndex, flight){
        await this.airlineService.buyFLight(flightIndex, this.state.account, flight.price);
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
        this.getCustomerFlights();
        this.getRefundable();
    }

    async getCustomerFlights(){
        var f = await this.airlineService.getCustomerFlights(this.state.account);
        this.setState({
            customerFlights: f
        })
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
                        <span>Refundable ether: { this.state.refundable } ETHER</span>
                        <button onClick={ () => this.refound() } className="btn-success btn-sm btn text-white" >Refound</button>
                    </Panel>
                </div>
            </div>
            <div className="row">
                <div className="col-sm">
                    <Panel title="Available flights">
                        <table>
                            <tbody>
                            { this.state.flights.map((flight, i) => {
                                return <tr key={i}>
                                    <td><span>{ flight.name } - { this.toEther(flight.price) } ETHER</span></td>
                                    <td><button className="btn btn-success btn-sm text-white" onClick={() => this.buy(i, flight)}>Purchase</button></td>
                                </tr>
                            })}
                            </tbody>
                        </table>

                    </Panel>
                </div>
                <div className="col-sm">
                    <Panel title="Your flights">
                    <table>
                            <tbody>
                            { this.state.customerFlights.map((flight, i) => {
                                return <tr key={i}>
                                    <td><span>{ flight.name } - { this.toEther(flight.price) } ETHER</span></td>                                    
                                </tr>
                            })}
                            </tbody>
                        </table>
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