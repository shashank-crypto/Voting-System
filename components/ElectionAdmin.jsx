import { useEffect, useState } from "react";
import { db } from "../controllers/firebaseConfig";
import { getDocs, setDoc, updateDoc, doc, collection } from "firebase/firestore";
import { approveCandidate, approveVoter, endElection, startElection } from "../controllers/contractConnect";

// if no wallet mismatch and is an admin, then show the approve button
export default function ElectionAdmin({ index, address, electionInfo }) {
  // get the voters and candidates from the database
  // if there status is registered, then show the approve button
  const [voters, setVoters] = useState([]);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const votersInfo = await getDocs(
        collection(db, "Elections", ("electionAtIndex-" + index), "voters")
      );
      if (votersInfo) {
        setVoters(votersInfo.docs);
        console.log(">>>>>>>>", JSON.stringify(voters), "<<<<<<<<<", voters.at(0));
        
      }
      const candidatesInfo = await getDocs(
        collection(db, "Elections", ("electionAtIndex-" + index), "candidates")
      );
      if (candidatesInfo) setCandidates(candidatesInfo.docs);
    };
    getData();
    console.log(index, address, electionInfo)
  }, [index, electionInfo]);

  const voterApproval = async (voterAddress, userId) => {
    await approveVoter(voterAddress, address);
    await updateDoc(doc(db, "Elections", ("electionAtIndex-" + index), "voters", userId), {
      status: "approved",
    });
    await updateDoc(doc(db, "User", userId, "Elections", address), {
      status: "approved",
    });
  }

  const candidateApproval = async (candidateAddress, userId) => {
    await approveCandidate(candidateAddress, address)
    await updateDoc(doc(db, "Elections", ("electionAtIndex-" + index), "candidates", userId), {
      status: "approved",
    });
    await updateDoc(doc(db, "User", userId, "Elections", address), {
      status: "approved",
    });
  }

  return (
    <div className="container is-fluid">
      <div className=" box">
      {electionInfo[3] == 0 &&<button className="button is-primary" onClick={() => startElection(address)}>Start Election</button>}
      {electionInfo[3] == 1 && <button className="button is-danger" onClick={() => endElection(address)}>End Election</button>}
      </div>
      <h1 className="title">Voters</h1>
      <div className="box">
        {/* show this condition when election is not started, otherwise list all the candidates and their live results */}
      {voters.length === 0 ? (
        <p className="subtitle">No voters registered yet</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Voters</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            { voters && voters.map((voter, index) => {
              const voterData = voter.data();
              return (
                <tr key={index}>
                  <td>{voterData.name}</td>
                  <td>{voterData.status}</td>
                  <td>
                    <button className="button is-primary" onClick={() => voterApproval(voterData.voterWallet, voter.id)} disabled={voterData.status != 'Registered'}>Approve</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      </div>
      <h1 className="title">Candidates</h1>
      <div className="box">
      {candidates.length === 0 ? (
        <p className="subtitle">No Candidates registered yet</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Candidates</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate, index) => {
              const candidateData = candidate.data();
              return (
                <tr key={index}>
                  <td name="name">{candidateData.name}</td>
                  <td name="status">{candidateData.status}</td>
                  <td>
                    <button className="button is-primary" onClick={() => candidateApproval(candidateData.candidateWallet)}>Approve</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      </div>
    </div>
  );
}
