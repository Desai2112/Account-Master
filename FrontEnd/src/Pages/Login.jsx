import React, { useContext, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; 
import '../Stylesheets/login.css';
import img from "../Stylesheets/IMG_0423.JPG";
import {AppContext} from '../App'

const Login = () => {
    const appContext = useContext(AppContext);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();


function handleSubmit(event) {
    event.preventDefault();
    axios.post('http://localhost:8081/login', { username, password })
        .then(res => {
            console.log(res);
            if (res.data.success) { 
                localStorage.setItem("token", res.data.token);
                console.log(res.data.message);
                navigate('/Home');
            } else {
                console.error(res.data.message);
                alert("Login failed: " + res.data.message);
            }
        })
        .catch(err => {
            console.log(err);
            if (err.response && err.response.status === 401) {
                alert("Invalid Username or Password.");
            } else {
                alert("Login failed: " + (err.response ? err.response.data.message : "Unknown error"));
            }
        });
}

    return (
        <>
            <div className='loginPage'>
                <div className='loginElement'>
                    <div style={{ backgroundImage: `url(${img})`, backgroundSize: 'cover', height: '100vh', zIndex: -1 }}>
                        <form onSubmit={handleSubmit}>
                            <div id="mid">
                                <div id="head">
                                    <div id="title">
                                        <h2 className="dol"> $ </h2>
                                        <h2 className="Acc">Account</h2>
                                        <h2 className="Mas">Master</h2>
                                    </div>
                                </div>
                                <br />
                                <h2>Login</h2>
                                <br />

                                <div className="un">
                                    <h3>Username:</h3>
                                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
                                </div>
                                <div className="pass">
                                    <br />
                                    <h3>Password:</h3>
                                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                                </div>
                                <br />

                                <button className='signup-button'>
                                    Login
                                </button>
                                <br />

                                <div className="button2">
                                    <br />
                                    <h5>Don't Have An Account ?</h5>
                                    <Link to="/signup" className="signup-button">Sign Up</Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login;