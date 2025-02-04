import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createProduct } from "../actions/productAction";
import Header from '../components/Header';
const CreateProduct = () => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: ''
    });
    const [images, setImages] = useState([]);
    const [productPDF, setProductPDF] = useState(null);
    const [previewImages, setPreviewImages] = useState([]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages([]);
        setPreviewImages([]);

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setPreviewImages(old => [...old, reader.result]);
                    setImages(old => [...old, file]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handlePdfChange = (e) => {
        setProductPDF(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const productData = new FormData();
        
        // Add text data
        Object.keys(formData).forEach(key => {
            productData.append(key, formData[key]);
        });
        
        // Add images
        images.forEach((image) => {
            productData.append("images", image);
        });
        
        // Add PDF
        if (productPDF) {
            productData.append("productPDF", productPDF);
        }

        try {
            await dispatch(createProduct(productData));
            
            // Reset form
            setFormData({
                name: '',
                description: '',
                price: '',
                category: '',
                stock: ''
            });
            setImages([]);
            setPreviewImages([]);
            setProductPDF(null);
            
            // Reset file inputs
            document.getElementById('imageInput').value = '';
            document.getElementById('pdfInput').value = '';
        } catch (error) {
            console.error('Error creating product:', error);
        }
    };

    return (
        <div className="create-product-container">
            <Header/>
            <h2>Create New Product</h2>
            <form onSubmit={handleSubmit} className="product-form" encType="multipart/form-data">
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Price:</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Category:</label>
                    <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Stock:</label>
                    <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Images:</label>
                    <input
                        id="imageInput"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    <div className="image-preview">
                        {previewImages.map((image, index) => (
                            <img 
                                key={index} 
                                src={image} 
                                alt={`preview-${index}`} 
                                style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '5px' }}
                            />
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Product Manual (PDF):</label>
                    <input
                        id="pdfInput"
                        type="file"
                        accept=".pdf"
                        onChange={handlePdfChange}
                    />
                </div>

                <button type="submit" className="submit-btn">
                    Create Product
                </button>
            </form>
        </div>
    );
};

export default CreateProduct;
