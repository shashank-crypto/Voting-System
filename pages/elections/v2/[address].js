import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db, auth } from "../../../controllers/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
    getElectionInfo,
    registerVoter,
    vote,
    registerCandidate,
    getPersonalInfo,
    getCandidates,
    getResult,
    approveVoter,
    getCandidateInfo,
    approveCandidate,
    getVoters,
    getVoterInfo,
} from "../../../controllers/contractConnect";
import { doc, getDoc, setDoc, query } from "firebase/firestore";
import ElectionAdmin from "../../../components/ElectionAdmin";
import Voter from "../../../components/Voter";

function ElectionInteract({ query }) {
    const router = useRouter();
    const [info, setInfo] = useState({
        0: "Election name",
        1: "Level",
        2: "Type",
        3: "Address",
    });
    const [dataElection, setDataElection] = useState({});
    const [index, setIndex] = useState(0);
    const [currUser, setCurrUser] = useState({});
    const [personalInfo, setPersonalInfo] = useState({});
    const [candidateInfo, setCandidateInfo] = useState([]);
    const [voterInfo, setVoterInfo] = useState([]);
    const [result, setResult] = useState([]);
    const [totalVote, setTotalVote] = useState("");
    const [partyModal, setPartyModal] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        async function getInfo() {
            if (!router.isReady) return;
            const [address, idx] = router.query.address.split("-");
            setIndex(idx);
            onAuthStateChanged(auth, async (loggeduser) => {
                if (loggeduser) {
                    const user = (
                        await getDoc(doc(db, "User", loggeduser.uid))
                    ).data();
                    const electionData = (
                        await getDoc(
                            doc(
                                db,
                                "User",
                                loggeduser.uid,
                                "Elections",
                                address
                            )
                        )
                    ).data();
                    setCurrUser({
                        ...user,
                        uid: loggeduser.uid,
                        ...electionData,
                    });
                    console.log(electionData, "currUser");
                    console.log(currUser.name);
                } else {
                    router.push("/auth");
                }
            });
            const data = await getElectionInfo(address);
            const electionAtIndex = (await getDoc(doc(db, "Elections", "electionAtIndex-" + index))).data();
            console.log(electionAtIndex, "electionAtIndex", currUser, "currUser", electionAtIndex?.admin == currUser?.walletId)
            if (electionAtIndex && electionAtIndex?.admin == currUser?.walletId) {
                console.log("isAdmin2", isAdmin, "individual2")
                setIsAdmin(true);
            }
            console.log("isAdmin", isAdmin, "individual")
            setDataElection(electionAtIndex);
            console.log(dataElection);
            const candidateData = await getCandidates(address);
            const voterData = await getVoters(address);
            console.log("voterData", await voterData);
            const candidateList = [];
            const voterList = [];
            candidateData.map(async (element) => {
                const candidateinfo = await getCandidateInfo(element, address);
                candidateinfo[5] = element;
                candidateList.push(candidateinfo);
                setCandidateInfo(candidateList);
            });
            voterData.map(async (element) => {
                const voterinfo = await getVoterInfo(element, address);
                voterinfo[5] = element;
                voterList.push(voterinfo);
                setVoterInfo(voterList);
            });
            // setTimeout()
            setInfo(data);
            console.log(info);
        }
        getInfo();
    }, [router.isReady, router.query.address, isAdmin]);

    const levelMap = {
        0: "Local",
        1: "State",
        2: "Country"
    }

    const electionTypeMap = {
        0: "General",
        1: "By-Election"
    }

    const electionStatusMap = {
        0: "Not Started",
        1: "Started",
        2: "Ended"
    }

    async function getResultHandler() {
        let dataList = [];
        candidateInfo.map(async (element) => {
            const data = await getResult(element[5], info[3]);
            const dataObject = {
                name: element[0],
                party: element[1],
                status: element[4],
                voteData: data[0],
                totalVote: data[1],
            };
            dataList.push(dataObject);
            setTotalVote(data[1]);
            setResult(dataList);
            console.log(result);
        });
    }

    async function registerAsVoter() {
        console.log(currUser);
        if (currUser.email) {
            const voterAdd = await registerVoter(
                currUser.name,
                currUser.age,
                currUser.aadhar,
                currUser.phone,
                info[4]
            );
            // to save the values in the database of the user
            await setDoc(doc(db, "User", currUser.uid, "Elections", info[4]), {
                status: "Registered",
                role: "voter",
            });
            await setDoc(
                doc(
                    db,
                    "Elections",
                    "electionAtIndex-" + index,
                    "voters",
                    voterAdd
                ),
                {
                    name: currUser.name,
                    status: "Registered",
                }
            );
        }
    }

    // need to update party name and take from the form
    async function registerAsCandidate(e) {
        e.preventDefault();
        if (currUser.email) {
            const candidateParty = e.target.party.value;
            const candidateAdd = await registerCandidate(
                currUser.name,
                candidateParty,
                currUser.age,
                currUser.aadhar,
                info[4]
            );
            await setDoc(doc(db, "User", currUser.uid, "Elections", info[4]), {
                party: candidateParty,
                status: "Registered",
                role: "candidate",
            });
            await setDoc(
                doc(
                    db,
                    "Elections",
                    "electionAtIndex-" + index,
                    "candidates",
                    candidateAdd
                ),
                {
                    party: candidateParty,
                    name: currUser.name,
                    status: "Registered",
                }
            );
        }
        setPartyModal(false);
    }

    const logout = async () => {
        await signOut(auth);
        router.push("/auth");
    };

    return (
        <div className="">
            {partyModal ? <div className="modal is-active">
                <div className="modal-background"></div>
                <form className="modal-card" onSubmit={registerAsCandidate}>
                    <header className="modal-card-head">
                        <p className="modal-card-title">Enter your party name</p>
                        <button class="delete" aria-label="close" onClick={() => setPartyModal(false)}></button>
                    </header>
                    <section className="modal-card-body">
                        <input className="input is-primary" type="text" name="party" placeholder="Party Name" required/>
                    </section>
                    <footer className="modal-card-foot">
                        <button className="button is-success" >Register</button>
                    </footer>
                </form>
            </div> : null}
            <div className="box conatiner is-max-desktop">
                <nav className="level">
                    <div className="level-item has-text-centered">
                        <div>
                            <p className="heading">Name</p>
                            <p className="subheading">{currUser.name}</p>
                        </div>
                    </div>
                    <div className="level-item has-text-centered">
                        <div>
                            <p className="heading">Age</p>
                            <p className="subheading">{currUser.age}</p>
                        </div>
                    </div>
                    <div className="level-item has-text-centered">
                        <div>
                            <p className="heading">Email</p>
                            <p className="subheading">{currUser.email}</p>
                        </div>
                    </div>
                    <div className="level-item has-text-centered">
                        <div>
                            <p className="heading">Aadhar</p>
                            <p className="subheading">{currUser.aadhar}</p>
                        </div>
                    </div>
                    <div className="level-item has-text-centered">
                        <div>
                            <button className="button is-danger" onClick={logout}>Logout</button>
                        </div>
                    </div>
                </nav>
            </div>
            <div className="container is-fluid">
                <div className="notification is-primary">
                    <div>
                        <h1 className="title">{info[0]}</h1>
                        <div className="level">
                            <div className="level-left">
                                <div>
                                    <p className="heading">Address</p>
                                    <p className="subheading">{info[4]}</p>
                                </div>
                            </div>
                            <div className="level-right">
                                <div>
                                    <p className="heading">Election Status</p>
                                    <p className="subheading">{electionStatusMap[info[3]]}</p>
                                </div>
                            </div>
                        </div>
                        <div className="level">
                            <div className="level-left">
                                <div>
                                    <p className="heading">Level</p>
                                    <p className="subheading">{levelMap[info[1]]}</p>
                                </div>
                            </div>
                            <div className="level-right">
                                <div>
                                    <p className="heading">Election Type</p>
                                    <p className="subheading">{electionTypeMap[info[2]]}</p>
                                </div>
                            </div>
                        </div>
                        {isAdmin ? 
                            <div className="notification is-primary is-light">You have <strong>ADMIN</strong> access to this election.</div> :
                            currUser?.role ? (
                            <p className="notification is-primary is-light">
                                You have registered as {currUser.role} and your
                                status is {currUser.status}.
                            </p>
                        ) : info[3] == 0 ? (
                            <div>
                                <button
                                    className="box button is-link is-light"
                                    onClick={registerAsVoter}
                                >
                                    Register as Voter
                                </button>
                                {currUser && currUser.age >= 30 ? (
                                    <button
                                        className="box button is-info is-light"
                                        onClick={() => setPartyModal(true)}
                                    >
                                        Register as Candidate
                                    </button>
                                ) : null}
                            </div>
                        ) : (
                            <p className="notification is-danger is-light">
                                Registrations are closed, election is in
                                progress.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {isAdmin ? (
                <ElectionAdmin
                    index={index}
                    address={info[4]}
                    electionInfo={info}
                />
            ) : (
                <div>
                <div>{JSON.stringify(dataElection)}</div>
                <Voter index={index} address={info[4]} voter={currUser} />
                </div>
            )}
        </div>
    );
}

export default ElectionInteract;
