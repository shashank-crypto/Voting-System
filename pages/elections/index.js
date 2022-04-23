import { useState, useEffect } from "react";
// import Link from "next/link";
// import react from "react";
import {getDeployedElections, getElectionInfo} from '../../controllers/contractConnect'

function Elections() {

    const [electionInfo, setElectionInfo] = useState([{0:"eyehgeufre"}, {1:"whegrwvfwf"},{2: "wjfwfwhfvw"}]);

    useEffect(() => {
        async function getData() {
            const deployedElection = await getDeployedElections();
            let electionList = [];
            deployedElection.map(async element => {
                const electioninfo = await getElectionInfo(element);
                electionList.push(await electioninfo);
                setElectionInfo(electionList);
                // console.log("electionInfo", electionInfo);
                // console.log("element", electionList)
            })
        }
        getData()
    }, [])
    

    return(
        <div >
            {electionInfo.map((element,index) => {
                return <div key={index} className="block card">
                        <header className="card-header">
                            <p className="card-header-title">{element[0]}</p>
                            
                        </header>
                        <div className="card-content">
                            Level : {element[1]} <br/>
                            Type of Election : {element[2]}
                        </div>
                        <footer className="card-footer">
                            <a id="participateButton"href={`elections/${element[3]}`} className="card-footer-item" style={{backgroundColor: "#94eaff"}}>Participate</a>
                        </footer>
                    </div>
            })}
        </div>
    )
}

export default Elections;
