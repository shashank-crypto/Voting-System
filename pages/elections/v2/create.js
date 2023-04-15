import { createElection, getDeployedElections } from '../../../controllers/contractConnect'
import { db, auth } from '../../../controllers/firebaseConfig'
import { setDoc, getDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';

function CreateElection() {

    const [user, setUser] = useState(null);
    const [success, setSuccess] = useState(false);

    async function createElectionSubmit(e) {
        try {
            e.preventDefault();
            const random = "electionAtIndex-"
            const name = e.target.ename.value;
            const level = e.target.level.value;
            const type = e.target.type.value;
            const adminAddress = await createElection(name, level, type)
            const deployedElections = await getDeployedElections();
            if (adminAddress) {
                setSuccess(true);
                console.log("adminAddress", deployedElections)
                await setDoc(doc(db, "Elections", (random + deployedElections.length)), {
                    name: name,
                    level: level,
                    type: type,
                    status: 0,
                    admin: adminAddress['address'],
                });
                console.log(success);
            }
        }
        catch (err) {
            console.log("error", err.message)
        }
        // return false;
    }

    useEffect(() => {
        // onAuthStateChanged(auth, (user) => {
        //     if (user) {
        //         setUser(user);
        //         console.log("user", user)
        //     } else {
        //         // User is signed out
        //         // ...
        //         console.log("user", user)
        //     }
        // });
        setTimeout(() => {
            setSuccess(false);
        }, 10000);
    }, [success])

    return (
        <div className='block'>
            {success ? <div className="modal">
                <div className="modal-background"></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">Modal title</p>
                        <button className="delete" aria-label="close"></button>
                    </header>
                    <section className="modal-card-body">
                        -- Content ... --
                    </section>
                    <footer className="modal-card-foot">
                        <button className="button is-success">Save changes</button>
                        <button className="button">Cancel</button>
                    </footer>
                </div>
            </div> :  null}
            <h1 className='title'>Create Election</h1>
            <form id="electionForm" className="box" onSubmit={createElectionSubmit}>
                <div className="field">
                    <label className="label">Election Name</label>
                    <div className="control">
                        <input id="electionName" name="ename" className="input" type="text" placeholder="Uttar Pradesh 2022" />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Level</label>
                    <div className="control">
                        <select className="input" id="level" name="level" defaultValue={2}>
                            <option value={0}>Local</option>
                            <option value={1}>State</option>
                            <option value={2}>Country</option>
                        </select>
                    </div>
                </div>

                <div className="field">
                    <label className="label">Election Type</label>
                    <div className="control">
                        <select className="input" id="type" name="type" defaultValue={0}>
                            <option value={0}>Regular</option>
                            <option value={1}>Filling</option>
                            {/* <option value="2" selected>Country</option> */}
                        </select>
                    </div>
                </div>

                <button type="submit" className="button is-primary">Create</button>
            </form>
        </div>
    )
}

export default CreateElection;