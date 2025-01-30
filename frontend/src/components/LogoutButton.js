import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../actions/userAction";
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const LogoutFun = () => {
        dispatch(logout());
        navigate('/login');  // Redirect to login page after logout
    };

    return <button onClick={LogoutFun}>Logout</button>;
};

export default LogoutButton;
