import { useEffect, useState } from "react";
import { auth } from "../controllers/firebaseConfig";
import { fetchSignInMethodsForEmail } from "firebase/auth";
import Signup from "../components/Signup";
import Login from "../components/Login";

export default function Auth() {
    const [authType, setAuthType] = useState("");
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        console.log("Auth Page");
    }, [authType]);

    const checkEmail = (e) => {
        e.preventDefault();
        const email = e.target.elements.email.value;
        fetchSignInMethodsForEmail(auth, email)
            .then((signInMethods) => {
                if (signInMethods.length > 0) {
                    setAuthType("login");
                } else {
                    setAuthType("signup");
                }
                console.log(signInMethods);
            })
            .catch((error) => {
                // Handle errors here
                setAuthType("signup");
            });
        setUserEmail(email);
    };

    return (
        <div>
            {(() => {
                if (authType == "signup") {
                    return <Signup email={userEmail} />;
                } else if (authType == "login") {
                    return <Login email={userEmail} />;
                } else {
                    return (
                        <div className="box container is-max-widescreen">
                            <p className="title">Authentication</p>
                            <form onSubmit={checkEmail}>
                                <div className="field">
                                    <label className="label">Email</label>
                                    <div className="control">
                                        <input
                                            className="input"
                                            name="email"
                                            type="email"
                                            placeholder="Email"
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
                                            Continue
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    );
                }
            })()}
        </div>
    );
}
