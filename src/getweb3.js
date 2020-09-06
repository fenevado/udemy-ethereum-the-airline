import Web3 from 'web3';

const getWeb3 = () => {

    return new Promise( (resolve, reject) => {
        window.addEventListener('load', function(){
            let web3 = window.web3;

            /* Para cambiar el web3 que utiliza el cliente
                Metamask por ejemplo usa 0.x => queremos 1.x
            */
            if (typeof web3 !== undefined){
                web3 = new Web3(web3.currentProvider);
                resolve(web3);
            }
            else{
                console.error('Metamask doesnt found');
                reject();
            }
        })

    })

}

export default getWeb3;
