import { createElection, getCandidates , getDeployedElections, registerVoter, registerCandidate, approveCandidate, approveVoter, getPersonalInfo} from '../controllers/contractConnect'

function Buttons() {

    async function electionCreated () {
        await createElection("UP election", 1, 1);
        console.log('created')
    }

    async function voterRegistration() {
        await registerVoter("Shashank", 19, 909901231, 9123344, "0x46CFdDf49c7C6985EAC6F244adB3168a7e4F43aB")

    }

    async function deployedElectionsInfo() {
        const elections = await getDeployedElections;
        
    }

    async function personalInfo() {
        await getPersonalInfo("0x229adDa95514411aBc90Acb6a88151c1bFc44baC");
    }

    async function voterApprove() {
        await approveVoter("0xA4Fd36CfB9DCC4547C757a97081bFF565E2789B1", "0x229adDa95514411aBc90Acb6a88151c1bFc44baC")
    }
    // setContractAddress("ox")

    async function candidateInfo() {
        await getCandidates("0xAaa501516e2c7ED9C525BAE32047516cd21B83AA");
    }

    return (
        <>
        <button onClick={electionCreated}>Create</button>
        <button onClick={getDeployedElections}>getDeployedElections</button>
        <button onClick={voterRegistration}>registerVoter</button>
        <button onClick={personalInfo}>getPersonalInfo</button>
        <button onClick={voterApprove}>ApproveVoter</button>
        <button onClick={candidateInfo}>Cnadiadte Info</button>
        </>
    )
}

export default Buttons;