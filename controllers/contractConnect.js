// import Web3 from "web3";
import web3 from "../contracts/web3";
import factory from '../contracts/build/contracts/VotingFactory.json'
import election from '../contracts/build/contracts/votingSystem.json'

const connectFactory = () => {
    return new web3.eth.Contract(JSON.parse(JSON.stringify(factory.abi)),"0x6c2559Cad2D3ca535427D036CDBaAE5B3B965195");
}

const connectElection = address => {
    return new web3.eth.Contract(JSON.parse(JSON.stringify(election.abi)),address);
}

const createElection = async (name, level, electionType) => {
    try{
        if(level > 2 || electionType > 1) {
            console.log("wrong inputs");
            return;
        }
        const address = await web3.eth.getAccounts();
        await connectFactory().methods.createElection(name, level, electionType).send({from : address[0]})
    }
    catch(err) {
        console.log("An error caught in createElection", err);
    }
}

const getDeployedElections = async () => {
    try{
        const address = await web3.eth.getAccounts();
        const elections = await connectFactory().methods.getDeployedElections().call({from : address[0]});
        console.log(elections);
        return elections;
    }
    catch(err) {
        console.log("An error occured in getDeployedElections", err);
    }
}

const getElectionInfo = async (contractAddress) => {
    try {
        const address = await web3.eth.getAccounts();
        const info = await connectElection(contractAddress).methods.getElectionInfo().call({from : address[0]});
        info[3] = contractAddress;
        return info;
    }
    catch(err) {
        console.log("Error caught in electionInfo", err);
    }
}

const registerVoter = async (name, age, aadharNumber, phone, contractAddress) => {
    try{
        const address = await web3.eth.getAccounts();
        const data = await connectElection(contractAddress).methods.registerVoter(name, age, aadharNumber, phone).send({from: address[0]})
        console.log(data);
    }
    catch(err) {
        console.log("An error occured while registering voter", err);
    }
}

const registerCandidate = async (name, party, age, aadharNumber, contractAddress) => {
    try {
        const address = await web3.eth.getAccounts();
        const txn = await connectElection(contractAddress).methods.registerCandidate(name, party, age, aadharNumber).send({from : address[0], value: web3.utils.toWei("1","ether")});
        console.log("Transaction", txn)
    }
    catch(err) {
        console.log("An error occured in registerCandidate",err);
    }
}

const approveCandidate = async (candidateAddress, contractAddress) => {
    try {
        const address = await web3.eth.getAccounts();
        await connectElection(contractAddress).methods.approveCandidate(candidateAddress).send({from : address[0]});
    }
    catch(err) {
        console.log("An error occured in approveCandidate",err)
    }
}

const approveVoter = async (voterAddress, contractAddress) => {
    try {
        const address = await web3.eth.getAccounts();
        await connectElection(contractAddress).methods.approveVoter(voterAddress).send({from : address[0]});
    }
    catch(err) {
        console.log("An error occured in approveVoter", err);
    }
}

const getPersonalInfo = async (contractAddress) => {
    try{
        const address = await web3.eth.getAccounts();
        const data = await connectElection(contractAddress).methods.getPersonalInfo().call({from: address[0]});
        console.log(data);
        return data;
    }
    catch(err) {
        console.log("An error occured in getPersonalInfo", err);
    }
}

const getCandidates = async (contractAddress) => {
    try{
        const address = await web3.eth.getAccounts();
        const candidates = await connectElection(contractAddress).methods.getCandidates().call({from : address[0]});
        console.log(candidates)
        return candidates;
    }
    catch(err) {
        console.log("Error caught in getCandidates", err)
    }
}

// const getCandidateInfo = async (contractAddress) => {
//     try{
//         let infoList = [];
//         const address = await web3.eth.getAccounts();
//         const candidateAdd = await getCandidates(contractAddress);
//         console.log("gtcndidateINfo", candidateAdd);
//         candidateAdd.map(async element => {
//             const info = await connectElection(contractAddress).methods.getCandidateInfo(element).call({from : address[0]})
//             // console.log("INfo", info)
//             infoList.push(info);
//         })
//         console.log(await infoList);
//         return infoList;
//     }
//     catch(err) {
//         console.log("An error caught in getCandidateInfo", err)
//     }
// }

const getCandidateInfo = async (candidateAddress, contractAddress) => {
    try{
        const address = await web3.eth.getAccounts();
        const candidateInfo = await connectElection(contractAddress).methods.getCandidateInfo(candidateAddress).call({from : address[0]});
        return candidateInfo;
    }
    catch(err) {
        console.log("caught an error in getcandidateInfo", err);
    }
}

const getVoters = async (contractAddress) => {
    try{
        const address =  await web3.eth.getAccounts();
        const voters = await connectElection(contractAddress).methods.getVoters().call({from : address[0]});
        console.log(voters);
        return voters;
    }
    catch(err) {
        console.log("Error in getVoter", err);
    }
}

const getVoterInfo = async (voterAddress, contractAddress) => {
    try{
        const address = await web3.eth.getAccounts();
        const voterInfo = await connectElection(contractAddress).methods.getVoterInfo(voterAddress).call({from : address[0]});
        return voterInfo
    }
    catch(err) {
        console.log("Error in getVoterInfo", err);
    }
}

const vote = async (candidateAddress, contractAddress) => {
    try{
        const address = await web3.eth.getAccounts();
        const txn = await connectElection(contractAddress).methods.vote(candidateAddress).send({from : address[0]});
        console.log("Transaction",txn);
    }
    catch(err) {
        console.log("Error in vote", err)
    }
}
// const vote = async ()
const getResult = async (candidateAddress, contractAddress) => {
    try{
        const address = await web3.eth.getAccounts();
        const result = await connectElection(contractAddress).methods.getResult(candidateAddress).call({from: address[0]});
        console.log("result", result);
        return result;
    }
    catch(err) {
        console.log("Error caught while getting result", err)
    }
}

export { createElection, getResult, vote, getVoters, getVoterInfo, getElectionInfo, getDeployedElections, registerVoter, registerCandidate, approveCandidate, approveVoter, getPersonalInfo, getCandidates, getCandidateInfo}
