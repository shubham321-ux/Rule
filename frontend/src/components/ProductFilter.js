import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories } from '../actions/categoryAction';
import { useSearchParams } from 'react-router-dom';
import './css/ProductFilter.css';

const ProductFilter = ({ onPriceRangeChange, onCategoryChange }) => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories } = useSelector((state) => state.category);
  
  const [priceRange, setPriceRange] = useState({ 
    min: Number(searchParams.get('minPrice')) || 0,
    max: Number(searchParams.get('maxPrice')) || 20000
  });
  
  const [selectedCategories, setSelectedCategories] = useState(
    searchParams.get('categories')?.split(',').filter(Boolean) || []
  );

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleRangeChange = (e) => {
    const { name, value } = e.target;
    const newRange = { ...priceRange, [name]: parseInt(value) };
    
    setPriceRange(newRange);
    
    const params = new URLSearchParams(searchParams);
    params.set('minPrice', newRange.min);
    params.set('maxPrice', newRange.max);
    setSearchParams(params);
    onPriceRangeChange(newRange.min, newRange.max);
  };

  const handleCategoryChange = (category) => {
    const categoryName = category.name;
    const updatedCategories = selectedCategories.includes(categoryName)
      ? selectedCategories.filter(name => name !== categoryName)
      : [...selectedCategories, categoryName];
    
    setSelectedCategories(updatedCategories);
    
    const params = new URLSearchParams(searchParams);
    if (updatedCategories.length > 0) {
      params.set('categories', updatedCategories.join(','));
    } else {
      params.delete('categories');
    }
    setSearchParams(params);
    onCategoryChange(updatedCategories);
  };

  return (
    <div className="product-filter">
      {/* <h3>Filter Products</h3> */}
      <div className="category-filter">
        <h4>Categories</h4>
        <div className="category-list">
          {categories?.map((category) => (
            <label key={category._id} className="category-item">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.name)}
                onChange={() => handleCategoryChange(category)}
              />
              <span>{category.name}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div className="price-filter">
        <h4>Price Range (₹)</h4>
        <div className="range-inputs">
          <div className="range-slider">
            <input
              type="range"
              name="min"
              min="0"
              max="100"
              step="1"
              value={priceRange.min}
              onChange={handleRangeChange}
              className="range-input"
            />
            <input
              type="range"
              name="max"
              min="0"
              max="100"
              step="1"
              value={priceRange.max}
              onChange={handleRangeChange}
              className="range-input"
            />
            <div className="range-track"></div>
          </div>
        </div>
        <div className="price-values">
          <span>Min: ₹{priceRange.min}</span>
          <span>Max: ₹{priceRange.max}</span>
        </div>
      </div>

      
    </div>
  );
};

export default ProductFilter;
