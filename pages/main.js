import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "../controllers/firebaseConfig";
import {
    getDeployedElections,
    getElectionInfo,
} from "../controllers/contractConnect";
import { getWalletAddress } from "../controllers/contractConnect";

export default function MainPage() {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [electionInfo, setElectionInfo] = useState([
        { 0: "Shashank" },
        { 0: "Pranav" },
        { 0: "Abhinav" },
    ]);
    const [walletAddress, setWalletAddress] = useState("");

    // check if ethereum wallet is connected
    const walletMatch = () => {
        if (walletAddress === userData?.walletId) {
            return true;
        }
        return false;
    };

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                const docData = await getDoc(doc(db, "User", user.uid));
                setUserData(docData.data());
            } else {
                setUser(null);
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
                // <article class="message is-danger is-widescreen">
                //     <div class="message-header">
                //         <p>Wallet mismatch</p>
                //         <button class="delete" aria-label="delete"></button>
                //     </div>
                //     <div class="message-body">
                //         Either you are not connected to a wallet or the address you are connected with and one you are registered with are different. You won't be able to perform any action on the elections. Please connect to the wallet you are registered with.
                //     </div>
                // </article>
                <div class="notification is-danger is-light container is-widescreen">
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
            <div class="container is-fluid">
                <div class="notification is-primary">
                    {userData ? (
                        <div>
                            <h1 className="title">Hi {userData.name}</h1>
                            <div class="level">
                                <div class="level-left">
                                    <div>
                                        <p class="heading">Email</p>
                                        <p class="subheading">
                                            {userData.email}
                                        </p>
                                    </div>
                                </div>
                                <div class="level-right">
                                    <div>
                                        <p class="heading">Wallet Address</p>
                                        <p class="subheading">
                                            {userData.walletId}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
            <div class="columns is-mobile">
                <div class="column">1</div>
                <div class="column">2</div>
                <div class="column">3</div>
                <div class="column">4</div>
            </div>
            <div className="columns is-mobile container is-large">
            {electionInfo.map((element, index) => {
                return (
                    <div key={index} className="block card column">
                        <header className="card-header">
                            <p className="card-header-title">{element[0]}</p>
                        </header>
                        <div className="card-content">
                            Level : {element[1]} <br />
                            Type of Election : {element[2]}
                        </div>
                        <footer className="card-footer">
                            <a
                                href={`elections/${element[3]}`}
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
