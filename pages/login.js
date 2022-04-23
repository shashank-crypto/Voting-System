import Link from 'next/link';

export default function LoginPage()  {
    return(
        <div>
            <div>
                {/**image comes here */}
                
            </div>
            <div>
                {/**on form submit -> make a request through api */}
                <h1>Login</h1>
                <form>
                    <label for='email'>Email:</label><br/>
                    <input type='email' name='email' required/><br/>
                    <label for='password'>Password:</label><br/>
                    <input type='password' name='password' required/><br/>
                    {/**This will take an email and the address if they match from the db they have the option to change*/}
                    <span>Forgot Password?</span><br/>
                    <span>Not registered?</span><Link href='/register'>Register now</Link><br/>
                    <button type='submit'>Login</button>
                </form>
            </div>
        </div>
    )
}
