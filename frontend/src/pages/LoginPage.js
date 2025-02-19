import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, register } from "../actions/userAction";
import "./css/LoginPage.css";
import Loading from "../components/Loading";

const Login = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.user);
  const navigation = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    avatar: null,
  });
  const [alertMessage, setAlertMessage] = useState(null);

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setRegisterData({
      ...registerData,
      avatar: e.target.files[0],
    });
  };

  const submitLogin = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login(loginData.email, loginData.password));
    } catch (error) {
      setAlertMessage(error.message || "An error occurred during login.");
    }
  };

  const submitRegister = async (e) => {
    e.preventDefault();
    const { email, name, password, avatar } = registerData;
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      if (avatar) {
        formData.append("avatar", avatar);
      }
      await dispatch(register(formData));
    } catch (error) {
      setAlertMessage("An error occurred during registration. Please try again.");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigation("/");  
    }
  }, [isAuthenticated, navigation]);

  return (
    <>
      {loading && <Loading />}  {/* Show loading overlay if loading is true */}
      <div className="login-container">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="auth-card">
                <div className="form-header">
                  <div className="d-flex justify-content-around">
                    <button
                      className={`switch-button ${isLogin ? "active" : "inactive"}`}
                      onClick={() => setIsLogin(true)}
                    >
                      Login
                    </button>
                    <button
                      className={`switch-button ${!isLogin ? "active" : "inactive"}`}
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
                      <button type="submit" className="submit-button">
                        Login
                      </button>
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
                      <button type="submit" className="submit-button">
                        Register
                      </button>
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
