import { useState } from "react";
import { auth, db } from "../controllers/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";

export default function Login({ email }) {
    const [modal, setModal] = useState(false);

    const loginUser = async (e) => {
        try {
            e.preventDefault();
            const email = e.target.elements.email.value;
            const password = e.target.elements.password.value;
            const userCreds = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            console.log(userCreds);
        } catch (error) {
            if (error.code === "auth/wrong-password") {
                setModal(true);
                console.log("Wrong password.");
            } else {
                console.log(error.code);
            }
        }
    };

    return (
        <div className="box container is-max-widescreen">
            {modal ? (
                <div class="modal is-active">
                    <div class="modal-background"></div>
                    <div class="modal-card">
                        {/* <section class="modal-card-body">Hey</section>
                        <footer class="modal-card-foot">
                            <button class="button is-danger">Okay</button>
                        </footer> */}
                        <div className="notification is-danger is-light">
                            Credential's didn't match. Please try again.
                        </div>
                        <button
                            class="button is-danger"
                            onClick={() => setModal(false)}
                        >
                            Okay
                        </button>
                    </div>
                </div>
            ) : null}
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
                        <button type="submit" className="button is-link">
                            Login
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
