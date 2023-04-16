import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "../controllers/firebaseConfig";
import {
    getDeployedElections,
    getElectionInfo,
} from "../controllers/contractConnect";
import { getWalletAddress } from "../controllers/contractConnect";
import { useRouter } from "next/router";

export default function MainPage() {

    const { push } = useRouter();

    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [electionInfo, setElectionInfo] = useState([
        { 0: "Shashank" },
        { 0: "Pranav" },
        { 0: "Abhinav" },
    ]);
    const [walletAddress, setWalletAddress] = useState("");

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

    const tagColorMap = {
        0: "is-warning",
        1: "is-success",
        2: "is-danger"
    }
    
    // check if ethereum wallet is connected
    const walletMatch = () => {
        if (walletAddress === userData?.walletId) {
            return true;
        }
        return false;
    };

    const logout = async () => {
        await signOut(auth);
        setUser(null);
    }

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log(user);
                setUser(user);
                const docData = await getDoc(doc(db, "User", user.uid));
                setUserData(docData.data());
            } else {
                push("/auth");
            }
        });
        async function getData() {
            const address = await getWalletAddress();
            if (address) setWalletAddress(address);
            const deployedElection = await getDeployedElections();
            let electionList = [];
            if (deployedElection)
                deployedElection.map(async (element) => {
                    const electioninfo = await getElectionInfo(element);
                    electionList.push(await electioninfo);
                    setElectionInfo(electionList);
                });
        }
        getData();
    }, [user]);

    return (
        <div>
            {walletMatch() ? null : (
                <div className="notification is-danger is-light container is-widescreen">
                    <p className="title is-6">Wallet Mismatch</p>
                    <p>
                        Either you are not connected to a wallet or the address
                        you are connected with and one you are registered with
                        are different. You won't be able to perform any action
                        on the elections. Please connect to the wallet you are
                        registered with.
                    </p>
                </div>
            )}
            <div className="container is-fluid">
                <div className="notification is-primary">
                    {userData ? (
                        <div>
                            <div className="box" style={{display:"flex", justifyContent:"space-between"}}>
                                <h1 className="title">Hi, {userData.name}</h1>
                                <button className="button is-danger is-light" onClick={logout}>Logout</button>
                            </div>
                            <div className="level">
                                <div className="level-left">
                                    <div>
                                        <p className="heading">Email</p>
                                        <p className="subheading">
                                            {userData.email}
                                        </p>
                                    </div>
                                </div>
                                <div className="level-right">
                                    <div>
                                        <p className="heading">Wallet Address</p>
                                        <p className="subheading">
                                            {userData.walletId}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
            <div>
            {electionInfo.map((element, index) => {
                return (
                    <div key={index} className="block card column">
                        <header className="card-header">
                            <p className="card-header-title" style={{background : "#B9EDDD"}}>{element[0]}</p>
                        </header>
                        <div className="card-content">
                            Level : {levelMap[element[1]]} <br />
                            Type of Election : {electionTypeMap[element[2]]} <br />
                            ElectionStatus : <span className={`tag ${tagColorMap[element[3]]} is-light`}> {electionStatusMap[element[3]]} </span> <br />
                        </div>
                        <footer className="card-footer">
                            <a
                                href={`elections/v2/${element[4]}-${index + 1}`}
                                className="card-footer-item"
                            >
                                Participate
                            </a>
                        </footer>
                    </div>
                );
            })}
            </div>
        </div>
    );
}
