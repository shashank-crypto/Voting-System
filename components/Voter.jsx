import  { useState, useEffect }  from  'react' ;
import  { db }  from  '../controllers/firebaseConfig' ;
import { getDocs, collection } from "firebase/firestore";
import { vote } from '../controllers/contractConnect';

export default function Voter({ voter, index, address }) {
    const [candidates, setCandidates] = useState([]);
    const [canVote, setCanVote] = useState(false);

    useEffect(() => {
        const getData = async () => {
            const candidatesInfo = await getDocs(
                collection(db, "Elections", ("electionAtIndex-" + index), "candidates")
            );
            if (candidatesInfo) setCandidates(candidatesInfo.docs);
        };
        getData();
    }, [index]);

    const voteCandidate = async (candidateId, candidateAddress) => {
        await vote(candidateAddress, address);
        await updateDoc(doc(db, "Elections", ("electionAtIndex-" + index), "voters", voter.uid), {
            status: "voted",
        });
        await updateDoc(doc(db, "User", voter.id, "Elections", address), {
            status: "voted",
        });
        setCanVote(true);
    }

    return (
        <div className="container is-fluid">
            <h1 className="title">Vote</h1>
            <div className="box">
                {/* show this condition when election is not started, otherwise list all the candidates and their live results */}
                {candidates.length === 0 ? (
                    <p className="subtitle">No candidates registered yet</p>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Candidate</th>
                                <th>Party</th>
                            </tr>
                        </thead>
                        <tbody>
                            {candidates.map((candidate, index) => (
                                <tr key={index}>
                                    <td>
                                        <input type='radio' name='candidate' value={candidate.id} />
                                    </td>
                                    <td>{candidate.data().name}</td>
                                    <td>{candidate.data().party}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                <button className="button is-primary" >Vote</button>
            </div>
        </div>
    );


}