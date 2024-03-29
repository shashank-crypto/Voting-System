import { useEffect, useState } from "react";
import { auth, db } from "../controllers/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { getWalletAddress } from "../controllers/contractConnect";
import { useRouter } from "next/router";

const Signup = ({ email }) => {

    const { push } = useRouter();

    const [walletId, setWalletId] = useState("");
    const [modal, setModal] = useState(false);

    const createUser = async (e) => {
        try{
            e.preventDefault();
            const email = e.target.elements.email.value;
            const password = e.target.elements.password.value;
            const name = e.target.elements.name.value;
            const age = e.target.elements.age.value;
            const aadhar = e.target.elements.aadhar.value;
            const phone = e.target.elements.phone.value;
            const userCreds = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            console.log(
                "email: ",
                email,
                "password: ",
                password,
                "walletID: ",
                walletId,
                "userCreds: ",
                userCreds
            );
            if (walletId === "") await setWalletAddress();
            await setDoc(doc(db, "User", userCreds.user.uid), {
                email: email,
                name : name,
                age : age,
                aadhar : aadhar,
                phone : phone,
                walletId: walletId
            });
            push("/main");
        }
        catch(error){
            console.log(error);
            setModal(true);
            console.log(error.code);
        }
    };

    const setWalletAddress = async () => {
        const walletAddress = await getWalletAddress();
        if (walletAddress) setWalletId(walletAddress);
    };

    useEffect(() => {
        console.log("Signup.jsx loaded");
        setWalletAddress();
        console.log("walletId: ", walletId);
    }, [walletId]);

    return (
        <div className="box container is-max-widescreen">
            {modal ? (
                <div className="modal is-active">
                    <div className="modal-background"></div>
                    <div className="modal-card">
                        {/* <section className="modal-card-body">Hey</section>
                        <footer className="modal-card-foot">
                            <button className="button is-danger">Okay</button>
                        </footer> */}
                        <div className="notification is-danger is-light">
                            Something went wrong. Please try again.
                        </div>
                        <button
                            className="button is-danger"
                            onClick={() => setModal(false)}
                        >
                            Okay
                        </button>
                    </div>
                </div>
            ) : null}
            <p className="title">Signup</p>
            <form onSubmit={createUser}>
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
                    <label className="label">Name</label>
                    <div className="control">
                        <input
                            className="input"
                            name="name"
                            type="text"
                            placeholder="Name"
                            required
                        />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Age</label>
                    <div className="control">
                        <input
                            className="input"
                            name="age"
                            type="text"
                            placeholder="Age (min 18 years)"
                            required
                        />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Aadhar Number</label>
                    <div className="control">
                        <input
                            className="input"
                            name="aadhar"
                            type="text"
                            placeholder="1234 5678 9012"
                            required
                        />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Phone Number</label>
                    <div className="control">
                        <input
                            className="input"
                            name="phone"
                            type="text"
                            placeholder="+91 1234567890"
                            required
                        />
                    </div>
                </div>

                <div className="field">
                    <label className="label">WalletID</label>
                    <div className="control">
                        <input
                            className={
                                walletId === "" ? "input is-danger" : "input"
                            }
                            name="walletId"
                            type="text"
                            placeholder="WalletID"
                            defaultValue={walletId === "" ? null : walletId}
                            readOnly
                            required
                        />
                    </div>
                    {walletId === "" ? (
                        <p className="help is-danger">
                            Wallet didn't connect, please setup your wallet and
                            refresh the page.
                        </p>
                    ) : null}
                </div>

                <div className="field">
                    <div className="control">
                        <label className="checkbox">
                            <input type="checkbox" required />I agree to the{" "}
                            <a href="#">terms and conditions</a>
                        </label>
                    </div>
                </div>

                <div className="field">
                    <div className="control">
                        <button
                            type="submit"
                            className="button is-link"
                            disabled={walletId === ""}
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Signup;
