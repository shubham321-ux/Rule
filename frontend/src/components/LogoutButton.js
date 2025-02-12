import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/userAction";
import { useNavigate } from 'react-router-dom';
import './css/LogoutButton.css';
const LogoutButton = () => {
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const LogoutFun = () => {
        dispatch(logout());
        navigate('/login');  
    };

    return (
        <>
            {isAuthenticated && (
                <button 
                    className="logout-button" 
                    onClick={LogoutFun}
                >
                    Logout
                </button>
            )}
        </>
    );
};

export default LogoutButton;
