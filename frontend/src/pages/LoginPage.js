import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Header from "../components/Header";
import "../css/LoginPage.css";
import { login } from "../actions/userAction";
import { register } from "../actions/userAction";

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
        password: "",
        avatar: null // Store file data (avatar)
    });

    const handleLoginChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegisterChange = (e) => {
        if (e.target.name === "avatar") {
            const file = e.target.files[0];
            if (file && file.size > 2000000) { // 2MB size limit
                alert("Avatar file size should be less than 2MB");
                return;
            }
            setRegisterData({
                ...registerData,
                avatar: file
            });
        } else {
            setRegisterData({
                ...registerData,
                [e.target.name]: e.target.value
            });
        }
    };
    

    const submitLogin = (e) => {
        e.preventDefault();
        dispatch(login(loginData.email, loginData.password)); // Dispatch login action
    };
    const submitRegister = (e) => {
        e.preventDefault();
    
        const { name, email, password, avatar } = registerData;
    
        if (!avatar) {
            return alert("Please upload an avatar!");
        }
    
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("avatar", avatar); // Ensure avatar is correctly attached
    
        // Send the formData to your backend
        dispatch(register(formData)); // Call the register action
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
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="form-label">Avatar</label>
                                                <input
                                                    type="file"
                                                    className="file-input"
                                                    name="avatar"
                                                    accept="image/*"
                                                    onChange={handleRegisterChange} // Handle avatar upload
                                                />
                                                {registerData.avatar && (
                                                    <img
                                                        src={URL.createObjectURL(registerData.avatar)} // Preview the avatar image
                                                        alt="Avatar Preview"
                                                        className="avatar-preview"
                                                    />
                                                )}
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
