import { createElection, getDeployedElections } from '../../../controllers/contractConnect'
import { db, auth } from '../../../controllers/firebaseConfig'
import { setDoc, getDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

function CreateElection() {

    const { push } = useRouter();

    const [user, setUser] = useState(null);
    const [modal, setModal] = useState(false);

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
                console.log("adminAddress", adminAddress)
                await setDoc(doc(db, "Elections", (random + deployedElections.length)), {
                    name: name,
                    level: level,
                    type: type,
                    status: 0,
                    admin: adminAddress['address'],
                });
                setModal(true);
            }
        }
        catch (err) {
            console.log("error", err.message)
        }
        // return false;
    }


    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                push('/auth');
            }
        });
    }, []);

    return (
        <div className='block'>
            {modal ? <div className="modal is-active">
                <div className="modal-background"></div>
                <div className="modal-card">
                    <p className="subtitle notification is-primary is-light">Election created successfully.</p>
                    <button className="button is-primary" onClick={() => setModal(false)}>Thank You</button>
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