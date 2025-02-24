import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, updateUserRole, deleteUser } from '../actions/userAction';
import Loading from '../components/Loading';
import './css/UsersManagement.css';

const UsersManagement = () => {
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const { 
        loading, 
        users, 
        totalUsers, 
        resultsPerPage, 
        error 
    } = useSelector((state) => state.user);
    const { isUpdated, isDeleted } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getAllUsers(page));
    }, [dispatch, page, isUpdated, isDeleted]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleRoleUpdate = (userId, newRole) => {
        if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
            dispatch(updateUserRole(userId, newRole));
        }
    };

    const handleDeleteUser = (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            dispatch(deleteUser(userId));
        }
    };

    if (loading) return <Loading />;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="products-list-container">
         
         <div className="users-management-container">
         <h2 className="create-product-heading">Users Management</h2>
            <div className="users-stats">
                <span>Total Users: {totalUsers}</span>
                <span>Page {page} of {Math.ceil(totalUsers / resultsPerPage)}</span>
            </div>
            <table className="products-table">
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users && users ?.map((user) => (
                        <tr key={user._id}>
                            <td>#{user._id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <select
                                    value={user.role}
                                    onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                                    className={`role-select ${user.role.toLowerCase()}`}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </td>
                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                            <td>
                                <button
                                    onClick={() => handleDeleteUser(user._id)}
                                    className="btn-delete"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {totalUsers > resultsPerPage && (
                <div className="pagination">
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="page-btn"
                    >
                        Previous
                    </button>
                    <span className="page-info">
                        Page {page} of {Math.ceil(totalUsers / resultsPerPage)}
                    </span>
                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === Math.ceil(totalUsers / resultsPerPage)}
                        className="page-btn"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
        </div>
    );
};

export default UsersManagement;
