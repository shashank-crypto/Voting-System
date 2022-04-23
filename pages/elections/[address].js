import {useRouter} from 'next/router'
import { useEffect, useState } from 'react';
import {getElectionInfo, registerVoter, vote, registerCandidate, getPersonalInfo, getCandidates, getResult,  approveVoter, getCandidateInfo, approveCandidate, getVoters, getVoterInfo} from '../../controllers/contractConnect'

function ElectionInteract({query}) {

    const router = useRouter();
    const [info, setInfo] = useState({0: "Election name", 1: "Level", 2: "Type", 3: "Address"});
    const [personalInfo, setPersonalInfo] = useState({});
    const [candidateInfo, setCandidateInfo] = useState([]);
    const [voterInfo, setVoterInfo] = useState([]);
    const [result, setResult] = useState([]);
    const [totalVote, setTotalVote] = useState('');

    useEffect(()=> {
        async function getInfo() {
            if(!router.isReady) return
            const data = await getElectionInfo(router.query.address);
            const candidateData = await getCandidates(router.query.address);
            const voterData = await getVoters(router.query.address);
            console.log("voterData", await voterData)
            const candidateList = [];
            const voterList = [];
            candidateData.map(async element => {
                const candidateinfo = await getCandidateInfo(element, router.query.address);
                candidateinfo[5] = element;
                candidateList.push(candidateinfo);
                setCandidateInfo(candidateList);
            })
            voterData.map(async element => {
                const voterinfo = await getVoterInfo(element, router.query.address);
                voterinfo[5] = element;
                voterList.push(voterinfo);
                setVoterInfo(voterList);
            })
            // setTimeout() 
            setInfo(data);
        }
        getInfo();
    },[router.isReady])

    async function voterRegistration(e) {
        e.preventDefault();
        const name = e.target.voterName.value;
        const age = e.target.age.value;
        const aadhar = e.target.aadhar.value;
        const phone = e.target.phone.value
        console.log(info);
        await registerVoter(name, age, aadhar, phone, info[3]);
        e.target.reset();
    }

    async function candidateRegistration(e) {
        e.preventDefault();
        const name = e.target.candidateName.value;
        const party = e.target.party.value;
        const age = e.target.age.value;
        const aadhar = e.target.aadhar.value;
        await registerCandidate(name, party, age, aadhar, info[3]);
        e.target.reset();
    }

    async function personalInfoHandler() {
        const data = await getPersonalInfo(info[3]);
        if(data[4]==2) data[4] = "Voted"
        if(data[4] == 1) data[4] = "Approved"
        if(data[4] == 0 ) data[4] = "Registered"
        setPersonalInfo(data);
    }

    async function getResultHandler() {
        let dataList = []
        candidateInfo.map(async element => {
            const data = await getResult(element[5], info[3]);
            const dataObject = {
                "name": element[0],
                "party": element[1],
                "status": element[4],
                "voteData": data[0],
                "totalVote" : data[1]
            }
            dataList.push(dataObject);
            setTotalVote(data[1])
            setResult(dataList);
            console.log(result);
        })
    }

    // async function getCandidateInfoHandler() {
    //     const candidateInfo = [];
    //     const candidates = await getCandidates(info[3]);
    //     candidates.map(async element => {
    //         const data = await getCandidateInfo(element, info[3]);
    //         candidateInfo.push(data);
    //         return<div>{data[0]}</div>
    //     })
    //     console.log("data", candidateInfo);
    // }

    return(
        <div className='columns'>
            <div className='column'>
            <div className="block card">
                        <header className="card-header">
                            <p className="card-header-title">{info[0]}</p>
                            
                        </header>
                        <div className="card-content">
                            Level : {info[1]} <br/>
                            Type of Election : {info[2]}
                        </div>
                        <footer className="card-footer">
                            {/* <button className="card-footer-item button is-link is-light" onClick={personalInfoHandler}>Voter</button>
                            <button className="card-footer-item button is-info is-light" >Candidate</button>
                            <button className="card-footer-item button is-success is-light">Admin</button> */}
                             <button className="card-footer-item button is-link is-light" onClick={personalInfoHandler}>Get Personal Info</button>
                             <button className="card-footer-item button is-success is-light" onClick={getResultHandler}>Get Result</button>
                        </footer>
                    </div>   

                    
                    <div className='box block'>
                        {/* {candidateInfo.map( (element, index) => {
                            if (element[4] == 0) return(
                                <div>Helo</div>
                            );
                            return(
                                <div key={index}>{element[0]} {element[5]}</div>
                            )
                            
                        })} */}
                        <h1 className='title'>Result</h1>
                        <div className='columns subtitle '>
                                    <div className='column'>Name</div>
                                    <div className='column'>Party</div>
                                    <div className='column'>Vote</div>
                                </div>
                        {result.map((element,index) => {
                            console.log(element)
                            if(element.status==0) return
                            return(
                                <div key={index} className='columns'>
                                    <div className='column'>{element.name}</div>
                                    <div className='column'>{element.party}</div>
                                    <div className='column'>{element.voteData}</div>
                                </div>
                            )
                        })}
                        <h1 className='subtitle'>Total Vote Count: {totalVote}</h1>

                    </div>
            </div>
            <div className='column'> 

            <div className='block box'>
                <p className='title'> Personal Info</p>
                <span className='subtitle'>Name</span> : {personalInfo[0]} <br/>
                <span className='subtitle'>Age</span> : {personalInfo[1]} <br/>
                <span className='subtitle'>Aadhar Number</span> : {personalInfo[2]} <br/>
                <span className='subtitle'>Phone Number</span> : {personalInfo[3]} <br/>
                <span className='subtitle'>Status</span> : {personalInfo[4]}
            </div>

            {/* <button onClick={getCandidateInfoHandler}>candidate info</button> */}

            <h1 className=' block title'>CANDIDATES</h1>
            {candidateInfo.map((element,index) => {
                return( 
                // <div className='box' key={index}>
                    <div className="block card" key={index}>
                        <header className="card-header">
                            <p className="card-header-title">{element[0]}</p>
                            {(element[4]!=0) ? (<button className="card-header-icon" aria-label="more options">
                            <span className="tag is-primary is-light">Approved</span>
                            </button>) : <div></div>}
                            
                        </header>
                        <div className="card-content">
                            Party : {element[1]} <br/>
                            Age: {element[2]}<br/>
                            Aadhar Number : {element[3]} <br/>
                        </div>
                        <footer className="card-footer">
                            <button className="card-footer-item button is-info" onClick={async () => {await vote(element[5], info[3])}}>Vote</button>
                            <button className="card-footer-item button is-success" onClick={async () => {await approveCandidate(element[5], info[3])}}>Approve</button>
                        </footer>
                    </div>
                // </div>
                )
            })}

            <h1 className='title block'>VOTERS</h1>
            {voterInfo.map((element,index) => {
                return( 
                // <div className='box' key={index}>
                    <div className="block card" key={index}>
                        <header className="card-header">
                            <p className="card-header-title">{element[0]}</p>
                            {(element[4]!=0) ? (<button className="card-header-icon" aria-label="more options">
                            <span className="tag is-primary is-light">Approved</span>
                            </button>) : <div></div>}
                            
                        </header>
                        <div className="card-content">
                            Age : {element[1]} <br/>
                            Aadhar Number: {element[2]}<br/>
                            Phone : {element[3]} <br/>
                        </div>
                        <footer className="card-footer">
                            {/* <button className="card-footer-item button is-info" >Vote</button> */}
                            <button className="card-footer-item button is-success" onClick={async () => {await approveVoter(element[5], info[3])}}>Approve</button>
                        </footer>
                    </div>
                // </div>
                )
            })}

            <h1 className='title block'>Register as Voter</h1>
            <form id="registerVoter"className="block box for-voter" onSubmit={voterRegistration}>
            <div className="field">
                <label className="label">Name</label>
                <div className="control">
                <input id="voterName"name="voterName" className="input" type="text" placeholder="John Doe"/>
                </div>
            </div>

            <div className="field">
                <label className="label">Age</label>
                <div className="control">
                <input id="age"name="age" className="input" type="number" placeholder=">=18"/>
                </div>
            </div>

            <div className="field">
                <label className="label">Aadhar Number</label>
                <div className="control">
                <input id="aadh"name="aadhar" className="input" type="number" placeholder="190090901234"/>
                </div>
            </div>

            <div className="field">
                <label className="label">Phone Number</label>
                <div className="control">
                <input id="phone"name="phone" className="input" type="number" placeholder="9835670398"/>
                </div>
            </div>

            <button type="submit" className="button is-primary">Register</button>
        </form>
        
        <h1 className='block title'>Register as Candidate</h1>
        <form id="registerCandidate"className="block box for-voter" onSubmit={candidateRegistration}>
            <div className="field">
                <label className="label">Name</label>
                <div className="control">
                <input id="candidateName"name="candidateName" className="input" type="text" placeholder="John Doe"/>
                </div>
            </div>

            <div className="field">
                <label className="label">Age</label>
                <div className="control">
                <input id="candidateAge"name="age" className="input" type="number" placeholder=">=30"/>
                </div>
            </div>

            <div className="field">
                <label className="label">Party Name</label>
                <div className="control">
                <input id="candidateParty"name="party" className="input" type="text" placeholder="LLP"/>
                </div>
            </div>

            <div className="field">
                <label className="label">Aadhar Number</label>
                <div className="control">
                <input id="candidateAadh"name="aadhar" className="input" type="number" placeholder="123406069090"/>
                </div>
            </div>

            <button type="submit" className="button is-primary">Register</button>
        </form>
         </div>
        </div>
    )
}

export default ElectionInteract;