import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import { db, auth } from '../../../controllers/firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth';
import { getElectionInfo, registerVoter, vote, registerCandidate, getPersonalInfo, getCandidates, getResult, approveVoter, getCandidateInfo, approveCandidate, getVoters, getVoterInfo } from '../../../controllers/contractConnect'
import { doc, getDoc, setDoc, query } from 'firebase/firestore';
import ElectionAdmin from '../../../components/ElectionAdmin';
import Voter from '../../../components/Voter';

function ElectionInteract({ query }) {

    const router = useRouter();
    const [info, setInfo] = useState({ 0: "Election name", 1: "Level", 2: "Type", 3: "Address" });
    const [index, setIndex] = useState(0);
    const [currUser, setCurrUser] = useState({});
    const [personalInfo, setPersonalInfo] = useState({});
    const [candidateInfo, setCandidateInfo] = useState([]);
    const [voterInfo, setVoterInfo] = useState([]);
    const [result, setResult] = useState([]);
    const [totalVote, setTotalVote] = useState('');

    useEffect(() => {
        async function getInfo() {
            if (!router.isReady) return
            const [address, index] = router.query.address.split("-");
            setIndex(index);
            onAuthStateChanged(auth, async (loggeduser) => {
                if (loggeduser) {
                    const user = (await getDoc(doc(db, "User", loggeduser.uid))).data();
                    const electionData = (await getDoc(doc(db, "User", loggeduser.uid, "Elections", address))).data();
                    setCurrUser({...user, 'uid': loggeduser.uid, ...electionData});
                    console.log(currUser, "currUser")
                    console.log(currUser.name)
                }
            })
            const data = await getElectionInfo(address);
            const candidateData = await getCandidates(address);
            const voterData = await getVoters(address);
            console.log("voterData", await voterData)
            const candidateList = [];
            const voterList = [];
            candidateData.map(async element => {
                const candidateinfo = await getCandidateInfo(element, address);
                candidateinfo[5] = element;
                candidateList.push(candidateinfo);
                setCandidateInfo(candidateList);
            })
            voterData.map(async element => {
                const voterinfo = await getVoterInfo(element, address);
                voterinfo[5] = element;
                voterList.push(voterinfo);
                setVoterInfo(voterList);
            })
            // setTimeout() 
            setInfo(data);
            console.log(info);
        }
        getInfo();
    }, [router.isReady, router.query.address])

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

    async function personalInfoHandler() {
        const data = await getPersonalInfo(info[3]);
        if (data[4] == 2) data[4] = "Voted"
        if (data[4] == 1) data[4] = "Approved"
        if (data[4] == 0) data[4] = "Registered"
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
                "totalVote": data[1]
            }
            dataList.push(dataObject);
            setTotalVote(data[1])
            setResult(dataList);
            console.log(result);
        })
    }

    async function registerAsVoter() {
        console.log(currUser);
        if (currUser.email) {
            const voterAdd = await registerVoter(currUser.name, currUser.age, currUser.aadhar, currUser.phone, info[4]);
            // to save the values in the database of the user
            await setDoc(doc(db, "User", currUser.uid, "Elections", info[4]), {
                "status": "Registered",
                "role" : "voter"
            })
            await setDoc(doc(db, "Elections", ("electionAtIndex-"+index), "voters", voterAdd), {
                "name": currUser.name,
                "status": "Registered"
            })
        }
    }

    // need to update party name and take from the form
    async function registerAsCandidate() {
        if (currUser.email) {
            const candidateAdd = await registerCandidate(currUser.name, 'HUT', currUser.age, currUser.aadhar, info[4]);
            await setDoc(doc(db, "User", currUser.uid, "Elections", info[4]), {
                "party": "HUT",
                "status": "Registered",
                "role" : "candidate"
            })
            await setDoc(doc(db, "Elections", ("electionAtIndex-"+index), "candidates", candidateAdd), {
                "party": "HUT",
                "name" : currUser.name,
                "status": "Registered"
            })
        }
    }

    return (
        <div className=''>
            <div className="container is-fluid">
                <div className="notification is-primary">
                        <div>
                            <h1 className="title">{info[0]}</h1>
                            <div className="level">
                                <div className="level-left">
                                    <div>
                                        <p className="heading">Address</p>
                                        <p className="subheading">
                                            {info[4]}
                                        </p>
                                    </div>
                                </div>
                                <div className="level-right">
                                    <div>
                                        <p className="heading">Election Status</p>
                                        <p className="subheading">
                                            {info[3]}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="level">
                                <div className="level-left">
                                    <div>
                                        <p className="heading">Level</p>
                                        <p className="subheading">
                                            {info[1]}
                                        </p>
                                    </div>
                                </div>
                                <div className="level-right">
                                    <div>
                                        <p className="heading">Election Type</p>
                                        <p className="subheading">
                                            {info[2]}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {currUser?.role ?
                                <p className='notification is-primary is-light'>
                                    You have registered as {currUser.role} and your status is {currUser.status}.
                                </p> :
                                info[3] == 0 ? (<div>
                                <button className="box button is-link is-light" onClick={registerAsVoter}>Register as Voter</button>
                                <button className="box button is-info is-light" onClick={registerAsCandidate}>Register as Candidate</button>
                            </div>) : 
                                <p className='notification is-danger is-light'>Registrations are closed, election is in progress.</p>
                                
                            }
                        </div>
                </div>
            </div>
            <ElectionAdmin index={index} address={info[4]} electionInfo={info}/>
            <Voter index={index} address={info[4]} voter={currUser}/>
        </div>
    )
}

export default ElectionInteract;