import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import bgimg from '../Stylesheets/signupbg.JPG';
import '../Stylesheets/signup.css'

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        axios.post('http://localhost:8081/signup', { username, email, password })
            .then(res => {
                console.log(res);
                if (res.data.success) {
                    console.log(res.data.message);
                    navigate('/home');
                } else {
                    alert("Signup failed: " + res.data.message);
                }
            })
            .catch(err => {
                console.log(err);
                if (err.response && err.response.status === 409) {
                    alert("User is already registered with this Email.");
                } else {
                    alert("Signup failed: " + (err.response ? err.response.data.message : "Unknown error"));
                }
            });
    }

    return (
        <>
            <div style={{ backgroundImage: `url(${bgimg})`, backgroundSize: 'cover', height: '100vh' }}>
                <form className="su" onSubmit={handleSubmit}>
                    <div id="s_head">
                        <h2 className="s_dol"> $ </h2>
                        <h2 className="s_Acc">Account</h2>
                        <h2 className="s_Mas">Master</h2>
                    </div>
                    <br />
                    <div id="s_mid">
                        <h2>Sign Up</h2>
                        <br />
                        <div className="cun">
                            <h3>Create Username:</h3>
                            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required/>
                        </div>
                        <div className="email">
                            <br />
                            <h3>Enter Email Id:</h3>
                            <input type="text" value={email} onChange={e => setEmail(e.target.value)} required/>
                        </div>
                        <div className="s_pass">
                            <br />
                            <h3>Create Password:</h3>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required/>
                        </div>
                        <br />
                        <button className='signup'>Sign Up</button>
                        <br />
                        <br />
                        <div className="button2">
                        <h5>Already Have An Account ?</h5>
                        <Link to="/" className="login-button">Log In</Link>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Signup;