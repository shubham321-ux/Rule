import React from "react";
import { useDispatch,useSelector } from "react-redux";
import { logout } from "../actions/userAction";
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const LogoutFun = () => {
        dispatch(logout());
        navigate('/login');  // Redirect to login page after logout
    };

    return <>
    {isAuthenticated && <button onClick={LogoutFun}>Logout</button>}
    </>
};

export default LogoutButton;
