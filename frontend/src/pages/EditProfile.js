import React, { useState } from 'react';
import { ReactComponent as EditIcon } from '../assest/Edit.svg';
import { useSelector, useDispatch } from 'react-redux';
import "./css/EditProfile.css";

const DefaultAvatar = () => (
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="49" fill="#F3F4F6" stroke="#E5E7EB" strokeWidth="2"/>
        <path d="M50 45C54.4183 45 58 41.4183 58 37C58 32.5817 54.4183 29 50 29C45.5817 29 42 32.5817 42 37C42 41.4183 45.5817 45 50 45Z" fill="#9CA3AF"/>
        <path d="M66 71C66 63.268 58.837 57 50 57C41.163 57 34 63.268 34 71" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
    </svg>
);

const EditProfile = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.user);
    const [formData, setFormData] = useState({
        name: user?.user?.name || '',
        email: user?.user?.email || '',
        avatar: null
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                avatar: file
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Add your update profile logic here
        const updateData = new FormData();
        updateData.append('name', formData.name);
        updateData.append('email', formData.email);
        if (formData.avatar) {
            updateData.append('avatar', formData.avatar);
        }
        // Dispatch update profile action
    };

    return (
        <div className='edit-profile'>
            <div className="profile-headings">
                <h3 className="heading-links">
                    <span className='profile-home'>Home</span>
                    &gt;
                    <span className='profile-Setting'>Setting</span>
                </h3>
                <h2 className="profile-heading">Setting</h2>
            </div>

            <form className="profile-form" onSubmit={handleSubmit}>
                <div className="profile-addprofile">
                    <h1 className="profle-form-heading">Profile</h1>
                    <div className="profile-profile-input">
                        {user?.user?.avatar?.url ? (
                            <img 
                                src={user.user.avatar.url} 
                                alt="Profile" 
                                className="profile-pic" 
                            />
                        ) : (
                            <div className="profile-pic default-avatar">
                                <DefaultAvatar />
                            </div>
                        )}
                        <div className="profile-icon-container">
                            <label htmlFor="avatar-upload">
                                <EditIcon className="edit-icon" />
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                />
                            </label>
                        </div>
                    </div>
                </div>

                <div className="profile-input">
                    <label htmlFor="name" className="profile-label">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="profile-field"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your name"
                        required
                    />
                </div>

                <div className="profile-input">
                    <label htmlFor="email" className="profile-label">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="profile-field"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        required
                    />
                </div>

                <button type="submit" className="submit-button">
                    Save Profile
                </button>
            </form>
        </div>
    );
};

export default EditProfile;
