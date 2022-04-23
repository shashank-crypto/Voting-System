import Link from 'next/link';
import { useState } from 'react';
import web3 from './../contracts/web3';
// import { useMoralis } from "react-moralis";

export default function RegisterPage() {

    // const { authenticate, isAuthenticated, isAuthenticating, user, account, logout } = useMoralis();

    // const [address, setAddress] = useState('');
    const [registrationInfo, setRegistrationInfo] = useState({
        name: '',
        dateOfBirth: '',
        guardian: '',
        guardianName : '',
        email:'',
        phoneNumber: '',
        password: '',
        aadharNumber: '',
        address : ''
    })

    const handleChange = (event) => {
        setRegistrationInfo({[event.target.form.name]: eve})
    }

    async function getAddress() {
        // await authenticate({signingMessage : "Signin in"})
        // .then(user => {
        //     console.log(user);
        //     console.log(user.get("ethAddress"));
        //     setAddress(user.get("ethAddress"));
        // })
        // .catch(err => console.log(err))
        const accounts = await web3.eth.getAccounts();
        console.log(accounts);
    }

    async function handleForm(e) {
        e.preventDefault();
        console.log(registrationInfo);
        // const fetched = await fetch("http://localhost:8080/",{method: 'POST'});
        // const doc = await fetched.json();
        // console.log(doc);
        // const accounts = await web3.eth.getAccounts()
        
        //handle the data and send them to the db
        //if recieves an error show an error msg
        //else show the success msg
        //clear the fields of form
    }

    return(
        <div>
            <div>
                {/**Image goes here */}
            </div>
            <div>
                <h1>Registration Form</h1>
                <form onSubmit={handleForm} onChange={handleChange}>
                    <label htmlFor='name'>Name:</label><br/>
                    <input type='text' name='name' value={registrationInfo.name} required/><br/>
                    <label htmlFor='dob'>Date of Birth:</label><br/>
                    <input type='date' name='dob' value={registrationInfo.dateOfBirth} required/><br/>
                    <label htmlFor="guardianName">Father's/Mother's Name:</label><br/>
                    <input type='text' name='guardianName' value={registrationInfo.guardianName} required/><br/>
                    <label htmlFor='email'>Email:</label><br/>
                    <input type='email' name='email' value={registrationInfo.email} required/><br/>
                    <label htmlFor='phoneNo'>Mobile Number:</label><br/>
                    <input type='number' name='phoneNo' value={registrationInfo.phoneNumber} required/><br/>
                    <label htmlFor='password'>Password:</label><br/>
                    <input type='password' name='password' value={registrationInfo.password} required/><br/>
                    <label htmlFor='rePassword'>Re-Password:</label><br/>
                    <input type='password' name='rePassword' required/><br/>
                    <label htmlFor='aadhar'>Aadhar Number:</label><br/>
                    <input type='number' name='aadhar' value={registrationInfo.aadharNumber} required/><br/>
                    <label htmlFor='address'>Blockchain address:</label><br/>
                    <input type='text' name='address' value={registrationInfo.address} disabled/><button onClick={getAddress}>Get address</button><br/>
                    <button type='submit'>Register</button>
                </form>
            </div>
        </div>
    )
}