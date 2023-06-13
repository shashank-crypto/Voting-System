import styles from '../styles/Home.module.css'
import Link from 'next/link'
// import 'semantic-ui-css/semantic.min.css'

const Home = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header} style={{display:"flex",color:"#fff"}}>
          <img src="./letsVote.svg" style={{width: "50vw",objectFit:"cover"}}/>
        <div style={{width:"50vw",display:"flex",flexDirection:"column",backgroundColor:"#000000",paddingRight:"10vw"}}>
      <div className={styles.navbar}>
        <a href="#about">About</a>
        <a href="#footer">Contact</a>
        <Link href="/elections/v2/create"><span id="createElectionButton"className={styles.button} style={{cursor:"pointer"}}>create election</span></Link>
      </div>
      <div style={{flexGrow:"1"}}>
        <div style={{marginTop:"20vh"}}>
      <h3 style={{fontSize:"48px"}}>Be a part of decision</h3>
        <h1 style={{fontSize:"99px",color:"#015FC7"}}>Vote Today</h1>
        <Link href="/main" ><a id="checkElections" className={styles.button}>ELECTIONS</a></Link>
        <a href="#features" className={styles.button}>READ MORE</a>
        </div>
      </div>
      </div>
      </div>
      <div className={`${styles.header}`} id="features" style={{color:"black",display:"flex"}}>
        <h1 style={{fontSize:"115px",borderBottom:"4px solid #015FC7",alignSelf:"center",transform:"rotate(-90deg)",textAlign:"center"}}>Features</h1>
        <div style={{alignSelf:"center",width:"85vw"}} className={styles.features}>
        <div>
          <img src="./lock.svg" alt="lock"/>
          <span>Secured by 256 bit encryption</span>
        </div>
        <div>
          <img src="./ethereum.svg" alt="ethereum"/>
          <span>Backed by ethereum based technology</span>
        </div>
        <div>
          <img src="./verifiedTransaction.svg" alt="verified"/>
          <span>Verified Transactions</span>
        </div>
        <div>
          <img src="./easyToUse.svg" alt="easyUse"/>
          <span>Easy to use Interface</span>
        </div>
        <div>
          <img src="./cheaper.svg" alt='cheaper'/>
          <span>Cheaper than ballot voting system</span>
        </div>
        <div>
          <img src='./faster.svg' alt='faster'/>
          <span>Faster voting process</span>
        </div>
        </div>
        {/* <img src="./feature.svg" alt="feature"/> */}
        {/* <Image src='/feature.svg' width='50' height='100'/> */}
      </div>
      <div className={`${styles.header}`} id="about" style={{display:"flex",color:"#fff",backgroundColor:"#001124"}}>
        <h1 style={{fontSize:"115px",alignSelf:"center",borderBottom:"4px solid white",width:"45vw", transform:"rotate(-90deg)",textAlign:"center"}}>About</h1>
        <p style={{width:"85vw",alignSelf:"center",fontSize:"30px",marginRight:"10%",textAlign:"justify"}}>An online voting system that will replace the 
old ballot sytem or paper system. Over the time 
we have utilized the required technology in every
sector to improve efficiency and save the extra
resources. But the voting system is still very 
expensive and requires a bigger workforce.
The system is slower and still not completely 
tamper proof. We bring the system that is safe,
reliable and solve the modern issues like higher
reachability of the booth, crowd free voting, 
inexpensive, faster results and others.
        </p>
      </div>
      <div className={styles.header} style={{display:"flex",flexDirection:"column"}}>
        <h1 style={{fontSize:"90px",textAlign:"center",marginTop:"0"}}><span style={{textDecoration:"underline",textDecorationColor:"#015FC7"}}>Follow these ea</span>sy steps</h1>
        <div className={styles.steps}>
        <div>
          <img src='./registration.png' alt='registration'/>
          <span>Register yourself by filling required information</span>
        </div>
        <div>
          <img src='./signIn.svg' alt='login'/>
          <span>SignIn as user by giving your authentication details</span>
        </div>
        <div>
          <img src='./voteOption.svg' alt='registration'/>
          <span>Go to the vote option on dashaboard</span>
        </div>
        <div>
          <img src='./securityKey.svg' alt='registration'/>
          <span>Give your security key</span>
        </div>
        <div>
          <img src='./voteCandidate.svg' alt='registration'/>
          <span>Vote your candidate and submit</span>
        </div>
        </div>
      </div>
      <div className={styles.footer} id='footer' style={{height:"50vh",display:"flex",justifyContent:"space-evenly",backgroundColor:"#001124",color:"#fff"}}>
          <div style={{textAlign:"left",margin:"15px"}}>
            <span>Contact:</span><br/>
            1800 9090 32<br/>
            1800 9000 64<br/><br/>
            <span>Helpline Number:</span><br/>
            9090 1234 46<br/>
            9090 1234 47<br/><br/>
            <span>Email:</span><br/>
            complaint@electionindia.gov.in<br/>
            info@electionindia.gov.in<br/>
          </div>
          <div >Not Great</div>
          <div>So great</div>
      </div>
    </div>
  )
}

export default Home
