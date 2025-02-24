import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { FaBox, FaPlus, FaListAlt, FaShoppingCart, FaChartBar, FaUsers, FaUserCog } from "react-icons/fa";
import "./css/dashboard.css";

const DashboardHome = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <div className="dashboard-wrapper">
            {/* <div className="dashboard-header">
            <h2 className="create-product-heading">Admin Dashboard</h2>
            </div> */}
           
            <div className="dashboard-container">
                <div className="dashboard-sidebar">
                    <div className="sidebar-content">
                        <h2>Admin Panel</h2>
                        <nav>
                            <div className="nav-group">
                                <h3>Products</h3>
                                <Link to="/dashboard/products-forAdmin" className={isActive("/dashboard/products-forAdmin") ? "active" : ""}>
                                    <div className="icon-container">
                                        <FaBox size={24} />
                                    </div>
                                    <span>All Products</span>
                                </Link>
                                <Link to="/dashboard/create-product" className={isActive("/dashboard/create-product") ? "active" : ""}>
                                    <div className="icon-container">
                                        <FaPlus size={24} />
                                    </div>
                                    <span>Add Product</span>
                                </Link>
                                <Link to="/dashboard/create-category" className={isActive("/dashboard/create-category") ? "active" : ""}>
                                    <div className="icon-container">
                                        <FaListAlt size={24} />
                                    </div>
                                    <span>Add Category</span>
                                </Link>
                            </div>
                           
                            <div className="nav-group">
                                <h3>Orders</h3>
                                <Link to="/dashboard/allorders" className={isActive("/dashboard/orders") ? "active" : ""}>
                                    <div className="icon-container">
                                        <FaShoppingCart size={24} />
                                    </div>
                                    <span>View Orders</span>
                                </Link>
                                {/* <Link to="/dashboard/order-stats" className={isActive("/dashboard/order-stats") ? "active" : ""}>
                                    <div className="icon-container">
                                        <FaChartBar size={24} />
                                    </div>
                                    <span>Order Statistics</span>
                                </Link> */}
                            </div>
                           
                            <div className="nav-group">
                                <h3>Users</h3>
                                <Link to="/dashboard/allusers" className={isActive("/dashboard/users") ? "active" : ""}>
                                    <div className="icon-container">
                                        <FaUsers size={24} />
                                    </div>
                                    <span>Manage Users</span>
                                </Link>
                                {/* <Link to="/dashboard/roles" className={isActive("/dashboard/roles") ? "active" : ""}>
                                    <div className="icon-container">
                                        <FaUserCog size={24} />
                                    </div>
                                    <span>User Roles</span>
                                </Link> */}
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
