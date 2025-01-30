import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Header from "../components/Header";
import "../css/LoginPage.css";
import { login, register } from "../actions/userAction";

const Login = () => {
    const dispatch = useDispatch();
    const [isLogin, setIsLogin] = useState(true);
    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });
    const [registerData, setRegisterData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleLoginChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegisterChange = (e) => {
        setRegisterData({
            ...registerData,
            [e.target.name]: e.target.value
        });
    };

    const submitLogin = (e) => {
        e.preventDefault();
        dispatch(login(loginData.email, loginData.password)); // Dispatch login action
    };

    const submitRegister = (e) => {
        e.preventDefault();
        
        const { name, email, password, avatar } = registerData;
    
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        if (avatar) {
            formData.append("avatar", avatar); // Only append avatar if it exists
        }
    
        // Dispatch the action with formData
        dispatch(register(formData));
    };
    
    
    
    return (
        <>
            <Header />
            <div className="login-container">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="auth-card">
                                <div className="form-header">
                                    <div className="d-flex justify-content-around">
                                        <button
                                            className={`switch-button ${isLogin ? 'active' : 'inactive'}`}
                                            onClick={() => setIsLogin(true)}
                                        >
                                            Login
                                        </button>
                                        <button
                                            className={`switch-button ${!isLogin ? 'active' : 'inactive'}`}
                                            onClick={() => setIsLogin(false)}
                                        >
                                            Register
                                        </button>
                                    </div>
                                </div>
                                <div className="form-body">
                                    {isLogin ? (
                                        <form onSubmit={submitLogin}>
                                            <div className="mb-4">
                                                <label className="form-label">Email</label>
                                                <input
                                                    type="email"
                                                    className="form-input"
                                                    name="email"
                                                    value={loginData.email}
                                                    onChange={handleLoginChange}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="form-label">Password</label>
                                                <input
                                                    type="password"
                                                    className="form-input"
                                                    name="password"
                                                    value={loginData.password}
                                                    onChange={handleLoginChange}
                                                    required
                                                />
                                            </div>
                                            <button type="submit" className="submit-button">Login</button>
                                            <div className="forgot-password">
                                                <Link to="/forgot-password">Forgot Password?</Link>
                                            </div>
                                        </form>
                                    ) : (
                                        <form onSubmit={submitRegister}>
                                            <div className="mb-4">
                                                <label className="form-label">Name</label>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    name="name"
                                                    value={registerData.name}
                                                    onChange={handleRegisterChange}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="form-label">Email</label>
                                                <input
                                                    type="email"
                                                    className="form-input"
                                                    name="email"
                                                    value={registerData.email}
                                                    onChange={handleRegisterChange}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="form-label">Password</label>
                                                <input
                                                    type="password"
                                                    className="form-input"
                                                    name="password"
                                                    value={registerData.password}
                                                    onChange={handleRegisterChange}
                                                    required
                                                />
                                            </div>
                                            <button type="submit" className="submit-button">Register</button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
