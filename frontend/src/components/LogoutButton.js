import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/userAction";
import { useNavigate } from 'react-router-dom';
import './css/LogoutButton.css';
import Loading from "../components/Loading";  

const LogoutButton = () => {
    const { isAuthenticated } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loadingState, setLoadingState] = useState(false);  // For internal loading state
    const [errorMessage, setErrorMessage] = useState(null);  // For error message

    const LogoutFun = async () => {
        setLoadingState(true);  // Show loading state
        setErrorMessage(null);  // Reset any previous errors

        try {
            // Dispatch logout action
            await dispatch(logout());

            // Simulate a 2-second loading delay (you can remove this once it's connected to a real API)
            setTimeout(() => {
                setLoadingState(false);  // Hide loading state
                navigate('/');  // Redirect to home page after logout
            }, 2000);

        } catch (error) {
            setLoadingState(false);  // Hide loading if error occurs
            setErrorMessage(error.message || "An error occurred during logout.");
        }
    };

    return (
        <>
            {loadingState ? (
                <Loading />  // Show loading component while processing
            ) : (
                isAuthenticated && (
                    <>
                        <button 
                            className="logout-button" 
                            onClick={LogoutFun}
                        >
                            Logout
                        </button>
                        {errorMessage && (
                            <div className="alert alert-danger mt-2">
                                {errorMessage}
                            </div>
                        )}
                    </>
                )
            )}
        </>
    );
};

export default LogoutButton;
