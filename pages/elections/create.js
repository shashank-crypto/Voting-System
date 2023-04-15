import {createElection} from '../../controllers/contractConnect'

function CreateElection() {

    async function createElectionSubmit(e) {
        try{
            e.preventDefault();
            const name = e.target.ename.value;
            const level = e.target.level.value;
            const type = e.target.type.value;

            const data = await createElection(name, level, type)
            console.log("data", JSON.stringify(data))

        }
        catch(err) {
            console.log("error", err.message)
        }
        // return false;
    }

    return(
        <div className='block'>
        <h1 className='title'>Create Election</h1>
        <form id="electionForm"className="box" onSubmit={createElectionSubmit}>
            <div className="field">
                <label className="label">Election Name</label>
                <div className="control">
                <input id="electionName"name="ename" className="input" type="text" placeholder="Uttar Pradesh 2022"/>
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