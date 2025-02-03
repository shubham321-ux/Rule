import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/config";
import Header from "../components/Header";
import "../css/LoginPage.css";
import { login, register } from "../actions/userAction";
import axios from 'axios'; // Import axios for API calls

const Login = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const navigation = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });
    const [registerData, setRegisterData] = useState({
        name: "",
        email: "",
        password: "",
        avatar: null // Add avatar property to track the file
    });
    const [alertMessage, setAlertMessage] = useState(null);

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

    // Handle file input change for avatar
    const handleFileChange = (e) => {
        setRegisterData({
            ...registerData,
            avatar: e.target.files[0] // Store the selected file in state
        });
    };

    const submitLogin = async (e) => {
        e.preventDefault();
        const response = await dispatch(login(loginData.email, loginData.password));
        if (isAuthenticated) {
            console.log("Login successful!");
            // Reset login form fields
            setLoginData({
                email: "",
                password: ""
            });
            // Navigate to home page
            navigation("/");
        } else {
            console.log("Login failed.");
            // setAlertMessage(response.message); // Set the error message in alert
        }
    };

    const submitRegister = async (e) => {
        e.preventDefault();

        const { name, email, password, avatar } = registerData;

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        if (avatar) {
            formData.append("avatar", avatar);  // Make sure 'avatar' is the correct field name in multer
        }

        try {
            // Get the response from the register action
            const response = await dispatch(register(formData));

            // Check if the response has a success property
            if (response && response.success) {
                console.log("Registration successful!");
                // Reset registration form fields
                setRegisterData({
                    name: "",
                    email: "",
                    password: "",
                    avatar: null
                });
                // Navigate to home page
                navigation("/");
            } else {
                // If the response doesn't have success, show the message
                console.log("Registration failed.");
                setAlertMessage(response ? response.message : "An error occurred.");
            }
        } catch (error) {
            console.error("Registration error:", error);
            setAlertMessage("Registration failed. Please try again later.");
        }
    };

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigation("/");
        }
    }, [isAuthenticated, navigation]);

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
                                    {alertMessage && (
                                        <div className="alert alert-danger">
                                            {alertMessage}
                                        </div>
                                    )}
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
                                            <div className="mb-4">
                                                <label className="form-label">Avatar (Optional)</label>
                                                <input
                                                    type="file"
                                                    className="form-input"
                                                    name="avatar"
                                                    onChange={handleFileChange}
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
