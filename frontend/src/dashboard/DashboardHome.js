import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./css/dashboard.css";

const DashboardHome = () => {
    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-header">
                <h1>Admin Dashboard</h1>
            </div>
            
            <div className="dashboard-container">
                <div className="dashboard-sidebar">
                    <div className="sidebar-content">
                        <h2>Admin Panel</h2>
                        <nav>
                            <div className="nav-group">
                                <h3>Products</h3>
                                <Link to="/dashboard/products-forAdmin">All Products</Link>
                                <Link to="/dashboard/create-product">Add Product</Link>
                                <Link to="/dashboard/create-category">Add Category</Link>
                            </div>
                            
                            <div className="nav-group">
                                <h3>Orders</h3>
                                <Link to="/dashboard/orders">View Orders</Link>
                                <Link to="/dashboard/order-stats">Order Statistics</Link>
                            </div>
                            
                            <div className="nav-group">
                                <h3>Users</h3>
                                <Link to="/dashboard/users">Manage Users</Link>
                                <Link to="/dashboard/roles">User Roles</Link>
                            </div>
                        </nav>
                    </div>
                </div>
                
                <div className="dashboard-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
