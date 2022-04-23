// import Web3 from "web3";

// let web3
// if(typeof window !== 'undefined' && window.ethereum !== "undefined") {
//     window.ethereum.request({method : "eth_requestAccounts"})
//     web3 = new Web3(window.ethereum);
// }
// else console.log("install metamask")

// export default web3;
import Web3 from "web3"

let web3
if(typeof window !== "undefined" && typeof window.ethereum !== "undefined"){
    //metamask is running
    window.ethereum.request({
        method: "eth_requestAccounts"
    })
    web3 = new Web3(window.ethereum)
}
else{
    //we are on next server or metamask is not installed
    const provider = new Web3.providers.HttpProvider(
        "HTTP://127.0.0.1:7545"
    )
    web3 = new Web3(provider)
}

export default web3