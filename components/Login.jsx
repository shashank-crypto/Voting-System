import { useState } from 'react';
import { auth, db } from '../controllers/firebaseConfig'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';

export  default function Login ({email}) {

    const loginUser = async (e) => {
        e.preventDefault();
        const email = e.target.elements.email.value;
        const password = e.target.elements.password.value;
        const userCreds = await signInWithEmailAndPassword(auth, email, password)
        console.log(userCreds)
    }

    return (
        <div className="box container is-max-widescreen">
             <p className="title">Login</p>
            <form onSubmit={loginUser}>
                <div className="field">
                    <label className="label">Email</label>
                    <div className="control">
                        <input
                            className="input"
                            name="email"
                            type="email"
                            placeholder="Email"
                            defaultValue={email}
                            required
                        />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Password</label>
                    <div className="control">
                        <input
                            className="input"
                            name="password"
                            type="password"
                            placeholder="Password"
                            required
                        />
                    </div>
                </div>

                <div className="field">
                    <div className="control">
                        <button
                            type="submit"
                            className="button is-link"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
