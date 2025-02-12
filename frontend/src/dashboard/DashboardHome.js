import React, { useState } from "react";
import CreateProduct from "./Createproduct";
import CreateCategoryForm from "./CreateCategoryForm";
import Header from "../components/Header";
import PopupModal from "../components/PopupModal";
import ProductsForAdmin from "./ProductsForAdmin";
const DashboardHome = () => {
    const [isCreateProductModalOpen, setIsCreateProductModalOpen] = useState(false);
    const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false);

    const openCreateProductModal = () => {
        setIsCreateProductModalOpen(true);
    };

    const closeCreateProductModal = () => {
        setIsCreateProductModalOpen(false);
    };

    const openCreateCategoryModal = () => {
        setIsCreateCategoryModalOpen(true);
    };

    const closeCreateCategoryModal = () => {
        setIsCreateCategoryModalOpen(false);
    };

    return (
        <div>
            {/* <Header /> */}
            <h1>Welcome to Dashboard</h1>
            <button onClick={openCreateProductModal}>Create Product</button>
            <button onClick={openCreateCategoryModal}>Create Category</button>
<ProductsForAdmin/>
            {/* Product Creation Modal */}
            <PopupModal show={isCreateProductModalOpen} onClose={closeCreateProductModal}>
                <h2>Create New Product</h2>
                <CreateProduct />
            </PopupModal>

            {/* Category Creation Modal */}
            <PopupModal show={isCreateCategoryModalOpen} onClose={closeCreateCategoryModal}>
                <h2>Create New Category</h2>
                <CreateCategoryForm />
            </PopupModal>
        </div>
    );
};

export default DashboardHome;
